import { AppDataSource } from "@/models/datasource.js";
import VmEntity from "@/models/entities/VmEntity.js";
import UserEntity from "@/models/entities/UserEntity.js";

const EXOSCALE_BASE_URL = process.env.EXOSCALE_API_URL || "http://localhost:4010";

export class ServiceError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ServiceError";
    }
}

export interface CreateVmParams {
    targetUserId: number;
    name: string;
    templateId?: string;
    instanceTypeId?: string;
    diskSize?: number;
}

export async function createVm({
                                   targetUserId,
                                   name,
                                   templateId = "00000000-0000-0000-0000-000000000000",
                                   instanceTypeId = "00000000-0000-0000-0000-000000000000",
                                   diskSize = 10
                               }: CreateVmParams): Promise<VmEntity> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const vmRepository = AppDataSource.getRepository(VmEntity);

    const targetUser = await userRepository.findOneBy({ userId: targetUserId });
    if (!targetUser) {
        throw new ServiceError(404, `Empfänger-Benutzer mit ID ${targetUserId} existiert nicht.`);
    }

    const existingVm = await vmRepository.findOneBy({
        userId: targetUser.userId,
        name: name
    });
    if (existingVm) {
        throw new ServiceError(409, `Der Empfänger besitzt bereits eine VM mit dem Namen '${name}'.`);
    }

    let response: globalThis.Response;
    try {
        response = await fetch(`${EXOSCALE_BASE_URL}/instance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                template: { id: templateId },
                "instance-type": { id: instanceTypeId },
                "disk-size": diskSize
            }),
            signal: AbortSignal.timeout(10000)
        });
    } catch (networkError: any) {
        console.error("Exoscale network error:", networkError);
        throw new ServiceError(502, "Cloud-Provider ist derzeit nicht erreichbar.");
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Exoscale API responded with status ${response.status}:`, errorText);
        throw new ServiceError(502, "Fehler bei der Bereitstellung der VM beim Cloud-Provider.");
    }

    const exoscaleData = await response.json();
    const instanceUuid = exoscaleData.id || exoscaleData.reference?.id;

    if (!instanceUuid) {
        console.error("Unexpected response from Exoscale:", exoscaleData);
        throw new ServiceError(502, "Ungültige Antwort vom Cloud-Provider erhalten.");
    }

    const newVm = vmRepository.create({
        uuid: instanceUuid,
        name: name,
        userId: targetUser.userId
    });
    return await vmRepository.save(newVm);
}
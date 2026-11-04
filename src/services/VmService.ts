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
    userId: number;
    name: string;
    templateId?: string;
    instanceTypeId?: string;
    diskSize?: number;
}

export async function createVm({
                                   userId,
                                   name,
                                   templateId = "00000000-0000-0000-0000-000000000000",
                                   instanceTypeId = "00000000-0000-0000-0000-000000000000",
                                   diskSize = 10
                               }: CreateVmParams): Promise<VmEntity> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const vmRepository = AppDataSource.getRepository(VmEntity);

    const user = await userRepository.findOneBy({ userId });
    if (!user) {
        throw new ServiceError(404, "Benutzer nicht gefunden.");
    }

    const existingVm = await vmRepository.findOneBy({ userId, name });
    if (existingVm) {
        throw new ServiceError(409, `Du besitzt bereits eine VM mit dem Namen '${name}'.`);
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
        console.error("Exoscale connection error:", networkError);
        throw new ServiceError(502, "Cloud-Provider ist derzeit nicht erreichbar.");
    }

    if (!response.ok) {
        const errorText = await response.text();
        // Log internally for debugging, but hide details from client
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
        name,
        userId: user.userId
    });

    return await vmRepository.save(newVm);
}
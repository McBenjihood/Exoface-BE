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
    templateId: string;
    instanceTypeId: string;
    diskSize?: number;
}
export interface InstanceType {
    id: string;
    family: string;
    size: string;
    cpus: number;
    memory: number;
    authorized?: boolean;
}
export interface VmTemplate {
    id: string;
    name: string;
    family?: string;
    description?: string;
    defaultUser?: string;
    size?: number;
}

export async function createVm({
                                   targetUserId,
                                   name,
                                   templateId,
                                   instanceTypeId,
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

export async function getInstanceTypes(): Promise<InstanceType[]> {
    let response: globalThis.Response;
    try {
        response = await fetch(`${EXOSCALE_BASE_URL}/instance-type`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            signal: AbortSignal.timeout(10000)
        });
    } catch (networkError: any) {
        console.error("Exoscale network error fetching instance types:", networkError);
        throw new ServiceError(502, "Cloud-Provider ist derzeit nicht erreichbar.");
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Exoscale API responded with status ${response.status}:`, errorText);
        throw new ServiceError(502, "Fehler beim Abrufen der Instanztypen vom Cloud-Provider.");
    }

    const data = await response.json();
    return data["instance-types"] || [];
}

export async function getTemplates(): Promise<VmTemplate[]> {
    let response: globalThis.Response;
    try {
        response = await fetch(`${EXOSCALE_BASE_URL}/template?visibility=public`, {
            method: "GET",
            headers: { "Accept": "application/json" },
            signal: AbortSignal.timeout(10000)
        });
    } catch (networkError: any) {
        console.error("Exoscale network error fetching templates:", networkError);
        throw new ServiceError(502, "Cloud-Provider ist derzeit nicht erreichbar.");
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Exoscale API responded with status ${response.status}:`, errorText);
        throw new ServiceError(502, "Fehler beim Abrufen der Templates vom Cloud-Provider.");
    }

    const data = await response.json();

    const rawTemplates = data.templates || [];

    return rawTemplates.map((t: any) => ({
        id: t.id,
        name: t.name,
        family: t.family,
        description: t.description,
        defaultUser: t["default-user"],
        size: t.size
    }));
}
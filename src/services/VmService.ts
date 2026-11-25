import { AppDataSource } from "@/models/datasource.js";
import VmEntity from "@/models/entities/VmEntity.js";
import UserEntity from "@/models/entities/UserEntity.js";
import {ENDPOINTS, ExoscaleClient, type TemplateRef} from "@exoscale/sdk";
import type {CreateVmParams, VmTemplate, InstanceType} from "@/interfaces/VmInterfaces.js";
import {ServiceError} from "@/errors/ServiceError.js";
import {In} from "typeorm";
import UserClassEntity from "@/models/entities/UserClassEntity.js";

const TARGET_ZONE = process.env.EXOSCALE_ZONE || "ch-dk-2";

export const exoscaleClient = new ExoscaleClient({
    endpoint: process.env.EXOSCALE_API_URL || ENDPOINTS["ch-dk-2"]
});

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

    let op;
    try {
        op = await exoscaleClient.createInstance({
            name,
            template: { id: templateId },
            instanceType: { id: instanceTypeId },
            diskSize,
            autoStart: false
        });
    } catch (error: any) {
        console.error("Exoscale SDK error creating instance:", error);
        throw new ServiceError(502, "Fehler bei der Bereitstellung der VM beim Cloud-Provider.");
    }

    const instanceUuid = op.reference?.id || op.id;

    if (!instanceUuid) {
        console.error("Unexpected response from Exoscale SDK:", op);
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
    try {
        const response = await exoscaleClient.listInstanceTypes();
        const rawTypes = response.instanceTypes || [];

        return rawTypes
            .filter((type: any) =>
                type.authorized === true &&
                Array.isArray(type.zones) &&
                type.zones.includes(TARGET_ZONE))
            .map((type: any) => ({
                id: type.id,
                family: type.family,
                size: type.size,
                cpus: type.cpus,
                memory: type.memory
            }));

    } catch (error: any) {
        console.error("Exoscale error fetching instance types:", error);
        throw new ServiceError(502, "Cloud-Provider ist derzeit nicht erreichbar.");
    }
}

export async function getTemplates(): Promise<VmTemplate[]> {
    try {
        const response = await exoscaleClient.listTemplates({ visibility: "public" });
        const rawTemplates = response.templates || [];

        return rawTemplates.map((t: any) => ({
            id: t.id,
            name: t.name,
            family: t.family,
            description: t.description,
            defaultUser: t["default-user"],
            size: t.size
        }));
    } catch (error: any) {
        console.error("Exoscale network error fetching templates:", error);
        throw new ServiceError(502, "Cloud-Provider ist derzeit nicht erreichbar.");
    }

}

export async function getVmList() {
    const vmRepository = AppDataSource.getRepository(VmEntity);
    const vms = await vmRepository.find();

    return vms.map(v => ({
        uuid: v.uuid,
        name: v.name,
        userId: v.userId
    }));
}

export async function resetVm(id: string, diskSize: number, template: TemplateRef){
    return await exoscaleClient.resetInstance({
        ...(diskSize != null ? { diskSize } : {}),
        id,
        ...(template != null ? { template } : {}),

    })
}

async function getAndAuthorizeVm(uuid: string, user: UserEntity): Promise<VmEntity> {
    const vmRepository = AppDataSource.getRepository(VmEntity);
    const userClassRepository = AppDataSource.getRepository(UserClassEntity);

    const vm = await vmRepository.findOne({
        where: { uuid },
        relations: { user: true }
    });

    if (!vm) {
        throw new ServiceError(404, "VM wurde nicht gefunden.");
    }

    const isOwner = vm.userId === user.userId;
    const isAdmin = user.role === "admin";
    let isTeacherOfStudentInSameClass = false;

    if (user.role === "teacher" && vm.user?.role === "student") {
        const teacherClasses = await userClassRepository.find({
            where: [
                { userId: user.userId },
                { user: { userId: user.userId } }
            ]
        });

        const teacherClassIds = teacherClasses.map((uc) => uc.classId);

        if (teacherClassIds.length > 0) {
            const sharedClass = await userClassRepository.findOne({
                where: [
                    { userId: vm.userId, classId: In(teacherClassIds) },
                    { user: { userId: vm.userId }, class: { classId: In(teacherClassIds) } }
                ]
            });

            isTeacherOfStudentInSameClass = !!sharedClass;
        }
    }

    if (!isOwner && !isAdmin && !isTeacherOfStudentInSameClass) {
        throw new ServiceError(
            403,
            "Zugriff verweigert: Fehlende Berechtigungen."
        );
    }

    return vm;
}

export async function startVm(uuid: string, user: UserEntity): Promise<void> {

    await getAndAuthorizeVm(uuid, user);

    try {
        await exoscaleClient.startInstance({ id: uuid });
    } catch (error: any) {
        console.error("Exoscale error starting VM:", error);
        throw new ServiceError(502, "Fehler beim Starten der VM beim Cloud-Provider.");
    }
}

export async function stopVm(uuid: string, user: UserEntity): Promise<void> {

    await getAndAuthorizeVm(uuid, user);

    try {
        await exoscaleClient.stopInstance({ id: uuid });
    } catch (error: any) {
        console.error("Exoscale error starting VM:", error);
        throw new ServiceError(502, "Fehler beim Starten der VM beim Cloud-Provider.");
    }
}

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
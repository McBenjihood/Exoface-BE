export class ServiceError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ServiceError";
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}
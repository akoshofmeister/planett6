import { injectable } from 'inversify';

@injectable()
export class HelloService {
    private _message: string;
    constructor() {
        this._message = "Hello from service";
    }

    public welcome(): string {
        return this._message;
    }
}
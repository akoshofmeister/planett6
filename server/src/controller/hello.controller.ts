import TYPES from '../constant/types';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { HelloService } from '../service/hello.service';

@controller('/')
export class HelloController {
    constructor(@inject(TYPES.HelloService)private helloService: HelloService) {
    }

    @httpGet('')
    public get(): string {
        return 'Works';
    }

    @httpGet('hello')
    public hello(): string {
        return this.helloService.welcome();
    }
}
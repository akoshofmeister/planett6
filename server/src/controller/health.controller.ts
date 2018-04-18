import { controller, httpGet } from 'inversify-express-utils';

@controller('/')
export class HealthController {
  constructor() {
  }

  @httpGet('health')
  public health(): any {
    return {
      success: true
    };
  }
}

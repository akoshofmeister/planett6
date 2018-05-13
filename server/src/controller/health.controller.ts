import { controller, httpGet } from 'inversify-express-utils';

@controller('/')
export class HealthController {
  @httpGet('health')
  public health(): any {
    return {
      success: true
    };
  }
}

import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { serverContainer } from './container/container';
import './controller/hello.controller';

export const server = new InversifyExpressServer(serverContainer);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});
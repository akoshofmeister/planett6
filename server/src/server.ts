import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { connect as mongooseConnect } from 'mongoose';

import { serverContainer } from './container/container';
import './service/services.module';

import './controller/health.controller';
import './controller/user.controller';

export const server = new InversifyExpressServer(serverContainer);

mongooseConnect('mongodb://localhost/users');

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});

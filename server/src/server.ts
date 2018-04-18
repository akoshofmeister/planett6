import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { connect as mongooseConnect, Model } from 'mongoose';

import { serverContainer } from './container/container';
import './service/services.module';
import './controller/health.controller';
import './controller/user.controller';

export const server = new InversifyExpressServer(serverContainer);

//connect to MongoDB
mongooseConnect('mongodb://localhost/users').then(mongoose => {
  const db = mongoose.connection;
  //handle mongo error
  db.on('error', (error) => console.error('connection error', error));
  db.once('open', () => {
    // we're connected!
    console.log('DB connected');
  });
});

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
});

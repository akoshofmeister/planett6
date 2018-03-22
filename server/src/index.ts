/* tslint:disable:no-console */

import { server } from './server';

const port = process.env.PORT || 3000;

let serverInstance = server.build();
serverInstance.listen(port);

console.log(`Server started on port ${port} :)`);

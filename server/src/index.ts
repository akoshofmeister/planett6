/* tslint:disable:no-console */

import { server } from './server';

const port = process.env.PORT || 3000;

const serverInstance = server.build();
serverInstance.listen(port);

console.log(`Server started on port ${port} :)`);

process.on('unhandledRejection', (error) => {
  console.error(error); // This prints error with stack included (as for normal errors)
  throw error; // Following best practices re-throw error and let the process exit with error code
});

import { use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'reflect-metadata'; // to make annotations work in tests
import * as sinonChai from 'sinon-chai';

use(sinonChai);
use(chaiAsPromised);

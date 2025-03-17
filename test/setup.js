const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);

globalThis.expect = chai.expect;
globalThis.sinon = sinon;

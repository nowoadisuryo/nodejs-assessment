const { logger } = require('../../src/utils');

describe('Logger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    consoleSpy.restore();
  });

  it('should log an info message', () => {
    const logSpy = sinon.spy(logger, 'info');
    logger.info('Test info message');

    expect(logSpy).to.have.been.calledOnce;
    expect(logSpy).to.have.been.calledWith('Test info message');

    logSpy.restore();
  });

  it('should log an error message', () => {
    const errorSpy = sinon.spy(logger, 'error');
    logger.error('Test error message');

    expect(errorSpy).to.have.been.calledOnce;
    expect(errorSpy).to.have.been.calledWith('Test error message');

    errorSpy.restore();
  });
});

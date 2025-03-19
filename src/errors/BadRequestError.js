/**
 * Bad Request Error
 */
class BadRequestError extends Error {
  /**
   * Constructor
   */
  constructor() {
    super();

    // define error's name and status
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

module.exports = BadRequestError;

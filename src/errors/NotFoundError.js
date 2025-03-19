/**
 * Not Found Error
 */
class NotFoundError extends Error {
  /**
   * Constructor
   */
  constructor() {
    super();

    // define error's name and status
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

module.exports = NotFoundError;

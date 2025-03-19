/**
 * Not Found Error
 */
class NotFoundError extends Error {
  /**
   * Constructor
   * @param {string} message - error message
   */
  constructor(message) {
    super(message || 'Not found');

    // define error's name and status
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

module.exports = NotFoundError;

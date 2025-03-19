/**
 * Bad Request Error
 */
class BadRequestError extends Error {
  /**
   * Constructor
   * @param {string} message - error message
   */
  constructor(message) {
    super(message || 'Bad request');

    // define error's name and status
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

module.exports = BadRequestError;

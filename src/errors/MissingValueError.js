/**
 * Missing Value Error
 */
class MissingValueError extends Error {
  /**
   * Constructor
   * @param {string} parameterName - the name of parameter
   */
  constructor(parameterName) {
    // replace default error message
    super(`Missing required value: ${parameterName}`);

    // define error's name and status
    this.name = 'MissingValueError';
    this.status = 400;
  }
}

module.exports = MissingValueError;

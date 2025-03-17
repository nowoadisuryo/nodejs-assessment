/**
 * Missing Value Error
 */
class MissingValueError extends Error {
  /**
   * Constructor
   * @param {string} parameterName - the name of parameter
   */
  constructor(parameterName) {
    super(`Missing required value: ${parameterName}`);
    this.name = 'MissingValueError';
    this.status = 400;
  }
}

module.exports = MissingValueError;

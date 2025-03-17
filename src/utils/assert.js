const { MissingValueError } = require('../errors');

/**
 * Throws an error if the provided value is null or undefined
 * @param {any} value - value to check
 * @param {string} parameterName - the name of the parameter
 * @throws {MissingValueError} -  throw error if the value is null or undefined
 */
const throwIfMissing = (value, parameterName) => {
  if (value === null || value === undefined) {
    throw new MissingValueError(parameterName);
  }
};

module.exports = { throwIfMissing };

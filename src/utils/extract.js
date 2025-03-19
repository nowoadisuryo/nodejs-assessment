/**
 * Extract emails from text
 * @param {string} text - a text
 * @returns {Array<string>} - list of emails
 */
const extractEmailsFromText = (text) => {
  const emailRegex = /@[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g;
  // use regular expression to find emails in a text
  const emails = text.match(emailRegex)?.map((email) => email.slice(1)) || [];

  return emails;
};

module.exports = { extractEmailsFromText };

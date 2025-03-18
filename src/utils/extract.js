const extractEmailsFromText = (text) => {
  const emailRegex = /@[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex)?.map((email) => email.slice(1)) || [];

  return emails;
};

module.exports = { extractEmailsFromText };

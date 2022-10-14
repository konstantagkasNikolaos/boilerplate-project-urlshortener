const dns = require("dns");

const checkUrl = (url) => {
  let valid = true;

  const urlStart = /^(https|http):\/\/www./g;
  const start = url.match(urlStart);

  if (!start) return false;

  const urlPart = url.replace(start, "");

  dns.lookup(urlPart, {}, (err, address, family) => {
    if (err) valid = false;
  });

  return valid;
};

module.exports = { checkUrl };

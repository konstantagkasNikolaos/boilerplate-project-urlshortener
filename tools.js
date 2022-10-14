const dns = require("dns");

const checkUrl = (url) => {
  let valid = true;

  const urlStart = /^(https|http):\/\//g;
  const start = url.match(urlStart);

  if (!start) return false;

  const urlPart = url.replace(start, "").replace("www.", "");

  dns.lookup(urlPart, {}, (err, address, family) => {
    if (err) valid = false;
  });

  return valid;
};

module.exports = { checkUrl };

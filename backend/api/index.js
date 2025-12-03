// api/index.js
const app = require('../server'); // server.js is one level up from api/

module.exports = (req, res) => {
  return app(req, res);
};
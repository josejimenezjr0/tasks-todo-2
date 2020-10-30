const { clearHash } = require('../db/caching')

module.exports = async (req, res, next) => {
  await next()

  clearHash(req.user._id)
}
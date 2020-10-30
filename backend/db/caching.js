  const redis = require('redis')
  const util = require('util')

  const redisUrl = 'redis://127.0.0.1:6379'
  const client = redis.createClient(redisUrl)
  client.hget = util.promisify(client.hget)

  const checkCache = (key, hashKey = '') => {
    return new Promise(async (resolve, reject) => {
      try {
        const cachedItem = await client.hget(JSON.stringify(hashKey), JSON.stringify(key))
        resolve(cachedItem ? JSON.parse(cachedItem) : null)
      } catch (e) {
        reject(e)
      }
    })
  }

  const setCache = async (key, result, hashKey = '') => {
    try {
      client.hset(JSON.stringify(hashKey), JSON.stringify(key), JSON.stringify(result), 'EX', 1)
    } catch (e) {
      console.log(e)
    }
  }

  const clearHash = (hashKey) => {
    client.del(JSON.stringify(hashKey))
  }

  module.exports = {
    checkCache,
    setCache,
    clearHash
  }

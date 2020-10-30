const passport = require('passport');
const Auth0Strategy = require("passport-auth0")
const { ObjectId } = require('mongodb')
const { DOMAIN, CLIENT_ID, CLIENT_SECRET } = process.env
const { getDb } = require('./db/dbConnect')

passport.serializeUser((user, done) => {
  console.log('user: ', user);
  console.log('serializeUser')
  done(null, user);
})

passport.deserializeUser(async (user, done) => {
  console.log('deserializeUser')
  try {
    const db = getDb()
    const foundUser = await db.collection('users').findOne({ _id: ObjectId(user._id) })
    done(null, foundUser)
  } catch (e) {
    console.log(e)
  }
})

passport.use(new Auth0Strategy(
  {
    domain:       DOMAIN,
    clientID:     CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: '/api/login/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, extraparams, profile, done) => {
    const db = getDb()
    try {
      const existingUser = await db.collection('users').findOne({ userId: profile.id })
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = { userId: profile.id, displayName: profile.displayName }
      await db.collection('users').insertOne(user)
      console.log('ops: ', ops);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
)

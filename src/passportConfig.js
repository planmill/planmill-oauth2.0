const passport = require("passport");
const OAuth2Strategy = require('passport-oauth2').Strategy;


function setupOAuth2Strategy({ client_id, client_secret, callback_url, instance }) {
  if (!client_id || !client_secret || !callback_url || !instance) {
    throw new Error('Missing OAuth2 credentials');    
  }

  const authorizationURL = `https://online.planmill.com/${instance}/api/oauth2/authorize`;
  const tokenURL = `https://online.planmill.com/${instance}/api/oauth2/token`;

  passport.use(
      "oauth2",
      new OAuth2Strategy(
          {
            authorizationURL: authorizationURL,
            tokenURL: tokenURL,
            clientID: client_id,
            clientSecret: client_secret,
            callbackURL: callback_url
          },
          (accessToken, refreshToken, profile, done) => {
            return done(null, { accessToken });
          })
      );
}

module.exports = { setupOAuth2Strategy };
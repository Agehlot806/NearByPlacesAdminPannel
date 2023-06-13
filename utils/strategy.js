import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User.js';

// Google OAuth2 configuration
passport.use(
  new GoogleStrategy(
    {
    clientID:'1035606224578-fg0f8e56fsm4jfk2f4hqusf9fgqainh2.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user based on the Google profile
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
          });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Facebook OAuth2 configuration
passport.use(
  new FacebookStrategy(
    {
    clientID: '610783947337862',
	clientSecret: '6041bb6cad2e8f9aaa7c84fe1880f4ca',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user based on the Facebook profile
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
          });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;

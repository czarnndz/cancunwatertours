var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  bcrypt = require('bcrypt');


//helper functions
function findById(id, fn) {
  Client_.findOne(id).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}


function findByFacebookId(id, fn) {
  Client_.findOne({
    facebookId: id
  }).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}


function findByUsername(username, fn) {
  Client_.findOne().where({
    or: [
      { name: username },
      { email: username }
    ]
  }).exec(function (err, user) {
    // Error handling
    if (err) {
      return fn(null, null);
      // The User was found successfully!
    } else {
      return fn(null, user);
    }
  });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    //console.log(user);
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(
  function (username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // Find the user by username. If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message. Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function (err, user) {
        if (err)
          return done(null, err);
        if (!user) {
          return done(null, false, {
            message: 'Unknown user ' + username
          });
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid Password'
            });
          var returnUser = {
            username: user.username,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          });
        });
      })
    });
  }
));


passport.use(new FacebookStrategy({
    clientID: sails.config.facebook_clientID,
    clientSecret: sails.config.facebook_clientSecret,
    callbackURL: sails.config.facebook_callback,
    profileFields: ['id', 'displayName', 'email'],
    enableProof: false
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      findByFacebookId(profile.id, function (err, user) {

        // Create a new User if it doesn't exist yet
        if (!user) {
          var email = profile.emails[0].value;

          Client_.create({
            name: profile.displayName,
            email: email,
            facebookId: profile.id,
            source: 'Facebook'
            // You can also add any other data you are getting back from Facebook here
            // as long as it is in your model

          }).exec(function (err, user) {
            if (user) {
              console.log('Logged In Successfully, registerd');
              return done(null, user, {
                message: 'Logged In Successfully, registerd'
              });
            } else {
              return done(err, null, {
                message: 'There was an error logging you in with Facebook'
              });
            }
          });

        // If there is already a user, return it
        } else {
          return done(null, user, {
            message: 'Logged In Successfully'
          });
        }
      });

    });
  }
));

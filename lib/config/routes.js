'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app, passport) {

  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.findById);
  app.get('/api/profile/:username', users.findByName);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);


  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login

  // app.get('/auth/facebook', session.facebooklogin);
  // console.log(passport);

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }), session.facebooklogin);

  // handle the callback after facebook has authenticated the user
  // app.get('/auth/facebook/callback', session.facebookcallback);

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect : '/'
    }), session.session);




  //##############GOOGLE#############################


// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));

  //###############################################






  // Event Routes
  var events = require('../controllers/events');
  app.get('/api/events', events.events);
  app.post('/api/events', auth.ensureAuthenticated, events.create);
  app.get('/api/events/:eventId', events.show);
  app.put('/api/events/:eventId', auth.ensureAuthenticated, auth.event.hasAuthorization, events.update);
  app.del('/api/events/:eventId', auth.ensureAuthenticated, auth.event.hasAuthorization, events.destroy);

  app.put('/api/events/:eventId/sendEmail', auth.ensureAuthenticated, events.sendEmail);
  app.put('/api/events/:eventId/addComment', auth.ensureAuthenticated, events.addComment);
  app.put('/api/events/:eventId/:joinType', auth.ensureAuthenticated, events.join);

  //Setting up the eventId param
  app.param('eventId', events.event);



  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  
  // app.all("/*", function(req, res, next) {
  //     res.header("Access-Control-Allow-Origin", "*");
  //     res.header("Access-Control-Allow-Headers", "  X-Requested-With,Content-Type");
  //     res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  //     return next();
  //   });  //This code is there to prevent CORS errors. 

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });


}
'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app, passport) {

  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

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
  console.log(passport);

  app.get('/auth/facebook', passport.authenticate('facebook'));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', session.facebookcallback);






  // Event Routes
  var events = require('../controllers/events');
  app.get('/api/events', events.events);
  app.post('/api/events', auth.ensureAuthenticated, events.create);
  app.get('/api/events/:eventId', events.show);
  app.put('/api/events/:eventId', auth.ensureAuthenticated, auth.event.hasAuthorization, events.update);
  app.del('/api/events/:eventId', auth.ensureAuthenticated, auth.event.hasAuthorization, events.destroy);

  app.put('/api/events/:eventId/addComment', auth.ensureAuthenticated, events.addComment);
  app.put('/api/events/:eventId/:joinType', auth.ensureAuthenticated, events.join);


  //Setting up the eventId param
  app.param('eventId', events.event);



  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });

}
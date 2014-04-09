'use strict';

var mongoose = require('mongoose'),
  Event = mongoose.model('EventPost');

/**
 * Find event by id
 */
exports.event = function(req, res, next, id) {
  Event.load(id, function(err, event) {
    if (err) return next(err);
    if (!event) return next(new Error('Failed to load event ' + id));
    req.event = event;
    next();
  });
};

/**
 * Create a event
 */
exports.create = function(req, res) {
  var event = new Event(req.body);
  event.creator = req.user;

  event.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(event);
    }
  });
};

/**
 * Update a event
 */
exports.update = function(req, res) {
  var event = req.event;
  event.title = req.body.title;
  event.description = req.body.description;
  event.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(event);
    }
  });
};

exports.join = function(req, res) {
  var event = req.event;
  event.attendees.push(req.user.username);
  event.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(event);
    }
  });
};

exports.unjoin = function(req, res) {
  var event = req.event;

  var index = event.attendees.indexOf(req.user.username);
  if (index > -1) {
    event.attendees.splice(index, 1);
  }

  event.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(event);
    }
  });
};

/**
 * Delete a event
 */
exports.destroy = function(req, res) {
  var event = req.event;

  event.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(event);
    }
  });
};

/**
 * Show a event
 */
exports.show = function(req, res) {
  res.json(req.event);
};

/**
 * List of Events
 */
exports.all = function(req, res) {
  var queryCategories = req.query.categories;
  if (queryCategories !== undefined) {
    // AND: { categories: { "$in": [queryCategories.split(',')] } }
    //  OR: { categories: { "$in": queryCategories.split(',') } }
    Event.find( { categories: { "$in": queryCategories.split(',') } } )
    .sort('-created')
    .populate('creator', 'username')
    .exec(function(err, events) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(events);
      }
    });
  }
  else {
    Event.find()
    .sort('-created')
    .populate('creator', 'username')
    .exec(function(err, events) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(events);
      }
    });
  }
};

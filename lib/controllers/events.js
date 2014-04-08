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
  event.attendees = req.body.attendees;
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
  Event.find().sort('-created').populate('creator', 'username').exec(function(err, events) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(events);
    }
  });
};

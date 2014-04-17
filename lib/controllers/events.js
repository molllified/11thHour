'use strict';

var mongoose = require('mongoose'),
  Event = mongoose.model('Event');

/**
 * Find event by id
 */
exports.event = function(req, res, next, id) {
  Event.load(id, function(err, event) {
    if (err) return next(err);
    if (!event) return next(new Error('Failed to load event ' + id));

    var options = {
      path: 'comments.creator',
      model: 'User',
      select: 'username email'
    };
    Event.populate(event, options, function (err, populatedEvent) {
      req.event = populatedEvent;
      next();
    });     
  });
};

/**
 * Create an event
 */
exports.create = function(req, res) {
  var event = new Event(req.body);
  console.log(event);
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
 * Update an event
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

/**
 * Join an event
 */
exports.join = function(req, res) {
  var joinType = req.params.joinType;
  if (joinType === 'join') {
    joinController(req, res);
  }
  else if (joinType === 'unjoin') {
    unjoinController(req, res);
  }
};

function joinController(req, res) {
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

function unjoinController(req, res) {
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
 * Show an event
 */
exports.show = function(req, res) {
  res.json(req.event);
};

/**
 * List of Events
 */
exports.events = function(req, res) {
  var username = req.query.username;
  var eventsType = req.query.eventsType;
  var categories = req.query.categories;

  if ((username !== undefined) && (eventsType !== undefined)) {
    if (eventsType === 'created') {
      eventsCreatedByUser(res, username);
    }
    else if (eventsType === 'joined') {
      eventsJoinedByUser(res, username);
    }
  }
  else if (categories !== undefined) {
    eventsFilteredByCategories(res, categories);
  }
  else {
    eventsAll(res);
  }
};

// return all events in the database
function eventsAll(res) {
  Event
  .find()
  .sort('-created')
  .populate('creator', 'username email')
  .exec(function(err, events) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(events);
    }
  });
}

function eventsFilteredByCategories(res, categories) {
  // AND: { categories: { "$in": [categories.split(',')] } }
  //  OR: { categories: { "$in": categories.split(',') } }
  Event
  .find( { categories: { "$in": categories.split(',') } } )
  .populate('creator', 'username email')
  .sort('-created')
  .exec(function(err, events) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(events);
    }
  });
}

function eventsCreatedByUser(res, username) {
  Event
  .find()
  .populate('creator', 'username email', {username: username})
  .sort('-created')
  .exec(function(err, events) {
    if (err) {
      res.json(500, err);
    } else {
      events = events.filter(function(events){
      return (events.creator !== null);
    })
    res.json(events);
    }
  });
};


function eventsJoinedByUser(res, username) {
  Event
  .find()
  .populate('creator', 'username email')
  .where('attendees')
  .equals(username)
  .sort('-created')
  .exec(function(err, events) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(events);
    }
  });
};


exports.addComment = function(req, res) {
  var text = req.query.text;
  var event = req.event;

  var commentObj = 
  {
    'created': new Date().toISOString(),
    'creator': req.user,
    'text': text 
  };
  event.comments.push(commentObj);

  event.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(event);
    }
  });
};



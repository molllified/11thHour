'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  time: {
    type: String
  },
  location: {
    type: String
  },
  price: {
    type: Number
  },
  peopleNeeded: {
    type: Number
  },
  attendees: {
    type: Array
  },
  categories: {
    type: Array
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  comments: [
    {
      text: {
        type: String,
        default: '',
        trim: true
      },
      created: Date,
      creator: {
        type: Schema.ObjectId,
        ref: 'User'
      }
    }
  ]

});

/**
 * Pre hook.
 */

EventSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

/**
 * Statics
 */
EventSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator', 'username').exec(cb);
  }
};

/**
 * Methods
 */

EventSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

EventSchema.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

EventSchema.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('Event', EventSchema);
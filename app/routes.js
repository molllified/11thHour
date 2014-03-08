var Event = require('./models/event');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all events
	app.get('/api/events', function(req, res) {

		// use mongoose to get all events in the database
		Event.find(function(err, events) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(events); // return all events in JSON format
		});
	});

	// create event and send back all events after creation
	app.post('/api/events', function(req, res) {

		// create a event, information comes from AJAX request from Angular
		Event.create({
			title : req.body.title,
			description : req.body.description
		}, function(err, event) {
			if (err)
				res.send(err);

			// get and return all the events after you create another
			Event.find(function(err, events) {
				if (err)
					res.send(err)
				res.json(events);
			});
		});

	});

	// delete a event
	app.delete('/api/events/:event_id', function(req, res) {
		Event.remove({
			_id : req.params.event_id
		}, function(err, event) {
			if (err)
				res.send(err);

			// get and return all the events after you create another
			Event.find(function(err, events) {
				if (err)
					res.send(err)
				res.json(events);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
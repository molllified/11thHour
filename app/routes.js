var Event = require('./models/event');

module.exports = function(app) {

	app.get('/api/event', function(req, res) {
		Event.find(function(err, events) {
			if (err)
				res.send(err);

			res.json(events);
		});
	});

	app.get('/api/event/:event_id', function(req, res) {
		Event.findOne({
			_id: req.params.event_id
		}, function(err, event) {
			if (err)
				res.send(err);

			res.json(event);
		});
	});

	app.post('/api/event', function(req, res) {
		Event.create({
			title : req.body.title,
			description : req.body.description
		}, function(err, event) {
			if (err)
				res.send(err);

			Event.find(function(err, events) {
				if (err)
					res.send(err);
				res.json(events);
			});
		});

	});

	app.delete('/api/event/:event_id', function(req, res) {
		Event.remove({
			_id : req.params.event_id
		}, function(err, event) {
			if (err)
				res.send(err);

			Event.find(function(err, events) {
				if (err)
					res.send(err);
				res.json(events);
			});
		});
	});

	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
};
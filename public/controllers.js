
var controllers = angular.module('mainAppControllers', []);

controllers.controller('newsFeedController', 
	['$scope', '$http',
	function ($scope, $http) {
		$scope.formData = {};

		$http.get('/api/event')
			.success(function(data) {
				$scope.events = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		$scope.createEvent = function() {
			$http.post('/api/event', $scope.formData)
				.success(function(data) {
					// $('input').val('');
					$scope.events = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};

		$scope.deleteEvent = function(event_id) {
			$http.delete('/api/event/' + event_id)
				.success(function(data) {
					$scope.events = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
	}
]);


controllers.controller('eventController', 
	['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {
		$scope.event_id = $routeParams.event_id;

		$http.get('/api/event/' + $scope.event_id)
			.success(function(data) {
				$scope.event = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}
]);


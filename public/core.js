var mainApp = angular.module('mainApp', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all events and show them
	$http.get('/api/events')
		.success(function(data) {
			$scope.events = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createEvent = function() {
		$http.post('/api/events', $scope.formData)
			.success(function(data) {
				// $('input').val('');
				$scope.events = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a event after checking it
	$scope.deleteEvent = function(id) {
		$http.delete('/api/events/' + id)
			.success(function(data) {
				$scope.events = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
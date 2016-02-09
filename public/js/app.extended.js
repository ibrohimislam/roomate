var app = angular.module('myApp',['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/kuliah', {
		templateUrl: 'partials/kuliah.html',
		controller: 'CoursesController'
	}).
	when('/ruangan', {
		templateUrl: 'partials/ruangan.html',
		controller: 'RoomsController'
	}).
	otherwise({
		redirectTo: '/ruangan'
	});
}]);

app.factory('RoomsResources', function ($resource) {

	var auth_header = { 'Authorization': 'Basic aWJyb2hpbWlzbGFtQGdtYWlsLmNvbTpwYXNzd29yZA=='};

    return $resource('http://lily.dev/api/v1/rooms/:id', {id:'@id'}, {
        list:  { method: 'GET', isArray:true, headers: auth_header},
        get:  { method: 'GET', headers: auth_header},
        store: { method: 'POST', headers: auth_header},
        update: { method: 'PUT', headers: auth_header},
        destroy: { method: 'DELETE', headers: auth_header},
    })
});

app.controller('RoomsController', function($scope, RoomsResources){

	$(document).foundation();
	$scope.rooms = RoomsResources.list();
	
	$scope.add = function(){
		
		var data = getFormJSON($('#form-tambah'));

		RoomsResources.store(data).$promise.then(function (result) {
		    $('#modalTambah').foundation('close');
			RoomsResources.list().$promise.then(function (result){
				$scope.rooms = result;
			});
		});
	}

	$scope.confirmDestroy = function(id){
		$('#hapus-id').val(id);
		$('#modalHapus').foundation('open');
	}

	$scope.destroy = function(id){
		var targetId = $('#hapus-id').val();

		RoomsResources.destroy({id: targetId}).$promise.then(function (result) {
		    $('#modalHapus').foundation('close');
			RoomsResources.list().$promise.then(function (result){
				$scope.rooms = result;
			});
		});
	}

	$scope.showUpdate = function(_id){
		RoomsResources.get({id: _id}).$promise.then(function(result) {
			$scope.room = {};
			$scope.room.name = result.name;
			$scope.room.capacity = result.capacity;
			$scope.room.status = result.status;	

			$('#ubah-id').val(_id);
			$('#modalUbah').foundation('open');
		})
	}

	$scope.update = function(){
		var targetId = $('#ubah-id').val();
		var data = getFormJSON($('#form-ubah'));

		console.log(data);

		RoomsResources.update({id: targetId}, data).$promise.then(function (result) {
		    $('#modalUbah').foundation('close');
			RoomsResources.list().$promise.then(function (result){
				$scope.rooms = result;
			});
		});
	}
});

app.factory('CoursesResources', function ($resource) {

	var auth_header = { 'Authorization': 'Basic aWJyb2hpbWlzbGFtQGdtYWlsLmNvbTpwYXNzd29yZA=='};

    return $resource('http://lily.dev/api/v1/courses/:id', {id:'@id'}, {
        list:  { method: 'GET', isArray:true, headers: auth_header},
        get:  { method: 'GET', headers: auth_header},
        store: { method: 'POST', headers: auth_header},
        update: { method: 'PUT', headers: auth_header},
        destroy: { method: 'DELETE', headers: auth_header},
    })
});

app.controller('CoursesController', function($scope, CoursesResources){
	
	$(document).foundation();

	$scope.courses = CoursesResources.list();
	
	$scope.add = function(){
		
		var data = getFormJSON($('#form-tambah'));

		CoursesResources.store(data).$promise.then(function (result) {
		    $('#modalTambah').foundation('close');
			CoursesResources.list().$promise.then(function (result){
				$scope.courses = result;
			});
		});
	}

	$scope.confirmDestroy = function(id){
		$('#hapus-id').val(id);
		$('#modalHapus').foundation('open');
	}

	$scope.destroy = function(id){
		var targetId = $('#hapus-id').val();

		CoursesResources.destroy({id: targetId}).$promise.then(function (result) {
		    $('#modalHapus').foundation('close');
			CoursesResources.list().$promise.then(function (result){
				$scope.courses = result;
			});
		});
	}

	$scope.showUpdate = function(_id){
		CoursesResources.get({id: _id}).$promise.then(function(result) {
			$scope.room = {};
			$scope.room.name = result.name;
			$scope.room.attendants = result.attendants;

			$('#ubah-id').val(_id);
			$('#modalUbah').foundation('open');
		})
	}

	$scope.update = function(){
		var targetId = $('#ubah-id').val();
		var data = getFormJSON($('#form-ubah'));

		console.log(data);

		CoursesResources.update({id: targetId}, data).$promise.then(function (result) {
		    $('#modalUbah').foundation('close');
			CoursesResources.list().$promise.then(function (result){
				$scope.rooms = result;
			});
		});
	}
});
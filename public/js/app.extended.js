var app = angular.module('myApp',['ngRoute', 'ngResource', 'autocomplete']);

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
	when('/', {
		templateUrl: 'partials/jadwal.html',
		controller: 'ScheduleController'
	}).
	when('/statistik', {
		templateUrl: 'partials/statistik.html',
		controller: 'StatisticController'
	}).
	otherwise({
		redirectTo: '/'
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

	$("#view").foundation();
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

		$("#spinner").foundation('open');

		RoomsResources.update({id: targetId}, data).$promise.then(function (result) {
		    
		    $('#modalUbah').foundation('close');
			RoomsResources.list().$promise.then(function (result){
				
				$scope.rooms = result;
				$("#spinner").foundation('close');

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
	
	$("#view").foundation();

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

		$("#spinner").foundation('open');

		CoursesResources.update({id: targetId}, data).$promise.then(function (result) {
		    $('#modalUbah').foundation('close');
			CoursesResources.list().$promise.then(function (result){

				$("#spinner").foundation('close');
				$scope.courses = result;

			});
		});
	}
});

app.factory('SchedulesResources', function ($resource) {
	
	$("#view").foundation();

	var auth_header = { 'Authorization': 'Basic aWJyb2hpbWlzbGFtQGdtYWlsLmNvbTpwYXNzd29yZA=='};

    return $resource('http://lily.dev/api/v1/rooms/:roomId/schedules/:date', {date:'@date', roomId:'@roomId'}, {
		list:  { method: 'GET', isArray:true, headers: auth_header},
        get:  { method: 'GET', headers: auth_header},
        store: { method: 'POST', headers: auth_header},
        update: { method: 'PUT', headers: auth_header},
        destroy: { method: 'DELETE', headers: auth_header},
    })

});

app.controller('ScheduleController', function($q, 	$scope, $compile, $sce, CoursesResources, RoomsResources, SchedulesResources){
	
	$("#view").foundation();

	var currentDate = new Date();

	$scope.courseNames = [];
	$scope.roomNames = [];

	$scope.tanggal = currentDate;
	
	CoursesResources.list().$promise.then(function(result){
		$scope.courses = result;
		$scope.courses.forEach(function(el){
			$scope.courseNames.push(el.name);
		})
	});
	
	RoomsResources.list().$promise.then(function(rooms){
		
		var roomSchedules = [];

		angular.forEach(rooms, function(room){
			roomSchedules.push(SchedulesResources.list({date:"02-16-2016", roomId: room.id}).$promise.then(function(response){
		 		var schedulesPromises = [];

		 		for (i=1, j=0; i<=11; i++) {
					console.log(i);
		 			if (j >= response.length) {
		 				schedulesPromises.push($q.when({
		 					duration:1,
		 					htmlClass:"text-center space",
		 					htmlContent:$sce.trustAsHtml('<a onclick="angular.element(this).scope().openModalTambah(5)" class="fi-plus"></a>')
		 				}));
		 			} else {
		 				if (i<response[j]) {
		 					schedulesPromises.push($q.when({
			 					duration:1,
			 					htmlClass:"text-center space",
			 					htmlContent:$sce.trustAsHtml('<a onclick="angular.element(this).scope().openModalTambah(5)" class="fi-plus"></a>')
			 				}));
		 				} else {
			 				schedulesPromises.push($q.when({
			 					duration:response[j].duration,
			 					htmlClass:"text-center occupied color" + (Math.floor(Math.random() * 30) + 1),
			 					htmlContent:$sce.trustAsHtml("<b>" + response[j].course.name + '</b>&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete(6)">&times;</a>'),
			 				}));
			 				i+= response[j++].duration - 1;
		 				}
		 			}
		 		}

		 		return $q.all(schedulesPromises).then(function(result){
		 			return $q.when({name: room.name, schedules: result});
		 		});
			}));
		});

		$q.all(roomSchedules).then(function(result){
			console.log(result);
			$scope.rooms = result;
		})
	});

	$scope.openModalTambah = function(waktu) {
		$scope.waktu = waktu;
		$('#modalTambah').foundation('open');
	}

	$scope.openModalDelete = function(waktu) {
		$scope.waktu = waktu;
		$('#modalHapus').foundation('open');
	}

});

app.controller('StatisticController', function($scope){

	$scope.tanggal = new Date();

	google.charts.load('current', {'packages':['corechart']});
	
	$scope.refreshStatistic = function(){
		var angka = prompt("kasjdkjslasd");
		drawChart(parseInt(angka));
	}

	function drawChart(x) {
		var data = google.visualization.arrayToDataTable([
		['Task', 'Hours per Day'],
		['Work',     x],
		['Eat',      2],
		['Commute',  2],
		['Watch TV', 2],
		['Sleep',    7]
		]);

		var options = {
		title: 'My Daily Activities'
		};

		var chart = new google.visualization.PieChart(document.getElementById('piechart'));

		chart.draw(data, options);
	}
});
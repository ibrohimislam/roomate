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

app.factory('ScheduleResources', function ($resource) {
	
	$("#view").foundation();

	var auth_header = { 'Authorization': 'Basic aWJyb2hpbWlzbGFtQGdtYWlsLmNvbTpwYXNzd29yZA=='};

    return $resource('http://lily.dev/api/v1/schedule/:date/:id', {date:'@date', id:'@id'}, {
		list:  { method: 'GET', isArray:true, headers: auth_header},
        get:  { method: 'GET', headers: auth_header},
        store: { method: 'POST', headers: auth_header},
        update: { method: 'PUT', headers: auth_header},
        destroy: { method: 'DELETE', headers: auth_header},
    })

});

app.controller('ScheduleController', function($scope, $compile, $sce, CoursesResources, RoomsResources, ScheduleResources){
	
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
	
	RoomsResources.list().$promise.then(function(result){
		result[0].schedules = [
				{duration:3, htmlClass:"text-center occupied color1", htmlContent:$sce.trustAsHtml('IF3230' + '&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete(6)">&times;</a>')},
				{duration:1, htmlClass:"text-center space",           htmlContent:$sce.trustAsHtml('<a onclick="angular.element(this).scope().openModalTambah(5)" class="fi-plus"></a>')},
				{duration:2, htmlClass:"text-center occupied color2", htmlContent:$sce.trustAsHtml('IF3130' + '&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete(6)">&times;</a>')},
				{duration:2, htmlClass:"text-center occupied color3", htmlContent:$sce.trustAsHtml('IF3230' + '&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete(6)">&times;</a>')},
				{duration:2, htmlClass:"text-center occupied color4", htmlContent:$sce.trustAsHtml('IF3240' + '&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete(6)">&times;</a>')},
				{duration:1, htmlClass:"text-center occupied color5", htmlContent:$sce.trustAsHtml('IF3250' + '&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete(6)">&times;</a>')},
			];
		result[1].schedules = [{duration:11, htmlClass:"text-center occupied color5", htmlContent: $sce.trustAsHtml('IF3250' + '&nbsp;' + '<a ng-click="openModalDelete(6)">&times;</a>')}];
		$scope.rooms = result;
		$scope.rooms.forEach(function(el){
			$scope.roomNames.push(el.name);
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

app.controller('StatisticController', function($scope, RoomsResources, CoursesResources, ScheduleResources){
	
	RoomsResources.list().$promise.then(function(result){
		$scope.rooms = result;
//		$scope.selectedRoom = ""+result[0].id;
//		$scope.refreshStatistic();	
	});


	$scope.courses=CoursesResources.list();

	ScheduleResources.get().$promise.then(function(result){
		$scope.schedule= result;
	}
	google.charts.load('current', {'packages':['corechart']});

	var a,b,c,d,e=0;
	
	$scope.refreshStatistic = function(){
		var kode = $scope.selectedRoom;
		if(kode=="1"){
			a=10; b=20; c=5; d=7; e =1; 
		} else if(kode=="2"){
			a=5; b=8; c=1; d=3; e =7; 
		} else if(kode=="3"){
			a=9; b=3; c=16; d=24; e =37; 
		} else if(kode=="4"){
			a=1; b=9; c=30; d=20; e =13; 
		} else {
			a=2; b=1; c=19; d=23; e =8;
		}
		drawChart();
	}

	function drawChart() {
		var data = google.visualization.arrayToDataTable([
		['Kuliah', 'penggunaan ruangan'],
		[$scope.courses[0].name,  a],
		[$scope.courses[1].name,  b],
		[$scope.courses[2].name,  c],
		[$scope.courses[3].name,  d],
		[$scope.courses[4].name,  e]
		]);

		var options = {
		title: 'presentase penggunaan setiap user'
		};

		var chart = new google.visualization.PieChart(document.getElementById('piechart'));

		chart.draw(data, options);
	}
});
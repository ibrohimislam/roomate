var app = angular.module('myApp',['ngRoute', 'ngResource', 'autocomplete']);

app.filter('regex', function() {
  return function(input, field, regex) {
      var patt = new RegExp(regex);      
      var out = [];
      for (var i = 0; i < input.length; i++){
          if(patt.test(input[i][field]))
              out.push(input[i]);
      }      
    return out;
  };
});

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
}]).run(function() {
	google.charts.load('current', {'packages':['corechart']});
});

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
	RoomsResources.list().$promise.then(function (result) {
		$scope.rooms = result;
		$scope.init = true;
	});
	$scope.error_messages = [];
	$scope.init = false;
	
	$scope.add = function(){
		
		var data = getFormJSON($('#form-tambah'));

		RoomsResources.store(data).$promise.then(function (result) {

			console.log(result);

		    if (result.error) {
				$scope.error_messages = result.message;
		    } else {
		    	$scope.error_messages = "";
		    	
		    	$('#modalTambah').foundation('close');
				
				RoomsResources.list().$promise.then(function (result){
					$scope.rooms = result;
				});
		    }
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

	$scope.error_messages = [];

	$scope.courses = [];
	$scope.tingkat = 2;

	CoursesResources.list().$promise.then(function (result){
		$scope.courses = result;
	});

	$scope.updatePage = function(tingkat){
		$scope.tingkat = tingkat;
	}

	$scope.courseFilter = function(course){
		return course.name.substring(2, 3) == $scope.tingkat;
	}
	
	$scope.add = function(){
		
		var data = getFormJSON($('#form-tambah'));

		CoursesResources.store(data).$promise.then(function (result) {
		    
		    if (result.error) {
				$scope.error_messages = result.message;
		    } else {
		    	$scope.error_messages = "";
		    	
		    	$('#modalTambah').foundation('close');
				
				CoursesResources.list().$promise.then(function (result){
					$scope.courses = result;
				});
		    }
			
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

	$scope.selectedRoomId = "";
	$scope.selectedCourseId  = "";

	$scope.tanggal = currentDate;
	
	CoursesResources.list().$promise.then(function(result){
		$scope.courses = result;
	});
	
	$scope.updateSchedule = function(){
		$('#spinner').foundation('open');

		RoomsResources.list().$promise.then(function(rooms){
	 		var kolor = 1;
			$scope.rooms = rooms;

			var roomSchedules = [];

			angular.forEach(rooms, function(room){
				roomSchedules.push(SchedulesResources.list({date:parseDate($scope.tanggal), roomId: room.id}).$promise.then(function(response){
			 		var schedulesPromises = [];

			 		for (i=1, j=0; i<=11; i++) {
			 			if (j >= response.length) {
			 				schedulesPromises.push($q.when({
			 					duration:1,
			 					htmlClass:"text-center space",
			 					htmlContent:$sce.trustAsHtml('<a onclick="angular.element(this).scope().openModalTambah(this, '+i+')" class="fi-plus"></a>')
			 				}));
			 			} else {
			 				if (i<response[j].start) {
			 					schedulesPromises.push($q.when({
				 					duration:1,
				 					htmlClass:"text-center space",
				 					htmlContent:$sce.trustAsHtml('<a onclick="angular.element(this).scope().openModalTambah(this, '+i+')" class="fi-plus"></a>')
				 				}));
			 				} else {
			 					kolor = (kolor)%29+1;

			 					console.log(room.capacity);
			 					console.log(response[j].course.attendants);

				 				schedulesPromises.push($q.when({
				 					duration:response[j].duration,
				 					htmlClass:"text-center occupied color" + (kolor) + " " + ((room.capacity < response[j].course.attendants)?"alert":""),
				 					htmlContent:$sce.trustAsHtml("<b>" + response[j].course.name + '</b>&nbsp;' + '<a onclick="angular.element(this).scope().openModalDelete('+response[j].id+')" class="fi-x"></a>'),
				 				}));
				 				i+= response[j++].duration - 1;
			 				}
			 			}
			 		}

			 		return $q.all(schedulesPromises).then(function(result){
			 			return $q.when({
			 				id: room.id,
			 				status: room.status,
			 				name: room.name,
			 				capacity: room.capacity,
			 				schedules: result
			 			});
			 		});
				}));
			});

			$q.all(roomSchedules).then(function(result){
				console.log(result);
				$scope.rooms = result;

				$('#spinner').foundation('close');
			})
		});
	}

	$scope.updateSchedule();

	$scope.openModalTambah = function(element, waktu) {
		td_element = $(element).parent();
		$scope.waktu = waktu;
		$scope.room_id = td_element.attr('room-data-id');
		
		capacity = td_element.attr('room-data-capacity');
		console.log(capacity);

		coursesRuangan = [];

		for (var i = $scope.courses.length - 1; i >= 0; i--) {
			if ($scope.courses[i].attendants > capacity)
				coursesRuangan.push($q.when({id: $scope.courses[i].id, name: $scope.courses[i].name + " (overkapasitas)"}));
			else
				coursesRuangan.push($q.when({id: $scope.courses[i].id, name: $scope.courses[i].name}));
		};

		$q.all(coursesRuangan).then(function(result){
			$scope.coursesRuangan = result;

			$("#waktu").val((waktu+6)+":00");
			$("#ruangan").val(td_element.attr('room-data-name'));
			$('#modalTambah').foundation('open');

		});

	}

	$scope.openModalDelete = function(id) {
		$('#hapus-id').val(id)
		$('#modalHapus').foundation('open');
	}

	var addItem = function(date) {
		var data = {
			date: date,
			start: $scope.waktu,
			course_id: $scope.selectedCourseId,
			duration: $scope.duration,
		}

		return SchedulesResources.store({date:"", roomId: $scope.room_id}, data);
	}

	$scope.add = function(){
		if ($scope.weekly) {
			
			console.log("YA");

			var promises = [];

			for (var i = 0; i < $scope.weektimes; i++) {
				console.log("YA " + i);
				promises.push(addItem(parseDateSQL(dateTranslation($scope.tanggal,i))));			
			};

			$q.all(promises).then(function(result){
			    $scope.updateSchedule();
			})

		} else {
			addItem(parseDateSQL($scope.tanggal)).$promise.then(function (result) {
			    $scope.updateSchedule();
			});;
		}
	}

	$scope.destroy = function(id){
		var targetId = $('#hapus-id').val();

		SchedulesResources.destroy({date:targetId, roomId:"_"}).$promise.then(function (result) {
		    $('#modalHapus').foundation('close');
		    $scope.updateSchedule();
		});
	}

});

app.controller('StatisticController', function($q, $scope, RoomsResources, CoursesResources, SchedulesResources){
	
	$('#view').foundation();

	$('#spinner').foundation('open');
	
	RoomsResources.list().$promise.then(function(result){
		$scope.rooms = result;
		$('#spinner').foundation('close');
	});

	$scope.courses=CoursesResources.list();

	google.charts.setOnLoadCallback(drawChart);
	//google.charts.setOnLoadCallback(refreshStatisticByCourses);


	$scope.refreshStatisticByCourses = function(){
		$('#spinner').foundation('open');

		var kode = $scope.selectedRoom;

		var akumulasiJadwal = {};

		SchedulesResources.list({roomId: kode}).$promise.then(function(result){
			var defer = $q.defer();

			for(var i=0; i<result.length; i++) {
				var jadwal = result[i];

				if (typeof akumulasiJadwal[jadwal.course.name] == "undefined")
					akumulasiJadwal[jadwal.course.name] = jadwal.duration;
				else
					akumulasiJadwal[jadwal.course.name] += jadwal.duration;

				if (i == result.length-1) {
					defer.resolve();
				}
			};

			if (result.length == 0)
				defer.resolve();

			return defer.promise.then(function(){
				
				console.log(akumulasiJadwal);

				var data = [$q.when(['Kuliah', 'booking ruangan'])];

				Object.keys(akumulasiJadwal).forEach(function(key, index){
					data.push($q.when([key, akumulasiJadwal[key]]));
				});

				return $q.all(data).then(function(result){
					console.log(result);

					var data = google.visualization.arrayToDataTable(result);

					var options = {
					title: 'perbandingan booking ruangan setiap kuliah (dalam jam dan persen)'
					};

					var chart = new google.visualization.PieChart(document.getElementById('piechart'));

					$('#spinner').foundation('close');

					chart.draw(data, options);
				});
			});
		});
	}

      
	function drawChart() {
	
		var akumulasiPenggunaan = {};

		SchedulesResources.list({roomId:'_'}).$promise.then(function(result){
			var defer = $q.defer();

			console.log(result);

			
	
			for(var i=0; i<result.length; i++) {
				var _jadwal = result[i];

				if (typeof akumulasiPenggunaan[_jadwal.room.name] == "undefined")
					akumulasiPenggunaan[_jadwal.room.name] = _jadwal.duration;
				else
					akumulasiPenggunaan[_jadwal.room.name] += _jadwal.duration;

				if (i == result.length-1) {
					defer.resolve();
				}
			};



			if (result.length == 0)
				defer.resolve();

			return defer.promise.then(function(){
				

				console.log(akumulasiPenggunaan);

				var data_penggunaan_ruangan = [$q.when(['Ruang Kuliah', 'booking ruangan (jam)'])];

				Object.keys(akumulasiPenggunaan).forEach(function(key, index){
					data_penggunaan_ruangan.push($q.when([key, akumulasiPenggunaan[key]]));
				});

				return $q.all(data_penggunaan_ruangan).then(function(result){
					$scope.akumulasiPenggunaanRuangan = result;
					
					console.log(result);

					var data_penggunaan_ruangan = google.visualization.arrayToDataTable(result);

					var opt = {
						title: 'perbandingan booking ruangan (dalam jam dan persen)'
						};

					var chart = new google.visualization.PieChart(document.getElementById('piechart2'));

					chart.draw(data_penggunaan_ruangan, opt);
				});

			});
		});
	}
});
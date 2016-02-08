var app = angular.module('myApp',['ngResource']);

app.factory('RoomsResources', function ($resource) {

	var auth_header = { 'Authorization': 'Basic aWJyb2hpbWlzbGFtQGdtYWlsLmNvbTpwYXNzd29yZA=='};

    return $resource('http://lily.dev/api/v1/rooms/:id', {id:'@id'}, {
        list:  { method: 'GET', isArray:true, headers: auth_header},
        store: { method: 'POST', headers: auth_header},
        destroy: { method: 'DELETE', headers: auth_header},
    })
});

app.controller('MainController', function($scope, RoomsResources){
	$scope.rooms = RoomsResources.list();
	
	$scope.add = function(){
		
		var data = getFormJSON($('#form-tambah'));

		RoomsResources.store(data).$promise.then(function (result) {
		    $('#modalTambah').foundation('close');
			$scope.rooms = RoomsResources.list();
		});
	}

	$scope.confirmDelete = function(id){
		$('#hapus-id').val(id);
		$('#modalHapus').foundation('open');
	}

	$scope.destroy = function(id){
		var targetId = $('#hapus-id').val();

		RoomsResources.destroy({id: targetId}).$promise.then(function (result) {
		    $('#modalHapus').foundation('close');
			$scope.rooms = RoomsResources.list();
		});
	}
});
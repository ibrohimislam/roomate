<!doctype html>
<html class="no-js" lang="en" ng-app="myApp">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foundation for Sites</title>
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/app.extended.css">
    <link rel="stylesheet" href="css/foundation-icons.css">
  </head>
  <body ng-controller="MainController">

    
    <div class="row" style="margin-top: 10px;">
        <div class="medium-12 columns">
            <ul class="menu" style="border: 1px solid #DDD; border-radius: 3px;">
                <li class="menu-text logo"><a href="#">Roomate</a></li>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Kuliah</a></li>
                <li><a href="#">Ruangan</a></li>
            </ul>
        </div>

        <div class="medium-12 columns" style="margin-top: 10px;">
            <div class="panel-heading">
                Daftar Ruangan
            </div>
            <div class="panel-body">
                <div class="text-right">
                    <a class="button success" data-open="modalTambah"><i class="fi-plus"></i>&nbsp;Tambah</a>
                </div>
                <table>
                    <thead>
                        <tr>
                        <th width="200">Kode Ruangan</th>
                        <th width="150">Kapasitas</th>
                        <th>Status</th>
                        <th width="200">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="(_, room) in rooms">
                            <td>{{room.name}}</td>
                            <td>{{room.capacity}}</td>
                            <td>{{room.status}}</td>
                            <td>
                                <a href="#" class="button info"><i class="fi-pencil"></i>&nbsp;Ubah</a>
                                <a ng-click="confirmDelete(room.id)" class="button alert"><i class="fi-trash"></i>&nbsp;Hapus</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <div class="reveal" id="modalTambah" data-reveal>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
        <h2>Tambah Ruangan</h2>
        <form id="form-tambah">
            <label>Kode Ruangan:<input type="text" name="name"></label>
            <label>Kapasitas:<input type="text" name="capacity"></label>
            <a class="button" ng-click="add()">Tambah</a>
        </form>
    </div>

    <div class="reveal" id="modalHapus" data-reveal>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
        <h2>Hapus Ruangan</h2>
        <form id="form-tambah">
            <input type="hidden" id="hapus-id">
            <h4>Apakah Anda yakin untuk menghapus data ruangan ini?</h4>
            <a class="button alert" ng-click="destroy()">Hapus</a>
        </form>
    </div>

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/what-input/what-input.js"></script>
    <script src="bower_components/foundation-sites/dist/foundation.js"></script>
    
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>

    <script src="js/app.js"></script>
    <script src="js/app.library.js"></script>
    <script src="js/app.extended.js"></script>
</html>

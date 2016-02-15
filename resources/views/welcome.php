<!doctype html>
<html class="no-js" lang="en" ng-app="myApp">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roomate</title>
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/app.extended.css">
    <link rel="stylesheet" href="css/foundation-icons.css">
    <link rel="stylesheet" href="css/autocomplete.css">
  </head>
  <body>
    
    <div class="row" style="margin-top: 10px;">
        <div class="medium-12 columns">
            <ul class="menu" style="border: 1px solid #DDD; border-radius: 3px;">
                <li class="menu-text logo"><a href="#">Roomate</a></li>
                <li><a href="#/">Beranda</a></li>
                <li><a href="#/kuliah">Kuliah</a></li>
                <li><a href="#/ruangan">Ruangan</a></li>
                <li><a href="#/statistik">Statistik</a></li>
            </ul>
        </div>

        <div id="view" ng-view></div>
    </div>

    <div class="reveal tiny" id="spinner" style="width: 5%;" data-reveal>
        <img src="/img/spinner.gif">
    </div>

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/what-input/what-input.js"></script>
    <script src="bower_components/foundation-sites/dist/foundation.js"></script>
    
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="bower_components/angular-route/angular-route.min.js"></script>

    <script src="js/app.js"></script>
    <script src="js/autocomplete.js"></script>
    <script src="js/app.library.js"></script>
    <script src="js/app.extended.js"></script>

    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</html>

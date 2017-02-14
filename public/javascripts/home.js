var HOST = location.origin.replace(/^http/, 'ws')
var socket = io.connect(HOST, { 'forceNew': true });

var app = angular.module('appGeolocalizacion', []);

app.controller('CtrlGeolocalizacion',['$scope', function(scope){

  var gMap;
  var sentData = {};
  var puntosDestino = [];
  var output = document.getElementById('map'); // Div - Contenedor del mapa
  var geocoder = new google.maps.Geocoder();

  scope.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
  scope.directionsService = new google.maps.DirectionsService;

  scope.position = null;
  scope.username = '';
  scope.destino = '';

  scope.initMap = function(){
    scope.setGeoPosition();
  }


  scope.getId = function(id, nombre){
    setTimeout(function () {
      scope.username = nombre;
      sentData = {
        id: id,
        nombre: nombre,
        coordsOrigen: {
          lat: scope.position.coords.latitude,
          lng: scope.position.coords.longitude,
          address: scope.hubicacion
        },
        coordsDestino: {
          lat: null,
          lng: null,
          address: ''
        }
      }
      socket.emit('room', sentData);
    }, 1000);
  }

  socket.on('getDestino', function(data){
    scope.destino = data;
    geocoder.geocode({address: data}, scope.renderMarckerDestino);
    scope.$apply();
  })

  scope.logout = function(id){ socket.emit('logout', id); }


  scope.createMapa = function(position){
    gMap = new google.maps.Map(output,{
      center: {lat: position.coords.latitude, lng: position.coords.longitude},
      zoom: 15,
    });
  }

  scope.setGeoPosition = function(){
    navigator.geolocation.getCurrentPosition(function(position){
      if(scope.position == null){
        scope.createMapa(position);
        scope.getMyLocation(position);
        //scope.newPosition();
      }
      scope.position = position;
      scope.$apply();
    }, scope.positionError, { enableHighAccuracy: true });
  }

  scope.getMyLocation = function(position){
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var gMarker = new google.maps.Marker( {
      position: myLocation,
      map: gMap,
      title: 'location'
    } );
    geocoder.geocode({ 'latLng': myLocation }, function(result, status){
      var msgHubicacion = (status == 'OK')? result[0].formatted_address : 'Error: No se encontro la hubicación';
      scope.hubicacion = msgHubicacion;
      scope.$apply();
    });
  }

  /* -- Destino -- */
  scope.renderMarckerDestino = function(datos){
    var coordenadasDestino = datos[0].geometry.location;
    var destino = new google.maps.Marker({
                  position: coordenadasDestino,
                  map: gMap,
                  title: datos[0].formatted_address,
                });
        destino.setIcon('http://www.stad.com/mapicons/purpledot.png');
        scope.limpiarDestinos();
        puntosDestino.push({destino});
        scope.calculateAndDisplayRoute();
        return false;
  }

  scope.showMarkerDestino = function(map){
    var map = (map == null)? map : gMap;
    puntosDestino.map(function(data, index){
      data.destino.setMap(map);
    });
  }

  scope.limpiarDestinos = function() {
    scope.showMarkerDestino(null);
    puntosDestino = [];
  }

  /*scope.newPosition = function(){
    setInterval(function () {
      scope.setGeoPosition();
     
    }, 10000);
  }*/

  scope.positionError = function(){ /*Code... */ }

  scope.calculateAndDisplayRoute = function() {

    scope.directionsDisplay.setMap(gMap);

    var latLng = puntosDestino[0].destino.getPosition();

    scope.directionsService.route({
      origin: {lat: scope.position.coords.latitude, lng: scope.position.coords.longitude},
      destination: {lat: latLng.lat(), lng: latLng.lng()},
      travelMode: google.maps.TravelMode['DRIVING']
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        scope.directionsDisplay.setDirections(response);
        scope.$apply();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


}]);

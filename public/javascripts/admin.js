var HOST = location.origin.replace(/^http/, 'ws')
var socket = io.connect(HOST, { 'forceNew': true });

var output = document.getElementById('map'); // Div - Contenedor del mapa
var inputDestino = document.getElementById('pac-input');

/* -- Set Variables Google -- */
var map = new google.maps.Map(output,{
              center: {lat: 19.0273905, lng: -98.1614445},
              zoom: 8
            });
var geocoder = new google.maps.Geocoder();

var infowindow = new google.maps.InfoWindow();
var marker = new google.maps.Marker({
  map: map,
  draggable: true,
  anchorPoint: new google.maps.Point(0, -29)
});

var options = { componentRestrictions: {country: 'mx'} };
var autocomplete = new google.maps.places.Autocomplete(inputDestino, options);
autocomplete.bindTo('bounds', map);


var app = angular.module('appGeolocalizacion', []);

app.controller('CtrlGeolocalizacion',['$scope', function(scope){
  scope.empleados = {};


  socket.on('getEmpleados', function(req, res){
    scope.empleados = req;
    scope.$apply();
  });

  socket.on('empleado', function(req, res){
    console.log(req)
    setTimeout(function () {
      var liUser = $('#' + req.id);
      if(req.status == 1)
      liUser.find('i').removeClass('desconnected').addClass('connected');
      else
      liUser.find('i').removeClass('connected').addClass('desconnected');
    }, 1000);
  });


  /* ----- Modal ----- */

  scope.showModal = function(id){
    $('#setModalCoordenadas').modal('show');
    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("Autocomplete's returned place contains no geometry");
        return;
      }
      marker.setIcon(({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      $("#btnSetDestino").attr("set-destino", id);
    });
  }

}]);

/** -- Directivas  -- */

app.directive('setDestino', function(){
  return {
    restrict: "A",
    link: function(scope, el, attr){
      attr.$observe("setDestino", function(data){
        var id;
        var sendData = [];

        $(el).on('click', function(){
          var tag = $(this);
          id = tag.attr('set-destino');
          var destino = $("#pac-input").val();

          $("#destino"+id).html(destino);
          socket.emit('sendDestino', {id: id, destino: destino});
          inputDestino.value = '';
          $('#setModalCoordenadas').modal('hide')
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
          var destino = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
          geocoder.geocode({ 'latLng': destino }, function(result, status){
            var destino = (status == 'OK')? result[0].formatted_address : 'Error: No se encontro la hubicación';
            socket.emit('sendDestino', {id: id, destino: destino});
            $("#destino"+id).html(destino)
          });
        });
      });
    }
  }
});

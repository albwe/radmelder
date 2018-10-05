ngular.module('radwege').controller("edit", ['$scope', '$http', '$filter', 'leafletMarkerEvents', '$log', 'leafletData', '$timeout', function($scope, $http, $filter, leafletMarkerEvents, $log, leafletData, $timeout) {
  var whiteIcon = {
    type: 'extraMarker',
    markerColor: 'white'
  };
  $scope.filtern= {
    published: 0
  }
  $scope.events = {
                markers: {
                    enable: leafletMarkerEvents.getAvailableEvents(),
                }
              };
  $scope.resetlatlng = function (f) {
    f.lat = f.oldlat;
    f.lng = f.oldlng;
    f.newlatlng = false;
  };
  $scope.save = function (f) {
    $http.post("savechange.php", JSON.stringify(f)).then(function (response) {
      if (response.data.success=="1") {
        alert("Änderungen gespeichert. Der Eintrag ist aber noch nicht freigeschaltet.");
      }
    });
  };
  $scope.publish = function (f) {
    $http.post("publish.php", JSON.stringify(f)).then(function (response) {
      if (response.data.success=="1") {
        alert("Änderungen gespeichert. Der Eintrag ist freigeschaltet.");
        //$scope.$apply(function () {
        $scope.eintraege.splice($scope.eintraege.indexOf(f), 1);
        $scope.f = $filter('filter')($scope.eintraege, $scope.filtern)[0];
        $scope.selecteditem();
        //});
      }
    });
  };
  $scope.decline = function (f) {
    if (confirm("Den Eintrag wirklich löschen?")) {
      $http.post("decline.php", JSON.stringify({id: f.id})).then(function (response) {
        //$scope.$apply(function () {
        $scope.eintraege.splice($scope.eintraege.indexOf(f), 1);
        $scope.f = $filter('filter')($scope.eintraege, $scope.filtern)[0];
        $scope.selecteditem();
        //});
      });
  }
};
$scope.orten = function (q) {
  var code = encodeURIComponent(q);
  $scope.suche_laeuft=true;
  $http.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+code+".json?limit=1&bbox=7.4737852,51.8401447,7.7743634,52.060025&country=de&language=de&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw").then(function (response) {
    if (response.data.features[0]) {
    var coords = response.data.features[0].geometry.coordinates;
    $log.log(coords);
    $scope.f.lat = coords[1];
    $scope.f.lng = coords[0];
    $scope.f.oldlat = coords[1];
    $scope.f.oldlng = coords[0];
    $scope.center.lat = $scope.f.lat;
    $scope.center.lng = $scope.f.lng;
  }
  else {
    alert("Das konnte leider nicht gefunden werden");
  }
  })
};
$scope.upload = function (f) {
  var data = {id: f.id};
  data.BildURI = $scope.imageupload.compressed.dataURL;
  $http.post("upload.php", JSON.stringify(data)).then(function (response) {
    $scope.f.Bild = response.data;
  })
};
$scope.$on('leafletDirectiveMarker.editmap.dragend', function (e, args) {
      $scope.f.newlatlng = true;
      $scope.f.lat = args.model.lat;
      $scope.f.lng = args.model.lng;
});
  $http.get("getunpublished.php").then(function (response) {
    var markers = response.data.markers;
    for (var i=0; i<markers.length; i++) {
      markers[i].draggable = true;
      markers[i].icon = whiteIcon;
      markers[i].lat = Number(markers[i].lat);
      markers[i].lng = Number(markers[i].lng);
      markers[i].oldlat = Number(markers[i].lat);
      markers[i].oldlng = Number(markers[i].lng);
    }
    $scope.eintraege = markers;
    $scope.f = $filter('filter')($scope.eintraege, $scope.filtern)[0];
    $scope.selecteditem();
  });
  $scope.mail = {
    subject: "Rückfrage zu Ihrem Leezenstadt-Beitrag",
    message:""
  };
  $scope.activatemail = function (f) {
    $scope.mail.message = "Liebe*r Nutzer*in!\n\nWir danken Ihnen sehr für Ihren Beitrag "+f.Titel+".\n\nLeider ist bei uns dazu kein Foto eingegangen. Da es immer zu technischen Problemen kommen kann, haken wir lieber noch einmal nach: Haben Sie ein Foto eingesandt?\n\nWir freuen uns über eine Rückmeldung und ggf. die Zusendung eines Fotos. Danach veröffentlichen wir Ihren Eintrag. Sie können gern auch noch ein Foto nachreichen.\n\n Vielen Dank für Ihre Beteiligung!\n\nIhr Leezenstadt-Team\n\n[Interne ID: "+f.id+"]";
    $scope.mailing=true;
  };
$scope.sendmail = function (f, m) {
  m.id = f.id;
  m.address = f.mail;
  $http.post("mail.php", JSON.stringify(m)).then(function (response) {
    alert(response.data);
    $scope.mailing=false;
    $scope.mail = {
      subject: "Rückfrage zu Ihrem Leezenstadt-Beitrag",
      message:""
    };
  });
};
$scope.resetmail = function () {
  $scope.mailing=false;
  $scope.mail = {
    subject: "Rückfrage zu Ihrem Leezenstadt-Beitrag",
    message: $scope.f.mailing? $scope.f.mailing: "",
  };
};
$scope.selecteditem = function () {
  $scope.resetmail();
  $scope.markers.f = $scope.f;
  $scope.center.lat = $scope.f.lat;
  $scope.center.lng = $scope.f.lng;
  $timeout(function () {
  leafletData.getMap("editmap").then(function (map) {
    map.invalidateSize();
  });}, 2);
};
$scope.center = {
  lat: 51.964398,
  lng: 7.617774,
  zoom: 18
};
$scope.markers = {};
}]);

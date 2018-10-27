angular.module('radwege').controller("edit", ['$scope', '$http', '$filter', 'leafletMarkerEvents', '$log', 'leafletData', '$timeout', 'services', 'appCfg', function($scope, $http, $filter, leafletMarkerEvents, $log, leafletData, $timeout, services, appCfg) {
  var whiteIcon = {
    type: 'extraMarker',
    markerColor: 'white'
  };
  $scope.getColorFromStatus = services.getColorFromStatus;
  $scope.filtern= {
    published: 0,
    declined: 0
  };
  $scope.ntag = {};
  $scope.new_tag_name = false;
  $scope.adding_tag = false;
  $scope.update_tag_name = function () {
    if ($scope.tag_name_select=="new") {
      $scope.ntag.tag_name = "";
      $scope.new_tag_name = true;
    }
    else {
      $scope.new_tag_name=false;
      $scope.ntag.tag_name= $scope.tag_name_select;
    }
  };
  $scope.add_tag = function (id, tag) {
    $http.post("add_tag.php", {id: id, tag_name: tag.tag_name, tag_value: tag.tag_value}).then(function (response) {
      $scope.f.tags.push(angular.copy(tag));
      $scope.adding_tag = false;
      $scope.ntag = {};
      $scope.new_tag_name = false;
      $scope.tag_name_select = "";
    });
  };
  $scope.remove_tag = function (tag) {
    $http.post("remove_tag.php", {id: tag.id}).then(function () {
      $scope.f.tags.splice($scope.f.tags.indexOf(tag), 1);
    });
  };
  $scope.export = function(markers) {
    o = angular.copy(markers);
    for (var i=0; i < o.length; i++) {
      delete o[i].mail;
      delete o[i].mailing_time;
      delete o[i].mailing;
      delete o[i].icon;
      delete o[i].draggable;
      delete o[i].oldlat;
      delete o[i].oldlng;
      var tags_str = "";
      for(var j=0; j<o[i].tags.length;j++) {
        var tag = o[i].tags[j];
        if(tag.tag_name && tag.tag_name!="") {
          o[i][tag.tag_name]=tag.tag_value;
        }
        else {
          tags_str += tags_str==""?tag.tag_value:(","+tag.tag_value);
        }
      }
      for(var k=0; k < $scope.tag_names.length;k++) {
        if(!o[i][$scope.tag_names[k]]) {
          o[i][$scope.tag_names[k]]="";
        }
      }
      o[i].tags = tags_str;
    }
    console.log(o);
    return o;
  };
  $scope.getZip = function (o) {
    console.log("Funktion erreicht");
    $scope.zip_ready = false;
    $scope.zip_loading = true;
    files = [];
    for (var i=0; i<o.length; i++) {
      files.push(o[i].Bild);
    }
    $http.post("download_images.php", JSON.stringify({files: files})).then(function (response) {
      if(response.data.success=="1") {
        $scope.zip_ready = true;
        $scope.zip_loading = false;
        $scope.zip_link = response.data.file_name;
      }
      else {
        $scope.zip_loading = false;
        alert("Fehler: "+response.data.error);
      }

    });
  };
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
    var verb = f.published==0?'löschen':'verwerfen';
    if (confirm("Den Eintrag wirklich "+verb+"?")) {
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
  //var code = encodeURIComponent(q);
  $scope.suche_laeuft=true;
  $http.get(services.getMapboxGeocoding(q, appCfg.mapbox)).then(function (response) {
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
    $scope.tag_names = response.data.tag_names;
    $scope.f = $filter('filter')($scope.eintraege, $scope.filtern)[0];
    $scope.selecteditem();
  });
  $scope.mail = {
    subject: "Rückfrage zu Ihrem Radmelder-Beitrag",
    message:""
  };
  $scope.activatemail = function (f) {
    $scope.mail.message = "Liebe*r Nutzer*in!\n\nWir danken Ihnen sehr für Ihren Beitrag "+f.Titel+".\n\nLeider ist bei uns dazu kein Foto eingegangen. Da es immer zu technischen Problemen kommen kann, haken wir lieber noch einmal nach: Haben Sie ein Foto eingesandt?\n\nWir freuen uns über eine Rückmeldung und ggf. die Zusendung eines Fotos. Danach veröffentlichen wir Ihren Eintrag. Sie können gern auch noch ein Foto nachreichen.\n\n Vielen Dank für Ihre Beteiligung!\n\nIhr Radmelder-Team\n\n[Interne ID: "+f.id+"]";
    $scope.mailing=true;
  };
$scope.sendmail = function (f, m) {
  m.id = f.id;
  m.address = f.mail;
  $http.post("mail.php", JSON.stringify(m)).then(function (response) {
    alert(response.data);
    $scope.mailing=false;
    $scope.mail = {
      subject: "Rückfrage zu Ihrem Radmelder-Beitrag",
      message:""
    };
  });
};
$scope.resetmail = function () {
  $scope.mailing=false;
  $scope.mail = {
    subject: "Rückfrage zu Ihrem Radmelder-Beitrag",
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
  lat: appCfg.geo_data.default_point.lat,
  lng: appCfg.geo_data.default_point.lng,
  zoom: appCfg.settings.edit_point_map_zoom
};
$scope.markers = {};
}]);

var app = angular.module("radwege", ['ui-leaflet', 'ngCookies', 'LocalStorageModule', 'ngImageCompress', 'ngSanitize', 'ngCsv']);
app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
  .setPrefix('melder')
  .setStorageCookie(120, '/', false)
  .setStorageCookieDomain('albwe.de');
});
app.factory('services', function (appCfg) {
  var object = {
    displayCategories: appCfg.settings.displayCategories,
  categories: appCfg.categories,
  status: appCfg.status,
  layers: appCfg.settings.displayCategories? appCfg.categories:appCfg.status,
  getMapboxGeocoding: function (data, mapboxConfig) {
    var code = encodeURIComponent(data);
    var area = mapboxConfig.area_corner;
    return "https://api.mapbox.com/geocoding/v5/mapbox.places/"+code+".json?limit=1&bbox="+area.left_bottom.lng+","+area.left_bottom.lat+","+area.right_top.lng+","+area.right_top.lat+"&country=de&language=de&access_token="+mapboxConfig.access_token;
  },
  getColorCode: function (color) {
    switch (color) {
      case "yellow":
        return "#f5b730";
      case "green":
        return "#009244";
      case "red":
        return "#9c262a";
      case "blue":
        return "#1a586a";
      case "violet":
        return "#4d2860";
      case "orange":
        return "#ee8918";
      case "cyan":
        return "#25a3db";
      case "pink":
        return "#ba4898";
      case "black":
        return "#231f20";
    }
  },
  changeLayers: function() {
    object.layers = (object.displayCategories)?object.status:object.categories;
    object.displayCategories = !object.displayCategories;
  },
  buildLayers: function () {
    var customLayers = {};
    for(var i=0; i<object.layers.length;i++) {
      customLayers[object.layers[i].short] = {type: "group"};
      if(object.layers[i].visibleOnMap) {
        customLayers[object.layers[i].short].name = "<span class='fa fa-circle' style='color: "+object.getColorCode(object.layers[i].color)+";'></span>&nbsp;<span class='badge badge-secondary' style='background-color: "+object.getColorCode(object.layers[i].color)+"'>"+object.layers[i].name+"</span>";
      }
      customLayers[object.layers[i].short].visible = object.layers[i].visibleOnMap;
    }
    return customLayers;
  },
  getObject: function (name, ifCategory) {
    var objects = ifCategory? object.categories : object.status;
    for(var i=0; i<objects.length; i++) {
      c = objects[i];
      if(c.name==name) {
        return c;
      }
    }
  },
  getLayer: function (name) {
    var o = object.getObject(name, object.displayCategories);
    if(o) {
      return o.short;
    }
    else {
      return "all";
    }
    },
    getColorFrom: function (category, ifCategory) {
      c = object.getObject(category, ifCategory);
      if(c) {
        return object.getColorCode(c.color);
      }
      else {
        return "#6c757d";
      }
    },
    getColorFromCategory: function (name) {
      return object.getColorFrom(name, true);
    },
    getColorFromStatus: function (name) {
      return object.getColorFrom(name, false);
    },
    getColorFromLayer: function (name) {
      return object.getColorFrom(name, object.displayCategories);
    },
    icons: {
      redIcon: {
      type: 'extraMarker',
      markerColor: 'red'
    },
    selectedIcon: {
      type: 'extraMarker',
      markerColor: 'green'
    },
    yellowIcon: {
      type: 'extraMarker',
      markerColor: 'yellow'
    },
    greenIcon: {
      type: 'extraMarker',
      markerColor: 'green'
    },
    whiteIcon: {
      type: 'extraMarker',
      markerColor: 'white'
    },
    blueIcon: {
      type: 'extraMarker',
      markerColor: 'blue-dark'
    },
    violetIcon: {
      type: 'extraMarker',
      markerColor: 'purple'
    },
    orangeIcon: {
      type: 'extraMarker',
      markerColor: 'orange'
    },
    cyanIcon: {
      type: 'extraMarker',
      markerColor: 'cyan'
    },
    pinkIcon: {
      type: 'extraMarker',
      markerColor: 'pink'
    },
    blackIcon: {
      type: 'extraMarker',
      markerColor: 'black'
    }
  },
  getIconFromCategory: function (category) {
    var o = object.getObject(category, true);
    var o = object.getObject(name, object.displayCategories);
    if(o) {
      return object.getIconFromColor(o.color);
    }
    else {
      return object.getIconFromColor("black");
    }
  },
  getIconFromLayer: function(name) {
    var o = object.getObject(name, object.displayCategories);
    if(o) {
      return object.getIconFromColor(o.color);
    }
    else {
      return object.getIconFromColor("black");
    }
  },
    getIconFromColor: function (color) {
      switch (color) {
        case "yellow":
          return object.icons.yellowIcon;
        case "green":
          return object.icons.greenIcon;
        case "red":
          return object.icons.redIcon;
        case "blue":
          return object.icons.blueIcon;
        case "violet":
          return object.icons.violetIcon;
        case "orange":
          return object.icons.orangeIcon;
        case "cyan":
          return object.icons.cyanIcon;
        case "pink":
          return object.icons.pinkIcon;
        case "black":
          return object.icons.blackIcon;
        }
    }};
    return object;
});
app.controller("core", ['$scope', '$http', 'leafletData', 'leafletMapEvents', 'leafletMarkerEvents', '$log', '$anchorScroll', 'localStorageService', '$timeout', 'services', 'appCfg', '$window', function ($scope, $http, leafletData, leafletMapEvents, leafletMarkerEvents, $log, $anchorScroll, localStorageService, $timeout, services, appCfg, $window) {

  var buildMarkers = function(markers) {
    var bild;
    for(var i=0;i<markers.length;i++) {
      markers[i].icon = services.getIconFromLayer(services.displayCategories? markers[i].Kategorie : markers[i].Bearbeitungsstatus);
      //markers[i].layer = markers[i].Kategorie;
      markers[i].lat = Number(markers[i].lat);
      markers[i].lng = Number(markers[i].lng);
      markers[i].layer = services.getLayer(services.displayCategories? markers[i].Kategorie : markers[i].Bearbeitungsstatus);
      bild = "";
      if (markers[i].Bild) {
        bild = "<div><img style=\"max-width: 100%; max-height: 200px;\" src=\"/upload/"+markers[i].Bild+"\"></div>";
      }
    markers[i].message =  bild + "<h5 class=\"markertitle\">"+markers[i].Titel+"<span class=\"badge badge-secondary\" style=\"background-color: "+services.getColorFromLayer(services.displayCategories? markers[i].Kategorie : markers[i].Bearbeitungsstatus)+";\">"+markers[i].Kategorie+"</span></h5><p ng-show=\"show"+markers[i].id+"\">"+markers[i].Problem+"</p><button class='btn btn-outline-secondary btn-sm cl' ng-click=\"show"+markers[i].id+"=!show"+markers[i].id+";\" ng-hide=\"show"+markers[i].id+"\">Mehr</button><button class=\"btn btn-outline-secondary btn-sm\" ng-class=\"{'text-white': markers["+i+"].clicked}\" ng-style=\"markers["+i+"].user_supported? {cursor: 'default'}:null\" ng-click=\"vote(markers["+i+"])\"><span ng-hide=\"markers["+i+"].user_supported\"><span class=\"fas fa-thumbs-up\"></span> Voten</span><span ng-show=\"markers["+i+"].user_supported\"><span class=\"fas fa-check\"></span>Gevoted</span></button><span ng-class=\"{'text-white': markers["+i+"].clicked, 'text-muted': !f.clicked}\">&nbsp;{{markers["+i+"].supported? markers["+i+"].supported:0}}x gevoted</span>";
      markers[i].getMessageScope = function () {return $scope;};
      markers[i].supported = markers[i].supported? parseInt(markers[i].supported) : 0;
      if (localStorageService.keys().indexOf(markers[i].id)!=-1) {
        markers[i].user_supported = true;
      }
    }
    return markers;
  }

  $scope.changeLayers = function () {
    services.changeLayers();
    $scope.layers.overlays = services.buildLayers();
    $scope.markers = buildMarkers($scope.markers);
  }

  $scope.getColorFromKategorie = services.getColorFromCategory;
  $scope.getColorFromStatus = services.getColorFromStatus;
  $scope.visuals = appCfg.visuals;
/*$scope.goToElement = function(id) {
  var j;
  for(var i=0;i<$scope.markers.length;i++) {
    if($scope.markers[i].id==id) {
      $scope.markers[i].more=true;
      $scope.markers[i].clicked=true;
      j = i;
    }
    else {
      $scope.markers[i].clicked=false;
    }
  }
  $scope.currentPage = Math.floor(j/$scope.pageSize);
  $timeout(function () {
    $anchorScroll('eintrag'+id);
  }, 10);
}*/
$scope.$on("leafletDirectiveMap.main.click", function(event){
  $scope.defaults.scrollWheelZoom = true;
});

  angular.extend($scope, {
    form_completed: false,
    punktgewaehlt: false,
    gps: function () {
      if (navigator.geolocation) {
        $scope.suche_laeuft = true;
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        $scope.ownpoint.lat = position.coords.latitude;
        $scope.ownpoint.lng = position.coords.longitude;
        $scope.owncenter.lat = position.coords.latitude;
        $scope.owncenter.lng = position.coords.longitude;
        $scope.ownpoint.oldlat = position.coords.latitude;
        $scope.ownpoint.oldlng = position.coords.longitude;
        //$scope.ownpoint.latlng = position.coords.latitude.toString() + ", " + position.coords.longitude.toString();
        $scope.ownpoint.visible = true;
        //$scope.ownpoint.message = "Der Punkt wurde ermittelt.";
        $scope.ownmarkers.marker = $scope.ownpoint;
        $scope.standort_ermittelt = true;
        $scope.ownpoint.draggable = true;
        //$scope.ownpoint.focus = true;
        //$scope.punktgewaehlt=true;
        $timeout(function () {
        leafletData.getMap("ownpoint").then(function (map) {
          map.invalidateSize();
          $scope.suche_laeuft = false;
        });}, 10);
      });
    }, function () {}, {enableHighAccuracy: true});
  }},
    events:{
      map: {
                    enable: leafletMapEvents.getAvailableMapEvents(),
                    logic: 'emit'
                }
    },
    selectListElement: function (f) {
      if (!f.active) {
        var m;
        for (i=0; i<$scope.markers.length;i++) {
          m = $scope.markers[i];
          m.active=false;
          m.icon=services.getIconFromLayer(services.displayCategories? m.Kategorie : m.Bearbeitungsstatus);
        }
        f.active=true;
        f.icon=services.icons.selectedIcon;
      }
    },
    listMouseLeave: function (f) {
      if (f.active) {
        f.active=false;
        f.icon = services.getIconFromLayer(services.displayCategories? f.Kategorie : f.Bearbeitungsstatus);
      }
    },
    defaults: {
      scrollWheelZoom: false,
      zoomControlPosition: 'bottomright',
      controls: {
        layers: {
          visible: true,
          position: 'bottomleft',
          collapsed: ($window.innerWidth<$window.innerHeight)
        }
      }
    },
    layers: {
      overlays: services.buildLayers()
  },
  addpoint: false,
    main_center: {
      lng: appCfg.geo_data.main_map_center.lng,
    	lat: appCfg.geo_data.main_map_center.lat,
    	zoom: appCfg.settings.main_map_zoom
    },
    icons: services.icons,
    tiles: {
      url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+appCfg.mapbox.access_token,
      options: {
        id: 'mapbox/streets-v11',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      }
    },
    layercontrol: {
      icons: {
          uncheck: "fa fa-toggle-off",
          check: "fa fa-toggle-on"
      }
    }
  });
    $http.get("php/getstellen.php").then(function (result) {
      markers=result.data.markers;
      angular.extend($scope, {
        markers: buildMarkers(markers)
      });
      leafletData.getMap("main").then(function(map) {
        var btn = L.easyButton({
          states: [
            {
              stateName: 'Kategorien',
              icon: '<i class="fas fa-exchange-alt"></i>&nbsp;Kategorien anzeigen',
              onClick: function(btn, map) {
                $scope.changeLayers();
                btn.state("Bearbeitungsstatus");
              },
              title: 'Anzeige wechseln'
            },
            {
              stateName: 'Bearbeitungsstatus',
              icon: '<i class="fas fa-exchange-alt"></i>&nbsp;Bearbeitungsstatus anzeigen',
              onClick: function(btn, map) {
                $scope.changeLayers();
                btn.state("Kategorien");
              },
              title: 'Anzeige wechseln'
            }],
            position: 'bottomleft'
          });
          btn.addTo(map);
          btn.state(services.displayCategories? "Bearbeitungsstatus":"Kategorien");
      });
    });
    $scope.ownpoint = {
      icon: services.icons.whiteIcon,
      lng: appCfg.geo_data.default_point.lng,
      lat: appCfg.geo_data.default_point.lat,
      Problem: "",
      Sachverhalt: "",
      Loesung: "",
      Titel: "",
      Bild: "",
      position_text: "",
      latlng: "",
      visible: false,
      mail: ""
    };
    $scope.owncenter = {
      lng: appCfg.geo_data.default_point.lng,
      lat: appCfg.geo_data.default_point.lat,
      zoom: appCfg.settings.add_point_map_zoom
    };
    $scope.$on("leafletDirectiveMarker.ownpoint.dragend", function (elem, args) {
      $scope.marker_gezogen = true;
      $scope.ownpoint.lat = args.model.lat;
      $scope.ownpoint.lng = args.model.lng;
    });
    $scope.$on("leafletDirectiveMap.ownpoint.click", function (event, args) {
      $scope.marker_gezogen = true;
      $log.log(event, args);
      $scope.ownpoint.lat = args.leafletEvent.latlng.lat;
      $scope.ownpoint.lng = args.leafletEvent.latlng.lng;
    });
    $scope.suchen = function (q) {
      //var code = encodeURIComponent(q);
      $scope.suche_laeuft=true;
      $http.get(services.getMapboxGeocoding(q, appCfg.mapbox)).then(function (response) {
        if(response.data.features.length>0) {
        var coords = response.data.features[0].geometry.coordinates;
        $log.log(coords);
        $scope.ownpoint.lat = coords[1];
        $scope.ownpoint.lng = coords[0];
        $scope.owncenter.lat = coords[1];
        $scope.owncenter.lng = coords[0];
        $scope.ownpoint.oldlat = coords[1];
        $scope.ownpoint.oldlng = coords[0];
        //$scope.ownpoint.latlng = position.coords.latitude.toString() + ", " + position.coords.longitude.toString();
        $scope.ownpoint.visible = true;
        //$scope.ownpoint.message = "Der Punkt wurde ermittelt.";
        $scope.ownmarkers.marker = $scope.ownpoint;
        $scope.standort_ermittelt = true;
        $scope.ownpoint.draggable = true;
        $timeout(function () {
        leafletData.getMap("ownpoint").then(function (map) {
          map.invalidateSize();
          $scope.suche_laeuft = false;
        });}, 10);
      }
      else {
        $scope.suche_laeuft= false;
        alert("Leider wurde keine passende Adresse gefunden. Bitte kontrolliere deine Eingabe.");
      }
      })
    };
    $scope.ownmarkers = {};
    $scope.submit_form = function () {
      return false;
    };
    $scope.resetlatlng = function () {
      $scope.ownpoint.lat = $scope.ownpoint.oldlat;
      $scope.ownpoint.lng = $scope.ownpoint.oldlng;
      $scope.marker_gezogen = false;
    };
    $scope.clear_form = function() {
      $scope.ownpoint = {
        icon: icons.whiteIcon,
        lng: appCfg.geo_data.default_point.lng,
        lat: appCfg.geo_data.default_point.lat,
        Problem: "",
        Loesung: "",
        Titel: "",
        Bild: "",
        position_text: "",
        latlng: "",
        visible: false,
        draggable: false
      };
      $scope.ownmarkers.marker = $scope.ownpoint;
      $scope.standort_ermittelt = false;
      delete $scope.imageupload;
      $scope.leeren();
      $scope.form_completed = false;
    }
    $scope.vote = function (f) {
      if (!f.user_supported) {
      $http.post("php/vote.php", JSON.stringify({'id': f.id})).then(function (response) {
        f.supported = parseInt(response.data.supported);
        localStorageService.set(f.id, Date.now());
        f.user_supported = true;
      });
    }
    };
    $scope.currentPage = 0;
    $scope.pageSize = 12;
    $scope.numberOfPages=function(){
      if ($scope.markers) {
        return Math.ceil($scope.markers.length/$scope.pageSize);
      }
      else {
        return 0;
      }
    }
    $scope.kategorieFilter = [];
    $scope.filterFunction = function(e) {
      if ($scope.kategorieFilter.indexOf(e.Kategorie)>-1 || $scope.kategorieFilter.length==0) {
        return true;
      }
      else {
        return false;
      }
    };
    $scope.leeren = function () {
      document.getElementById('takePictureField').value ='';
    }
    $scope.send_new2 = function () {
      $scope.inprogress = true;
      var data = angular.copy($scope.ownpoint);
      var code = data.position_text;
      if($scope.imageupload) {
        data.BildURI = $scope.imageupload.compressed.dataURL;
      }
      else {
        data.BildURI = "";
      }
      if (!$scope.standort_ermittelt) {
        $http.get(services.getMapboxGeocoding(code, appCfg.mapbox)).then(function (response) {
          var coords = response.data.features[0].geometry.coordinates;
          data.lng = coords[0];
          data.lat = coords[1];
      $http.post("php/new2.php", JSON.stringify(data)).then(function (response) {
        $scope.form_completed = true;
        $scope.inprogress = false;
      });
    });
  }
  else {
      $http.post("php/new2.php", JSON.stringify(data)).then(function(response) {
        $scope.form_completed = true;
        $scope.inprogress = false;
      });
    }
  };
  $scope.scrollToListTop = function () {
    $anchorScroll("problemliste");
  }
}]);

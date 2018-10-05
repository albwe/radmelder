angular.module("radwege").constant('appCfg', {
    name: "Radmelder",
    geo_data: {
      default_point: {
        lat: 51.964398,
        lng: 7.617774
      }
    },
    mapbox: {
      access_token: "",
      area_corner: {
        left_bottom: {
          lat: 51.8401447,
          lng: 7.4737852
        },
        right_top: {
          lat: 52.060025,
          lng: 7.7743634
        }
      }
    }
});

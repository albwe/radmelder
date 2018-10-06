angular.module("radwege").constant('appCfg', {
    name: "Radmelder",
    geo_data: {
      default_point: {
        lat: 51.964398,
        lng: 7.617774
      },
      main_map_center: {
        lng: 7.6254,
        lat: 51.9623
      }
    },
    settings: {
      main_map_zoom: 13,
      add_point_map_zoom: 17,
      edit_point_map_zoom: 18
    },
    visuals: {
      logo: "img/logo.svg",
      header_title: "Radmelder",
      main: {
        title: "Kleine Schritte – Große Wirkung: <b>Fahrradweg-Melder</b> für Musterstadt!",
        content: [
          "Markiere auf dieser Karte, wo das Fahrradfahren in Musterstadt für dich unbequem, stressig oder gar gefährlich wird. Teile uns die Problemstelle möglichst genau mit, indem du am besten auch ein Foto davon hochlädst. Beschreibe, was dich stört und warum. Äußere deinen Verbesserungsvorschlag. Das hat schon vor dir jemand gemacht? Dann vote es hoch! Wenn du willst, kannst du uns auch deine Mailadresse hinterlassen, damit wir dich bei Unklarheiten kontaktieren können.",
          "Dein Fahrrad. Dein Weg. Deine Stadt. Packen wir es an!"
        ],
        call_to_action: "Problem melden"
      },
      form: {
        mail: {
          label: "E-Mail-Adresse für Rückfragen (wird nicht veröffentlicht)",
          caption: "Gib deine Mail-Adresse für evtl. Rückfragen an."
        },
        privacy_note: "Ich stimme der Speicherung meiner E-Mail-Adresse, der anonymisierten Veröffentlichung meiner Einreichung und der Nutzung meines Bildes zu.",
        success_note: "Vielen Dank für die Einsendung. Der Beitrag wird von uns geprüft und dann online gestellt."
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

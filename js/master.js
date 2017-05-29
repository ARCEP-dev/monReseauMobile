var zoomTransition = 6;
var flagGeocoder = 0;
var strate = "national";
var carteCouverture = "voix";
var carteCouvertureAvant = "voix";
var technoCarteCouverture = "4G";
var technoCarteCouvertureAvant = "4G";
var strateTransports = "autoroutes";
var sousStrateTransports = "toutesAutoroutes";
var MCCMNCCouv;
var MCCMNCCouvAvant;
var MCCMNC;
var PopupInfosLegendeCouvVoixEstFerme = 0;
var PopupsInfosLegendeCouvDataSontFermes = 0;
var affiche2G = 0;
var affiche3G = 0;
var affiche4G = 1;
var uniteCouv = "Couverture_en_territoire";
var couvertureQosAvant = "couverture";
var couvertureQos = "couverture";
var agglosTransportsAvant = "transports";
var agglosTransports = "transports";
var transportsVoixDataAvant = "data";
var transportsVoixData = "data";
var nomCommune = "";

MiseAjourIHM("4G");
MiseAjourIHM("national");
MiseAjourIHM("autoroutes");
activeBoutonCouverture();
activeBoutonCarteVoix();
activeBouton4G();
activeBoutonTransports();
activeBoutonNational();
activeBoutonQoSTransportsData();
activeBoutonAutoroutes();

if (!mapboxgl.supported()) {
  alert('Votre navigateur Internet ne permet pas d\'afficher cette page. Veuillez le mettre à jour.');
} else {
  mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhhbmVkZWJveXNzb24iLCJhIjoiY2lvN3A1eGQ4MDA3M3Z5a3AzNzQzMmJsZCJ9.u_6ia9oYkGwdRpjQ1R8_qg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/stephanedeboysson/cixuos482006j2slg51a945r8',
    center: [3, 46.5],
    zoom: 5,
    maxZoom: 15,
    minZoom: 5,
    maxBounds: [-12, 39, 18, 53],
    attributionControl: false,
  });
}

// disable map rotation
//map.dragRotate.disable();
//map.touchZoomRotate.disableRotation();
// Add geocoder
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  country: 'fr',
  types: 'place,locality,postcode,address',
});
geocoder.options.placeholder = "Rechercher votre adresse";
map.addControl(geocoder);
// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl());
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
// Add attributions
map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
// Add scale
map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: 'metric'
}));
map.on('load', function() {
  map.addSource('single-point', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": []
    }
  });
  map.addSource('3d-buildings', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v7'
  });
  map.addSource('Transports', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.bqq8lchg'
  });
  map.addSource('Sites', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.2oma6qi3'
  });

  map.addSource('BC_Orange', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.1itlprfq'
  });
  map.addSource('CL_Orange', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.ayv1e9ma'
  });
  map.addSource('TBC_Orange', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.byh030uw'
  });

  map.addSource('BC_Bouygues', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.d2cg6m3r'
  });
  map.addSource('CL_Bouygues', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.bja9et4r'
  });
  map.addSource('TBC_Bouygues', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.2ojpr35i'
  });

  map.addSource('BC_SFR', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.3ugfuhda'
  });
  map.addSource('CL_SFR', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.8qr2go6r'
  });
  map.addSource('TBC_SFR', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.55trxcxo'
  });

  map.addSource('BC_Free', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.2k878f8z'
  });
  map.addSource('CL_Free', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.871i0ezg'
  });
  map.addSource('TBC_Free', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.9f327gzv'
  });

  map.addSource('3G_Orange', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.5y8y2hfk'
  });
  map.addSource('4G_Orange', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.du0x0q43'
  });
  map.addSource('3G_Bouygues', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.dslt35a9'
  });
  map.addSource('4G_Bouygues', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.dz19onm7'
  });
  map.addSource('3G_SFR', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.678g6zc3'
  });
  map.addSource('4G_SFR', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.38ppw3l4'
  });
  map.addSource('3G_Free', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.4aq76l46'
  });
  map.addSource('3G_Free_bridee', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.9wlkaxfh'
  });
  map.addSource('4G_Free', {
    type: 'vector',
    url: 'mapbox://stephanedeboysson.77oejp8f'
  });

  map.addLayer({
    'id': '3d-buildings',
    'source': '3d-buildings',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#777',
      'fill-extrusion-height': {
        'type': 'identity',
        'property': 'height'
      },
      'fill-extrusion-base': {
        'type': 'identity',
        'property': 'min_height'
      },
      'fill-extrusion-opacity': .7
    }
  }, 'place_label_other');
  map.addLayer({
    "id": "point",
    "source": "single-point",
    "type": "circle",
    "paint": {
      "circle-radius": 10,
      "circle-color": "#4c4c4c"
    }
  });
  map.addLayer({
    "id": "Sites",
    "type": "symbol",
    "minzoom": 10,
    "source": "Sites",
    "source-layer": "2017-01_sites-58ec8q",
    "layout": {
      "icon-image": "triangle-15",
    },
    //"filter": ["==", "Operateur", 20801],
    //"filter": ["==", "Operateur", MCCMNCCouv],
  });



  map.addLayer({
    "id": "TBC_Orange",
    "type": "fill",
    "source": "TBC_Orange",
    "source-layer": "ORA_TBCgeojson",
    "paint": {
      "fill-color": '#d82424',
      'fill-opacity': 0.7,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "BC_Orange",
    "type": "fill",
    "source": "BC_Orange",
    "source-layer": "ORA_BCgeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.6,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "CL_Orange",
    "type": "fill",
    "source": "CL_Orange",
    "source-layer": "ORA_CLgeojson",
    "paint": {
      "fill-color": '#efa7a7',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "TBC_Bouygues",
    "type": "fill",
    "source": "TBC_Bouygues",
    "source-layer": "BYT_TBCgeojson",
    "paint": {
      "fill-color": '#d82424',
      'fill-opacity': 0.7,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "BC_Bouygues",
    "type": "fill",
    "source": "BC_Bouygues",
    "source-layer": "BYT_BCgeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.6,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "CL_Bouygues",
    "type": "fill",
    "source": "CL_Bouygues",
    "source-layer": "BYT_CLgeojson",
    "paint": {
      "fill-color": '#efa7a7',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "TBC_SFR",
    "type": "fill",
    "source": "TBC_SFR",
    "source-layer": "SFR_TBCgeojson",
    "paint": {
      "fill-color": '#d82424',
      'fill-opacity': 0.7,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "BC_SFR",
    "type": "fill",
    "source": "BC_SFR",
    "source-layer": "SFR_BCgeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.6,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "CL_SFR",
    "type": "fill",
    "source": "CL_SFR",
    "source-layer": "SFR_CLgeojson",
    "paint": {
      "fill-color": '#efa7a7',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "TBC_Free",
    "type": "fill",
    "source": "TBC_Free",
    "source-layer": "Free_TBCgeojson",
    "paint": {
      "fill-color": '#d82424',
      'fill-opacity': 0.7,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "BC_Free",
    "type": "fill",
    "source": "BC_Free",
    "source-layer": "Free_BCgeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.6,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "CL_Free",
    "type": "fill",
    "source": "CL_Free",
    "source-layer": "Free_CLgeojson",
    "paint": {
      "fill-color": '#efa7a7',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "3G_Orange",
    "type": "fill",
    "source": "3G_Orange",
    "source-layer": "ORA_3Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "4G_Orange",
    "type": "fill",
    "source": "4G_Orange",
    "source-layer": "ORA_4Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "3G_Bouygues",
    "type": "fill",
    "source": "3G_Bouygues",
    "source-layer": "BYT_3Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "4G_Bouygues",
    "type": "fill",
    "source": "4G_Bouygues",
    "source-layer": "BYT_4Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "3G_SFR",
    "type": "fill",
    "source": "3G_SFR",
    "source-layer": "SFR_3Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "4G_SFR",
    "type": "fill",
    "source": "4G_SFR",
    "source-layer": "SFR_4Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');
  map.addLayer({
    "id": "3G_Free",
    "type": "fill",
    "source": "3G_Free",
    "source-layer": "Free_3Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "3G_Free_bridee",
    "type": "fill",
    "source": "3G_Free_bridee",
    "source-layer": "Free_3G_bridegeojson",
    "paint": {
      "fill-color": '#efa7a7',
      'fill-opacity': 0.4,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "4G_Free",
    "type": "fill",
    "source": "4G_Free",
    "source-layer": "Free_4Ggeojson",
    "paint": {
      "fill-color": '#e36565',
      'fill-opacity': 0.5,
      "fill-outline-color": 'rgba(255, 255, 255, 0)',
    },
  }, 'place_label_other');

  map.addLayer({
    "id": "transports",
    "type": "circle",
    "source": "Transports",
    "source-layer": "QosTransports2016_-_V2",
    'paint': {
      'circle-radius': {
        'base': 2,
        'stops': [
          [4, 2.5],
          [12, 8]
        ],
      },
      "circle-blur": 1,
      'circle-color': {
        property: 'BILAN2-OD',
        type: 'categorical',
        stops: [
          ["ECHEC-HR", '#d82727'],
          ["2G", '#d82727'],
          ["3G", '#8AE300'],
          ["4G", '#3b913b']
        ]
      }
    },
    //"filter": ["all",["==", "STRATE", "AUTOROUTES"],["==", "MCC-MNC", 20801]],
    //"filter": ["all",["==", "STRATE", "AUTOROUTES"],["==", "MCC-MNC", MCCMNCCouv]],
  });

  map.setLayoutProperty('transports', 'visibility', 'none');
  map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
  map.setLayoutProperty('BC_Orange', 'visibility', 'none');
  map.setLayoutProperty('CL_Orange', 'visibility', 'none');
  map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
  map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
  map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
  map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
  map.setLayoutProperty('BC_SFR', 'visibility', 'none');
  map.setLayoutProperty('CL_SFR', 'visibility', 'none');
  map.setLayoutProperty('TBC_Free', 'visibility', 'none');
  map.setLayoutProperty('BC_Free', 'visibility', 'none');
  map.setLayoutProperty('CL_Free', 'visibility', 'none');
  map.setLayoutProperty('3G_Orange', 'visibility', 'none');
  map.setLayoutProperty('4G_Orange', 'visibility', 'none');
  map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
  map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
  map.setLayoutProperty('3G_SFR', 'visibility', 'none');
  map.setLayoutProperty('4G_SFR', 'visibility', 'none');
  map.setLayoutProperty('3G_Free', 'visibility', 'none');
  map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
  map.setLayoutProperty('4G_Free', 'visibility', 'none');
  randomOperateur();
});

map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point);
  if (!features.length) {
    return;
  }
  var feature = features[0];
  if (features[0].properties.TypeCouv == "TBC") {
    var popup = new mapboxgl.Popup().setLngLat(e.lngLat).setHTML("<span style='color:#d82424;'>Très bonne couverture</span>").addTo(map);
  }
  if (features[0].properties.TypeCouv == "BC") {
    var popup = new mapboxgl.Popup().setLngLat(e.lngLat).setHTML("<span style='color:#e36565;'>Bonne couverture</span>").addTo(map);
  }
  if (features[0].properties.TypeCouv == "CL") {
    var popup = new mapboxgl.Popup().setLngLat(e.lngLat).setHTML("<span style='color:#efa7a7;'>Couverture limitée</span>").addTo(map);
  }
});
map.on('dblclick', function(e) {
  var z = map.getZoom()
  var features = map.queryRenderedFeatures(e.point);
  if (features[0].layer.id == "water_pattern") {
    var img = $('<img>');
    img.attr('src', "http://i.imgur.com/GRsnzIk.gif");
    var x = e.originalEvent.clientX || e.point.x;
    var y = e.originalEvent.clientY || e.point.y;
    img.attr('style', "position:absolute;top:" + (y - 50) + "px;left:" + (x - 50) + "px;width: 140px;");
    img.appendTo('body');
    setTimeout(function() {
      img.remove();
    }, 2700);
    map.setZoom(z)
  }
});
// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});
map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['Sites']
  });
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  if (!features.length) {
    popup.remove();
    return;
  }
  var feature = features[0];
  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML(getIconeOperateur() + "<br>Emetteur " + getTechnosInstalleesSite(feature.properties.C4G, feature.properties.C3G, feature.properties.C2G))
    .addTo(map);
});
geocoder.on('result', function(ev) {
  map.getSource('single-point').setData(ev.result.geometry);
});

document.getElementById("SelectAutoroutes").onchange = function() {
  MiseAjourIHM(strateTransports);
  setTransportsFilter();
};
document.getElementById("SelectTGV").onchange = function() {
  MiseAjourIHM(strateTransports);
  setTransportsFilter();
};
document.getElementById("SelectTET").onchange = function() {
  MiseAjourIHM(strateTransports);
  setTransportsFilter();
};
document.getElementById("SelectTDQ").onchange = function() {
  MiseAjourIHM(strateTransports);
  setTransportsFilter();
};
document.getElementById("SelectMetro").onchange = function() {
  MiseAjourIHM(strateTransports);
  setTransportsFilter();
};

function convertirStrateEnTexte(strate) {
  if (strate == "dense") {
    return "dense";
  }
  if (strate == "intermediaire") {
    return "intermédiaire";
  }
  if (strate == "rural") {
    return "rurale";
  }
};

function randomOperateur() {
  var randOp = Math.floor(Math.random() * 4);
  if (randOp == 0) {
    MCCMNCCouv = 20801;
    MCCMNC = 20801;
    miseAJourCheckboxOrangeAgglos();
    miseAJourCheckboxOrangeTrans();
  }
  if (randOp == 1) {
    MCCMNCCouv = 20810;
    MCCMNC = 20810;
    miseAJourCheckboxSFRAgglos();
    miseAJourCheckboxSFRTrans();
  }
  if (randOp == 2) {
    MCCMNCCouv = 20815;
    MCCMNC = 20815;
    miseAJourCheckboxFreeAgglos();
    miseAJourCheckboxFreeTrans();
  }
  if (randOp == 3) {
    MCCMNCCouv = 20820;
    MCCMNC = 20820;
    miseAJourCheckboxBouyguesAgglos();
    miseAJourCheckboxBouyguesTrans();
  }
};

function afficherCouches() {
  if ((couvertureQos == "couverture" && couvertureQosAvant == "QoS") || (MCCMNCCouv != MCCMNCCouvAvant) || (carteCouverture != carteCouvertureAvant) || (technoCarteCouverture != technoCarteCouvertureAvant)) {
    map.setLayoutProperty('Sites', 'visibility', 'visible');
    if (carteCouverture == "voix") {
      if (MCCMNCCouv == 20801) {
        map.setLayoutProperty('TBC_Orange', 'visibility', 'visible');
        map.setLayoutProperty('BC_Orange', 'visibility', 'visible');
        map.setLayoutProperty('CL_Orange', 'visibility', 'visible');
        map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
        map.setLayoutProperty('BC_SFR', 'visibility', 'none');
        map.setLayoutProperty('CL_SFR', 'visibility', 'none');
        map.setLayoutProperty('TBC_Free', 'visibility', 'none');
        map.setLayoutProperty('BC_Free', 'visibility', 'none');
        map.setLayoutProperty('CL_Free', 'visibility', 'none');
      }
      if (MCCMNCCouv == 20810) {
        map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
        map.setLayoutProperty('BC_Orange', 'visibility', 'none');
        map.setLayoutProperty('CL_Orange', 'visibility', 'none');
        map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('TBC_SFR', 'visibility', 'visible');
        map.setLayoutProperty('BC_SFR', 'visibility', 'visible');
        map.setLayoutProperty('CL_SFR', 'visibility', 'visible');
        map.setLayoutProperty('TBC_Free', 'visibility', 'none');
        map.setLayoutProperty('BC_Free', 'visibility', 'none');
        map.setLayoutProperty('CL_Free', 'visibility', 'none');
      }
      if (MCCMNCCouv == 20815) {
        map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
        map.setLayoutProperty('BC_Orange', 'visibility', 'none');
        map.setLayoutProperty('CL_Orange', 'visibility', 'none');

        map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
        map.setLayoutProperty('BC_SFR', 'visibility', 'none');
        map.setLayoutProperty('CL_SFR', 'visibility', 'none');
        map.setLayoutProperty('TBC_Free', 'visibility', 'visible');
        map.setLayoutProperty('BC_Free', 'visibility', 'visible');
        map.setLayoutProperty('CL_Free', 'visibility', 'visible');
      }
      if (MCCMNCCouv == 20820) {
        map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
        map.setLayoutProperty('BC_Orange', 'visibility', 'none');
        map.setLayoutProperty('CL_Orange', 'visibility', 'none');

        map.setLayoutProperty('TBC_Bouygues', 'visibility', 'visible');
        map.setLayoutProperty('BC_Bouygues', 'visibility', 'visible');
        map.setLayoutProperty('CL_Bouygues', 'visibility', 'visible');
        map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
        map.setLayoutProperty('BC_SFR', 'visibility', 'none');
        map.setLayoutProperty('CL_SFR', 'visibility', 'none');
        map.setLayoutProperty('TBC_Free', 'visibility', 'none');
        map.setLayoutProperty('BC_Free', 'visibility', 'none');
        map.setLayoutProperty('CL_Free', 'visibility', 'none');
      }
      map.setLayoutProperty('3G_Orange', 'visibility', 'none');
      map.setLayoutProperty('4G_Orange', 'visibility', 'none');
      map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
      map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
      map.setLayoutProperty('3G_SFR', 'visibility', 'none');
      map.setLayoutProperty('4G_SFR', 'visibility', 'none');
      map.setLayoutProperty('3G_Free', 'visibility', 'none');
      map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
      map.setLayoutProperty('4G_Free', 'visibility', 'none');
    }
    if (carteCouverture == "data") {
      map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
      map.setLayoutProperty('BC_Orange', 'visibility', 'none');
      map.setLayoutProperty('CL_Orange', 'visibility', 'none');

      map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
      map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
      map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
      map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
      map.setLayoutProperty('BC_SFR', 'visibility', 'none');
      map.setLayoutProperty('CL_SFR', 'visibility', 'none');
      map.setLayoutProperty('TBC_Free', 'visibility', 'none');
      map.setLayoutProperty('BC_Free', 'visibility', 'none');
      map.setLayoutProperty('CL_Free', 'visibility', 'none');
      map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
      map.setLayoutProperty('BC_SFR', 'visibility', 'none');
      map.setLayoutProperty('CL_SFR', 'visibility', 'none');
      if (MCCMNCCouv == 20801) {
        if (technoCarteCouverture == "3G") {
          map.setLayoutProperty('3G_Orange', 'visibility', 'visible');
          map.setLayoutProperty('4G_Orange', 'visibility', 'none');
        }
        if (technoCarteCouverture == "4G") {
          map.setLayoutProperty('3G_Orange', 'visibility', 'none');
          map.setLayoutProperty('4G_Orange', 'visibility', 'visible');
        }
        map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('3G_SFR', 'visibility', 'none');
        map.setLayoutProperty('4G_SFR', 'visibility', 'none');
        map.setLayoutProperty('3G_Free', 'visibility', 'none');
        map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
        map.setLayoutProperty('4G_Free', 'visibility', 'none');
      }
      if (MCCMNCCouv == 20810) {
        map.setLayoutProperty('3G_Orange', 'visibility', 'none');
        map.setLayoutProperty('4G_Orange', 'visibility', 'none');
        map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
        if (technoCarteCouverture == "3G") {
          map.setLayoutProperty('3G_SFR', 'visibility', 'visible');
          map.setLayoutProperty('4G_SFR', 'visibility', 'none');
        }
        if (technoCarteCouverture == "4G") {
          map.setLayoutProperty('3G_SFR', 'visibility', 'none');
          map.setLayoutProperty('4G_SFR', 'visibility', 'visible');
        }
        map.setLayoutProperty('3G_Free', 'visibility', 'none');
        map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
        map.setLayoutProperty('4G_Free', 'visibility', 'none');
      }
      if (MCCMNCCouv == 20815) {
        map.setLayoutProperty('3G_Orange', 'visibility', 'none');
        map.setLayoutProperty('4G_Orange', 'visibility', 'none');
        if (technoCarteCouverture == "3G") {
          map.setLayoutProperty('3G_Free', 'visibility', 'visible');
          map.setLayoutProperty('3G_Free_bridee', 'visibility', 'visible');
          map.setLayoutProperty('4G_Free', 'visibility', 'none');
        }
        if (technoCarteCouverture == "4G") {
          map.setLayoutProperty('3G_Free', 'visibility', 'none');
          map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
          map.setLayoutProperty('4G_Free', 'visibility', 'visible');
        }
        map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
        map.setLayoutProperty('3G_SFR', 'visibility', 'none');
        map.setLayoutProperty('4G_SFR', 'visibility', 'none');
      }
      if (MCCMNCCouv == 20820) {
        map.setLayoutProperty('3G_Orange', 'visibility', 'none');
        map.setLayoutProperty('4G_Orange', 'visibility', 'none');
        if (technoCarteCouverture == "3G") {
          map.setLayoutProperty('3G_Bouygues', 'visibility', 'visible');
          map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
        }
        if (technoCarteCouverture == "4G") {
          map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
          map.setLayoutProperty('4G_Bouygues', 'visibility', 'visible');
        }
        map.setLayoutProperty('3G_SFR', 'visibility', 'none');
        map.setLayoutProperty('4G_SFR', 'visibility', 'none');
        map.setLayoutProperty('3G_Free', 'visibility', 'none');
        map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
        map.setLayoutProperty('4G_Free', 'visibility', 'none');
      }
    }
    map.setLayoutProperty('transports', 'visibility', 'none');
  }
  if (couvertureQos == "QoS" && agglosTransports == "agglos" && (agglosTransportsAvant == "transports" || couvertureQosAvant == "couverture")) {
    map.setLayoutProperty('Sites', 'visibility', 'none');
    map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
    map.setLayoutProperty('BC_Orange', 'visibility', 'none');
    map.setLayoutProperty('CL_Orange', 'visibility', 'none');

    map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
    map.setLayoutProperty('BC_SFR', 'visibility', 'none');
    map.setLayoutProperty('CL_SFR', 'visibility', 'none');
    map.setLayoutProperty('TBC_Free', 'visibility', 'none');
    map.setLayoutProperty('BC_Free', 'visibility', 'none');
    map.setLayoutProperty('CL_Free', 'visibility', 'none');
    map.setLayoutProperty('transports', 'visibility', 'none');
    map.setLayoutProperty('3G_Orange', 'visibility', 'none');
    map.setLayoutProperty('4G_Orange', 'visibility', 'none');
    map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('3G_SFR', 'visibility', 'none');
    map.setLayoutProperty('4G_SFR', 'visibility', 'none');
    map.setLayoutProperty('3G_Free', 'visibility', 'none');
    map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
    map.setLayoutProperty('4G_Free', 'visibility', 'none');
  }
  if ((couvertureQos == "QoS" && agglosTransports == "transports" && (agglosTransportsAvant == "agglos" || couvertureQosAvant == "couverture") || transportsVoixDataAvant != transportsVoixData)) {
    map.setLayoutProperty('Sites', 'visibility', 'none');
    map.setLayoutProperty('TBC_Orange', 'visibility', 'none');
    map.setLayoutProperty('BC_Orange', 'visibility', 'none');
    map.setLayoutProperty('CL_Orange', 'visibility', 'none');

    map.setLayoutProperty('TBC_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('BC_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('CL_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('TBC_SFR', 'visibility', 'none');
    map.setLayoutProperty('BC_SFR', 'visibility', 'none');
    map.setLayoutProperty('CL_SFR', 'visibility', 'none');
    map.setLayoutProperty('TBC_Free', 'visibility', 'none');
    map.setLayoutProperty('BC_Free', 'visibility', 'none');
    map.setLayoutProperty('CL_Free', 'visibility', 'none');
    map.setLayoutProperty('transports', 'visibility', 'none');
    map.setLayoutProperty('3G_Orange', 'visibility', 'none');
    map.setLayoutProperty('4G_Orange', 'visibility', 'none');
    map.setLayoutProperty('3G_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('4G_Bouygues', 'visibility', 'none');
    map.setLayoutProperty('3G_SFR', 'visibility', 'none');
    map.setLayoutProperty('4G_SFR', 'visibility', 'none');
    map.setLayoutProperty('3G_Free', 'visibility', 'none');
    map.setLayoutProperty('3G_Free_bridee', 'visibility', 'none');
    map.setLayoutProperty('4G_Free', 'visibility', 'none');
    if (transportsVoixData == "data") {
      map.setLayoutProperty('transports', 'visibility', 'visible');
    }
    if (transportsVoixData == "voix") {
      map.setLayoutProperty('transports', 'visibility', 'none');
    }
  }
  carteCouvertureAvant = carteCouverture;
  technoCarteCouvertureAvant = technoCarteCouverture;
  couvertureQosAvant = couvertureQos;
  agglosTransportsAvant = agglosTransports;
  transportsVoixDataAvant = transportsVoixData;
  MCCMNCCouvAvant = MCCMNCCouv;
};

function activeBoutonCouverture() {
  $(boutonQoS).removeClass('active');
  $(boutonCouverture).addClass('active');
  $(selectLightQoS).removeClass('active');
  $(selectLightCouverture).addClass('active');
};

function activeBoutonQoS() {
  $(boutonQoS).addClass('active');
  $(boutonCouverture).removeClass('active');
  $(selectLightQoS).addClass('active');
  $(selectLightCouverture).removeClass('active');
};

function activeBoutonAgglos() {
  $(boutonAgglos).addClass('active');
  $(boutonTransports).removeClass('active');
  $(selectLightAgglos).addClass('active');
  $(selectLightTransports).removeClass('active');
};

function activeBoutonTransports() {
  $(boutonAgglos).removeClass('active');
  $(boutonTransports).addClass('active');
  $(selectLightAgglos).removeClass('active');
  $(selectLightTransports).addClass('active');
};

function activeBoutonQoSTransportsVoixSMS() {
  $(boutonQoSTransportsVoixSMS).addClass('active');
  $(boutonQoSTransportsData).removeClass('active');
  $(selectLightQoSTransportsVoixSMS).addClass('active');
  $(selectLightQoSTransportsData).removeClass('active');
};

function activeBoutonQoSTransportsData() {
  $(boutonQoSTransportsVoixSMS).removeClass('active');
  $(boutonQoSTransportsData).addClass('active');
  $(selectLightQoSTransportsVoixSMS).removeClass('active');
  $(selectLightQoSTransportsData).addClass('active');
};

function activeBoutonCarteVoix() {
  $(boutonCarteVoix).addClass('active');
  $(boutonCarteData).removeClass('active');
  $(selectLightCarteVoix).addClass('active');
  $(selectLightCarteData).removeClass('active');
};

function activeBoutonCarteData() {
  $(boutonCarteVoix).removeClass('active');
  $(boutonCarteData).addClass('active');
  $(selectLightCarteVoix).removeClass('active');
  $(selectLightCarteData).addClass('active');
};

function activeBouton3G() {
  $(bouton3G).addClass('active');
  $(bouton4G).removeClass('active');
  $(selectLight3G).addClass('active');
  $(selectLight4G).removeClass('active');
};

function activeBouton4G() {
  $(bouton3G).removeClass('active');
  $(bouton4G).addClass('active');
  $(selectLight3G).removeClass('active');
  $(selectLight4G).addClass('active');
};

function activeBoutonNational() {
  $(boutonNational).addClass('active');
  $(boutonRural).removeClass('active');
  $(boutonIntermediaire).removeClass('active');
  $(boutonDense).removeClass('active');
  $(selectLightNational).addClass('active');
  $(selectLightRural).removeClass('active');
  $(selectLightIntermediaire).removeClass('active');
  $(selectLightDense).removeClass('active');
};

function activeBoutonRural() {
  $(boutonNational).removeClass('active');
  $(boutonRural).addClass('active');
  $(boutonIntermediaire).removeClass('active');
  $(boutonDense).removeClass('active');
  $(selectLightNational).removeClass('active');
  $(selectLightRural).addClass('active');
  $(selectLightIntermediaire).removeClass('active');
  $(selectLightDense).removeClass('active');
};

function activeBoutonIntermediaire() {
  $(boutonNational).removeClass('active');
  $(boutonRural).removeClass('active');
  $(boutonIntermediaire).addClass('active');
  $(boutonDense).removeClass('active');
  $(selectLightNational).removeClass('active');
  $(selectLightRural).removeClass('active');
  $(selectLightIntermediaire).addClass('active');
  $(selectLightDense).removeClass('active');
};

function activeBoutonDense() {
  $(boutonNational).removeClass('active');
  $(boutonRural).removeClass('active');
  $(boutonIntermediaire).removeClass('active');
  $(boutonDense).addClass('active');
  $(selectLightNational).removeClass('active');
  $(selectLightRural).removeClass('active');
  $(selectLightIntermediaire).removeClass('active');
  $(selectLightDense).addClass('active');
};

function activeBoutonAutoroutes() {
  $(boutonAutoroutes).addClass('active');
  $(boutonTGV).removeClass('active');
  $(boutonTET).removeClass('active');
  $(boutonTDQ).removeClass('active');
  $(boutonMetro).removeClass('active');
  $(selectLightAutoroutes).addClass('active');
  $(selectLightTGV).removeClass('active');
  $(selectLightTET).removeClass('active');
  $(selectLightTDQ).removeClass('active');
  $(selectLightMetro).removeClass('active');
};

function activeBoutonTGV() {
  $(boutonAutoroutes).removeClass('active');
  $(boutonTGV).addClass('active');
  $(boutonTET).removeClass('active');
  $(boutonTDQ).removeClass('active');
  $(boutonMetro).removeClass('active');
  $(selectLightAutoroutes).removeClass('active');
  $(selectLightTGV).addClass('active');
  $(selectLightTET).removeClass('active');
  $(selectLightTDQ).removeClass('active');
  $(selectLightMetro).removeClass('active');
};

function activeBoutonTET() {
  $(boutonAutoroutes).removeClass('active');
  $(boutonTGV).removeClass('active');
  $(boutonTET).addClass('active');
  $(boutonTDQ).removeClass('active');
  $(boutonMetro).removeClass('active');
  $(selectLightAutoroutes).removeClass('active');
  $(selectLightTGV).removeClass('active');
  $(selectLightTET).addClass('active');
  $(selectLightTDQ).removeClass('active');
  $(selectLightMetro).removeClass('active');
};

function activeBoutonTDQ() {
  $(boutonAutoroutes).removeClass('active');
  $(boutonTGV).removeClass('active');
  $(boutonTET).removeClass('active');
  $(boutonTDQ).addClass('active');
  $(boutonMetro).removeClass('active');
  $(selectLightAutoroutes).removeClass('active');
  $(selectLightTGV).removeClass('active');
  $(selectLightTET).removeClass('active');
  $(selectLightTDQ).addClass('active');
  $(selectLightMetro).removeClass('active');
};

function activeBoutonMetro() {
  $(boutonAutoroutes).removeClass('active');
  $(boutonTGV).removeClass('active');
  $(boutonTET).removeClass('active');
  $(boutonTDQ).removeClass('active');
  $(boutonMetro).addClass('active');
  $(selectLightAutoroutes).removeClass('active');
  $(selectLightTGV).removeClass('active');
  $(selectLightTET).removeClass('active');
  $(selectLightTDQ).removeClass('active');
  $(selectLightMetro).addClass('active');
};

$("#boutonCouverture").click(function() {
  if (couvertureQosAvant != "couverture") {
    activeBoutonCouverture();
    couvertureQos = "couverture";
    afficherCouches();
    document.getElementById('containerboutonAggloTransports').style.display = 'none';
    document.getElementById('ZoneGraphiquesCouv').style.display = 'block';
    document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
    document.getElementById('ZoneGraphiquesTransports').style.display = 'none';
    if (carteCouverture == "voix") {
      document.getElementById('EnteteLegendeAgglos').style.display = 'block';
      if (!PopupInfosLegendeCouvVoixEstFerme && window.innerWidth > 910) {
        document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'block';
      }
      document.getElementById('EnteteLegendeCouvData').style.display = 'none';
      document.getElementById('infoCouvVoix').style.display = 'block';
      document.getElementById('infoCouvData').style.display = 'none';
    }
    if (carteCouverture == "data") {
      document.getElementById('EnteteLegendeAgglos').style.display = 'none';
      if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910 && technoCarteCouverture == "3G") {
        if (MCCMNCCouv == 20815) {
          document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
        } else {
          document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
        }
      }
      if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910 && technoCarteCouverture == "4G") {
        document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
      }
      document.getElementById('EnteteLegendeCouvData').style.display = 'block';
      document.getElementById('infoCouvVoix').style.display = 'none';
      document.getElementById('infoCouvData').style.display = 'block';
    }
    document.getElementById('legendeAgglos').style.display = 'block';
    document.getElementById('EnteteLegendeTransports').style.display = 'none';
    document.getElementById('legendeTransports').style.display = 'none';
    document.getElementById('infoQoS').style.display = 'none';
    document.getElementById('masquerMap').style.display = 'none';
  }
});
$("#boutonQoS").click(function() {
  if (couvertureQosAvant != "QoS") {
    activeBoutonQoS();
    couvertureQos = "QoS";
    afficherCouches();
    if (agglosTransports == "agglos" || (agglosTransports == "transports" && transportsVoixData == "voix")) {
      document.getElementById('masquerMap').style.display = 'block';
      document.getElementById('EnteteLegendeTransports').style.display = 'none';
      document.getElementById('legendeTransports').style.display = 'none';
    }
    if (agglosTransports == "transports" && transportsVoixData == "data") {
      document.getElementById('masquerMap').style.display = 'none';
      document.getElementById('EnteteLegendeTransports').style.display = 'block';
      document.getElementById('legendeTransports').style.display = 'block';
    }
    document.getElementById('containerboutonAggloTransports').style.display = 'block';
    document.getElementById('ZoneGraphiquesCouv').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'none';
    if (agglosTransports == "agglos") {
      document.getElementById('ZoneGraphiquesQoS').style.display = 'block';
      document.getElementById('ZoneGraphiquesTransports').style.display = 'none';
    }
    if (agglosTransports == "transports") {
      document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
      document.getElementById('ZoneGraphiquesTransports').style.display = 'block';
    }
    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('EnteteLegendeCouvData').style.display = 'none';
    document.getElementById('legendeAgglos').style.display = 'none';
    document.getElementById('infoCouvVoix').style.display = 'none';
    document.getElementById('infoCouvData').style.display = 'none';
    document.getElementById('infoQoS').style.display = 'block';
  }
});
$("#boutonAgglos").click(function() {
  if (agglosTransportsAvant != "agglos") {
    activeBoutonAgglos();
    agglosTransports = "agglos";
    afficherCouches();
    document.getElementById('ZoneGraphiquesQoS').style.display = 'block';
    document.getElementById('ZoneGraphiquesTransports').style.display = 'none';
    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('legendeAgglos').style.display = 'none';
    document.getElementById('EnteteLegendeTransports').style.display = 'none';
    document.getElementById('legendeTransports').style.display = 'none';
    document.getElementById('masquerMap').style.display = 'block';
  }
});
$("#boutonTransports").click(function() {
  if (agglosTransportsAvant != "transports") {
    activeBoutonTransports();
    agglosTransports = "transports";
    afficherCouches();
    document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
    document.getElementById('ZoneGraphiquesTransports').style.display = 'block';
    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('legendeAgglos').style.display = 'none';
    if (transportsVoixData == "data") {
      document.getElementById('masquerMap').style.display = 'none';
      document.getElementById('EnteteLegendeTransports').style.display = 'block';
      document.getElementById('legendeTransports').style.display = 'block';
    } else {
      document.getElementById('masquerMap').style.display = 'block';
      document.getElementById('EnteteLegendeTransports').style.display = 'none';
      document.getElementById('legendeTransports').style.display = 'none';
    }
  }
});
$("#boutonQoSTransportsVoixSMS").click(function() {
  activeBoutonQoSTransportsVoixSMS();
  transportsVoixData = "voix";
  afficherCouches();
  document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
  document.getElementById('ZoneGraphiquesTransportsVoixSMS').style.display = 'block';
  document.getElementById('ZoneGraphiquesTransportsData').style.display = 'none';
  document.getElementById('EnteteLegendeTransports').style.display = 'none';
  document.getElementById('legendeTransports').style.display = 'none';
  document.getElementById('masquerMap').style.display = 'block';
});
$("#boutonQoSTransportsData").click(function() {
  activeBoutonQoSTransportsData();
  transportsVoixData = "data";
  afficherCouches();
  document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
  document.getElementById('ZoneGraphiquesTransportsVoixSMS').style.display = 'none';
  document.getElementById('ZoneGraphiquesTransportsData').style.display = 'block';
  document.getElementById('EnteteLegendeTransports').style.display = 'block';
  document.getElementById('legendeTransports').style.display = 'block';
  document.getElementById('masquerMap').style.display = 'none';
});
$("#popupBoutonFermerBienvenue").click(function() {
  document.getElementById('PopupBienvenue').style.display = 'none';
  document.getElementById('logoPopupBienvenue').style.display = 'none';
});
$("#BoutonFermerPopupInfosCouvVoix").click(function() {
  document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
  PopupInfosLegendeCouvVoixEstFerme = 1;
});
$("#BoutonFermerPopupInfosCouvData3G").click(function() {
  document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
  PopupsInfosLegendeCouvDataSontFermes = 1;
});
$("#BoutonFermerPopupInfosCouvData3GFree").click(function() {
  document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
  PopupsInfosLegendeCouvDataSontFermes = 1;
});
$("#BoutonFermerPopupInfosCouvData4G").click(function() {
  document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'none';
  PopupsInfosLegendeCouvDataSontFermes = 1;
});
$("#BoutonFermerPopupInfosInfosComplementairesCouverture").click(function() {
  document.getElementById('PopupInfosInfosComplementairesCouverture').style.display = 'none';
});
$("#clicEnSavoirPlusCouv1").click(function() {
  document.getElementById('PopupInfosInfosComplementairesCouverture').style.display = 'block';
});
$("#clicEnSavoirPlusCouv2").click(function() {
  document.getElementById('PopupInfosInfosComplementairesCouverture').style.display = 'block';
});
$("#clicEnSavoirPlusCouv3").click(function() {
  document.getElementById('PopupInfosInfosComplementairesCouverture').style.display = 'block';
});
$("#clicEnSavoirPlusCouv4").click(function() {
  document.getElementById('PopupInfosInfosComplementairesCouverture').style.display = 'block';
});
$("#boutonCarteVoix").click(function() {
  if (carteCouvertureAvant != "voix") {
    activeBoutonCarteVoix();
    carteCouverture = "voix";
    afficherCouches();

    document.getElementById('ZoneGraphiquesCouvVoix').style.display = 'block';
    document.getElementById('ZoneGraphiquesCouvData').style.display = 'none';
    document.getElementById('blocLegendeCouvVoix').style.display = 'block';
    document.getElementById('blocLegendeCouvData').style.display = 'none';
    document.getElementById('EnteteLegendeAgglos').style.display = 'block';
    document.getElementById('EnteteLegendeCouvData').style.display = 'none';
    if (!PopupInfosLegendeCouvVoixEstFerme && window.innerWidth > 910) {
      document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'block';
    }
    document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'none';
    document.getElementById('infoCouvVoix').style.display = 'block';
    document.getElementById('infoCouvData').style.display = 'none';
    document.getElementById('bouton3G').style.display = 'none';
    document.getElementById('bouton4G').style.display = 'none';
  }
});
$("#boutonCarteData").click(function() {
  if (carteCouvertureAvant != "data") {
    activeBoutonCarteData();
    carteCouverture = "data";
    afficherCouches();
    document.getElementById('ZoneGraphiquesCouvVoix').style.display = 'none';
    document.getElementById('ZoneGraphiquesCouvData').style.display = 'block';
    document.getElementById('blocLegendeCouvVoix').style.display = 'none';
    document.getElementById('blocLegendeCouvData').style.display = 'block';
    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('EnteteLegendeCouvData').style.display = 'block';
    document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
    if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910 && technoCarteCouverture == "3G") {
      if (MCCMNCCouv == 20815) {
        document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
      } else {
        document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
      }
    }
    if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910 && technoCarteCouverture == "4G") {
      document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
    }
    document.getElementById('infoCouvVoix').style.display = 'none';
    document.getElementById('infoCouvData').style.display = 'block';
    document.getElementById('bouton3G').style.display = 'block';
    document.getElementById('bouton4G').style.display = 'block';
  }
});
$("#bouton3G").click(function() {
  activeBouton3G();
  technoCarteCouverture = "3G";
  document.getElementById('boutonInfosCouvData3G').style.display = 'block';
  document.getElementById('boutonInfosCouvData4G').style.display = 'none';
  document.getElementById('blocLegendeData3G_Old').style.display = 'none';
  document.getElementById('blocLegendeData3G').style.display = 'block';
  document.getElementById('blocLegendeData4G').style.display = 'none';
  document.getElementById('GraphiqueCouvPopulation3G').style.display = 'block';
  document.getElementById('GraphiqueCouvSurface3G').style.display = 'block';
  document.getElementById('GraphiqueCouvPopulation4G').style.display = 'none';
  document.getElementById('GraphiqueCouvSurface4G').style.display = 'none';
  document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
  if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910) {
    if (MCCMNCCouv == 20815) {
      document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
    } else {
      document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
    }
  }
  document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'none';
  afficherCouches();
});
$("#bouton4G").click(function() {
  activeBouton4G();
  technoCarteCouverture = "4G";
  document.getElementById('boutonInfosCouvData3G').style.display = 'none';
  document.getElementById('boutonInfosCouvData4G').style.display = 'block';
  document.getElementById('blocLegendeData3G').style.display = 'none';
  document.getElementById('blocLegendeData3G_Old').style.display = 'none';
  document.getElementById('blocLegendeData4G').style.display = 'block';
  document.getElementById('GraphiqueCouvPopulation3G').style.display = 'none';
  document.getElementById('GraphiqueCouvSurface3G').style.display = 'none';
  document.getElementById('GraphiqueCouvPopulation4G').style.display = 'block';
  document.getElementById('GraphiqueCouvSurface4G').style.display = 'block';
  document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
  document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
  document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
  if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910) {
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
  }
  afficherCouches();
});
$("#boutonNational").click(function() {
  activeBoutonNational();
  strate = "national";
  MiseAjourIHM(strate);
});
$("#boutonRural").click(function() {
  activeBoutonRural();
  strate = "rural";
  MiseAjourIHM(strate);
});
$("#boutonIntermediaire").click(function() {
  activeBoutonIntermediaire()
  strate = "intermediaire";
  MiseAjourIHM(strate);
});
$("#boutonDense").click(function() {
  activeBoutonDense()
  strate = "dense";
  MiseAjourIHM(strate);
});
$("#boutonAutoroutes").click(function() {
  activeBoutonAutoroutes();
  strateTransports = "autoroutes";
  MiseAjourIHM(strateTransports);
  MiseAjourCheckboxOperateursMetro();
  document.getElementById('SelectAutoroutes').style.display = 'block';
  document.getElementById('SelectTGV').style.display = 'none';
  document.getElementById('SelectTET').style.display = 'none';
  document.getElementById('SelectTDQ').style.display = 'none';
  document.getElementById('SelectMetro').style.display = 'none';
  setTransportsFilter();
});
$("#boutonTGV").click(function() {
  activeBoutonTGV();
  strateTransports = "tgv";
  MiseAjourIHM(strateTransports);
  MiseAjourCheckboxOperateursMetro();
  document.getElementById('SelectAutoroutes').style.display = 'none';
  document.getElementById('SelectTGV').style.display = 'block';
  document.getElementById('SelectTET').style.display = 'none';
  document.getElementById('SelectTDQ').style.display = 'none';
  document.getElementById('SelectMetro').style.display = 'none';
  setTransportsFilter();
});
$("#boutonTET").click(function() {
  activeBoutonTET();
  strateTransports = "tet";
  MiseAjourIHM(strateTransports);
  MiseAjourCheckboxOperateursMetro();
  document.getElementById('SelectAutoroutes').style.display = 'none';
  document.getElementById('SelectTGV').style.display = 'none';
  document.getElementById('SelectTET').style.display = 'block';
  document.getElementById('SelectTDQ').style.display = 'none';
  document.getElementById('SelectMetro').style.display = 'none';
  setTransportsFilter();
});
$("#boutonTDQ").click(function() {
  activeBoutonTDQ();
  strateTransports = "tdq";
  MiseAjourIHM(strateTransports);
  MiseAjourCheckboxOperateursMetro();
  document.getElementById('SelectAutoroutes').style.display = 'none';
  document.getElementById('SelectTGV').style.display = 'none';
  document.getElementById('SelectTET').style.display = 'none';
  document.getElementById('SelectTDQ').style.display = 'block';
  document.getElementById('SelectMetro').style.display = 'none';
  setTransportsFilter();
});
$("#boutonMetro").click(function() {
  activeBoutonMetro();
  strateTransports = "metro";
  MiseAjourIHM(strateTransports);
  MiseAjourCheckboxOperateursMetro();
  document.getElementById('SelectAutoroutes').style.display = 'none';
  document.getElementById('SelectTGV').style.display = 'none';
  document.getElementById('SelectTET').style.display = 'none';
  document.getElementById('SelectTDQ').style.display = 'none';
  document.getElementById('SelectMetro').style.display = 'block';
  setTransportsFilter();
});
$("#boutonInfosCouvVoix").click(function() {
  document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'block';
});
$("#boutonInfosCouvData3G").click(function() {
  if (MCCMNCCouv == 20815) {
    document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
  } else {
    document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
  }
  PopupsInfosLegendeCouvDataSontFermes = 0;
});
$("#boutonInfosCouvData4G").click(function() {
  document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
  PopupsInfosLegendeCouvDataSontFermes = 0;
});

function MiseAjourCheckboxOperateursMetro() {
  if (strateTransports == 'metro') {
    document.getElementById("checkboxOrange").checked = true;
    document.getElementById("checkboxBouygues").checked = true;
    document.getElementById("checkboxSFR").checked = true;
    document.getElementById("checkboxFree").checked = true;
    document.getElementById("checkboxOrange").disabled = true;
    document.getElementById("checkboxBouygues").disabled = true;
    document.getElementById("checkboxSFR").disabled = true;
    document.getElementById("checkboxFree").disabled = true;
  } else {
    document.getElementById("checkboxOrange").checked = false;
    document.getElementById("checkboxBouygues").checked = false;
    document.getElementById("checkboxSFR").checked = false;
    document.getElementById("checkboxFree").checked = false;
    document.getElementById("checkboxOrange").disabled = false;
    document.getElementById("checkboxBouygues").disabled = false;
    document.getElementById("checkboxSFR").disabled = false;
    document.getElementById("checkboxFree").disabled = false;
    /*if(MCCMNC == 20801){document.getElementById("checkboxOrange").checked = true;}
    if(MCCMNC == 20820){document.getElementById("checkboxBouygues").checked = true;}
    if(MCCMNC == 20810){document.getElementById("checkboxSFR").checked = true;}
    if(MCCMNC == 20815){document.getElementById("checkboxFree").checked = true;}*/
    if (MCCMNCCouv == 20801) {
      document.getElementById("checkboxOrange").checked = true;
    }
    if (MCCMNCCouv == 20820) {
      document.getElementById("checkboxBouygues").checked = true;
    }
    if (MCCMNCCouv == 20810) {
      document.getElementById("checkboxSFR").checked = true;
    }
    if (MCCMNCCouv == 20815) {
      document.getElementById("checkboxFree").checked = true;
    }
  }
};

function setTransportsFilter() {
  if (sousStrateTransports == "toutesAutoroutes" || sousStrateTransports == "tousTGV" || sousStrateTransports == "tousTDQ" || sousStrateTransports == "tousTET" || sousStrateTransports == "tousMetros") {
    if (strateTransports != 'metro') {
      //map.setFilter("transports", ["all",["==", "STRATE", strateTransports.toUpperCase()],["==", "MCC-MNC", MCCMNC]]);
      map.setFilter("transports", ["all", ["==", "STRATE", strateTransports.toUpperCase()],
        ["==", "MCC-MNC", MCCMNCCouv]
      ]);
    } else {
      map.setFilter("transports", ["all", ["==", "STRATE", strateTransports.toUpperCase()]]);
    }
  } else {
    if (strateTransports != 'metro') {
      //map.setFilter("transports", ["all",["==", "STRATE", strateTransports.toUpperCase()],["==", "SOUS-STRATE", sousStrateTransports],["==", "MCC-MNC", MCCMNC]]);
      map.setFilter("transports", ["all", ["==", "STRATE", strateTransports.toUpperCase()],
        ["==", "SOUS-STRATE", sousStrateTransports],
        ["==", "MCC-MNC", MCCMNCCouv]
      ]);
    } else {
      map.setFilter("transports", ["all", ["==", "STRATE", strateTransports.toUpperCase()],
        ["==", "SOUS-STRATE", sousStrateTransports]
      ]);
    }
  }
};

function setSitesCouvFilter() {
  map.setFilter("Sites", ["==", "Operateur", MCCMNCCouv]);
};

function miseAJourLegendeCouverture(element) {
  if (!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth > 910 && technoCarteCouverture == "3G") {
    if (MCCMNCCouv == 20815) {
      document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
      document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
    } else {
      document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
      document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
    }
  }
  //if(!PopupsInfosLegendeCouvDataSontFermes && window.innerWidth>910 && technoCarteCouverture == "4G"){document.getElementById('PopupInfosLegendeCouvData4G').style.display='block';}
};

function miseAJourCheckboxOrangeAgglos(element) {
  document.getElementById("checkboxAgglosOrange").checked = true;
  document.getElementById("checkboxAgglosBouygues").checked = false;
  document.getElementById("checkboxAgglosSFR").checked = false;
  document.getElementById("checkboxAgglosFree").checked = false;
  document.getElementById("checkboxOrange").checked = true;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;

  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20801;
  afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
  miseAJourLegendeCouverture();
};

function miseAJourCheckboxBouyguesAgglos(element) {
  document.getElementById("checkboxAgglosOrange").checked = false;
  document.getElementById("checkboxAgglosBouygues").checked = true;
  document.getElementById("checkboxAgglosSFR").checked = false;
  document.getElementById("checkboxAgglosFree").checked = false;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = true;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;
  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20820;
  afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
  miseAJourLegendeCouverture();
};

function miseAJourCheckboxSFRAgglos(element) {
  document.getElementById("checkboxAgglosOrange").checked = false;
  document.getElementById("checkboxAgglosBouygues").checked = false;
  document.getElementById("checkboxAgglosSFR").checked = true;
  document.getElementById("checkboxAgglosFree").checked = false;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = true;
  document.getElementById("checkboxFree").checked = false;
  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20810;
  afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
  miseAJourLegendeCouverture();
};

function miseAJourCheckboxFreeAgglos(element) {
  document.getElementById("checkboxAgglosOrange").checked = false;
  document.getElementById("checkboxAgglosBouygues").checked = false;
  document.getElementById("checkboxAgglosSFR").checked = false;
  document.getElementById("checkboxAgglosFree").checked = true;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = true;
  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20815;
  afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
  miseAJourLegendeCouverture();
};

function miseAJourCheckboxOrangeTrans(element) {
  document.getElementById("checkboxAgglosOrange").checked = true;
  document.getElementById("checkboxAgglosBouygues").checked = false;
  document.getElementById("checkboxAgglosSFR").checked = false;
  document.getElementById("checkboxAgglosFree").checked = false;
  document.getElementById("checkboxOrange").checked = true;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;

  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20801;
  //afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
};

function miseAJourCheckboxBouyguesTrans(element) {
  document.getElementById("checkboxAgglosOrange").checked = false;
  document.getElementById("checkboxAgglosBouygues").checked = true;
  document.getElementById("checkboxAgglosSFR").checked = false;
  document.getElementById("checkboxAgglosFree").checked = false;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = true;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;
  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20820;
  //afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
};

function miseAJourCheckboxSFRTrans(element) {
  document.getElementById("checkboxAgglosOrange").checked = false;
  document.getElementById("checkboxAgglosBouygues").checked = false;
  document.getElementById("checkboxAgglosSFR").checked = true;
  document.getElementById("checkboxAgglosFree").checked = false;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = true;
  document.getElementById("checkboxFree").checked = false;
  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20810;
  //afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
};

function miseAJourCheckboxFreeTrans(element) {
  document.getElementById("checkboxAgglosOrange").checked = false;
  document.getElementById("checkboxAgglosBouygues").checked = false;
  document.getElementById("checkboxAgglosSFR").checked = false;
  document.getElementById("checkboxAgglosFree").checked = true;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = true;
  //desactiver cartes autres opérateurs
  MCCMNCCouv = 20815;
  //afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
};

/*function miseAJourCheckboxOrangeTrans(element) {
document.getElementById("checkboxOrange").checked = true;
/*if(MCCMNC != 20801){
  MCCMNC = 20801;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;
  setTransportsFilter();
}
if(MCCMNCCouv != 20801){
  MCCMNCCouv = 20801;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;
  setTransportsFilter();
}
};
function miseAJourCheckboxBouyguesTrans(element) {
document.getElementById("checkboxBouygues").checked = true;
/*if(MCCMNC != 20820){
  MCCMNC = 20820;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;
  setTransportsFilter();
}
 if(MCCMNCCouv != 20820){
  MCCMNCCouv = 20820;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  document.getElementById("checkboxFree").checked = false;
  setTransportsFilter();
}
};
function miseAJourCheckboxSFRTrans(element) {
document.getElementById("checkboxSFR").checked = true;
/*if(MCCMNC != 20810){
  MCCMNC = 20810;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxFree").checked = false;
  setTransportsFilter();
}
if(MCCMNCCouv != 20810){
  MCCMNCCouv = 20810;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxFree").checked = false;
  setTransportsFilter();
}
};
function miseAJourCheckboxFreeTrans(element) {
document.getElementById("checkboxFree").checked = true;
/*if(MCCMNC != 20815){
  MCCMNC = 20815;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  setTransportsFilter();
}
if(MCCMNCCouv != 20815){
  MCCMNCCouv = 20815;
  document.getElementById("checkboxOrange").checked = false;
  document.getElementById("checkboxBouygues").checked = false;
  document.getElementById("checkboxSFR").checked = false;
  setTransportsFilter();
}
};*/

function sousTitreVariableGraphMetro() {
  if (strateTransports == 'metro') {
    return '<div style="font: 13px Arial; text-align:center; font-weight:bold;">Moyenne : ' + dataRaw.web[strateTransports][sousStrateTransports].tous + '%<br><span style="font-size:9px; font-weight:normal;">Performances par opérateurs en 2017</span></div>';
  }
  return '';
};

function getCouleurOperateur(ope) {
  if (ope == "Orange") {
    return "#ff8432";
  }
  if (ope == "Bouygues") {
    return "#3baeb3";
  }
  if (ope == "SFR") {
    return "#cf3232";
  }
  if (ope == "Free") {
    return "#32b432";
  }
};

function getTechnosInstalleesSite(C4G, C3G, C2G) {
  if (C2G == 0 && C3G == 0 && C4G == 0) {
    return "";
  }
  if (C2G == 1 && C3G == 0 && C4G == 0) {
    return "2G";
  }
  if (C2G == 0 && C3G == 1 && C4G == 0) {
    return "3G";
  }
  if (C2G == 1 && C3G == 1 && C4G == 0) {
    return "2G/3G";
  }
  if (C2G == 0 && C3G == 0 && C4G == 1) {
    return "4G";
  }
  if (C2G == 1 && C3G == 0 && C4G == 1) {
    return "2G/4G";
  }
  if (C2G == 0 && C3G == 1 && C4G == 1) {
    return "3G/4G";
  }
  if (C2G == 1 && C3G == 1 && C4G == 1) {
    return "2G/3G/4G";
  }
};

function getIconeOperateur() {
  if (MCCMNCCouv == 20801) {
    return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoOrange.png' alt='' style='position:absolute; top:9px; left:calc(50% - 9px); width: 18px; height: 18px;'/>";
  }
  if (MCCMNCCouv == 20820) {
    return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoBouygues.png' alt='' style='position:absolute; top:9px; left:calc(50% - 10px); width: 21px; height: 18px;'/>";
  }
  if (MCCMNCCouv == 20810) {
    return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoSFR.png' alt='' style='position:absolute; top:9px; left:calc(50% - 9px); width: 18px; height: 18px;'/>";
  }
  if (MCCMNCCouv == 20815) {
    return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoFree.png' alt='' style='position:absolute; top:10px; left:calc(50% - 15px); width: 30px; height: 17px;'/>";
  }
};

function MiseAjourIHM(features) {
  if (features == "2G" || features == "3G" || features == "4G") {
    new Highcharts.Chart(GraphiqueCouvCumul("Population", "Couverture_en_population"));
    new Highcharts.Chart(GraphiqueCouvCumul("Surface", "Couverture_en_territoire"));
    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Population", "Couverture_en_population", "3G"));
    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Surface", "Couverture_en_territoire", "3G"));
    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Population", "Couverture_en_population", "4G"));
    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Surface", "Couverture_en_territoire", "4G"));

    return 1;
  }
  if (features == "national" || features == "rural" || features == "intermediaire" || features == "dense") {
    new Highcharts.Chart(GraphiqueQoS_Voix(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_SMS(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_Web(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_DebitsDl(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_DebitsUl(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_Video(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    return 1;
  }
  if (features == "tgv" || features == "tet" || features == "tdq" || features == "metro" || features == "autoroutes") {
    if (features == "tgv") {
      sousStrateTransports = document.getElementById("SelectTGV").value;
    }
    if (features == "tet") {
      sousStrateTransports = document.getElementById("SelectTET").value;
    }
    if (features == "tdq") {
      sousStrateTransports = document.getElementById("SelectTDQ").value;
    }
    if (features == "metro") {
      sousStrateTransports = document.getElementById("SelectMetro").value;
    }
    if (features == "autoroutes") {
      sousStrateTransports = document.getElementById("SelectAutoroutes").value;
    }
    //document.getElementById('output').innerHTML = JSON.stringify(sousStrateTransports);
    if (features != "metro") {
      new Highcharts.Chart(GraphiqueQoS_VoixTransports(features), function(chart) {
        for (var i = 0; i < 4; i++) {
          if (chart.series[i].data[0].y < 47) {
            chart.series[i].data[0].dataLabel.attr({
              y: 24
            });
          }
        }
      });
      new Highcharts.Chart(GraphiqueQoS_SMSTransports(features), function(chart) {
        for (var i = 0; i < 4; i++) {
          if (chart.series[i].data[0].y < 47) {
            chart.series[i].data[0].dataLabel.attr({
              y: 24
            });
          }
        }
      });
      new Highcharts.Chart(GraphiqueQoS_WebTransports(features, sousStrateTransports), function(chart) {
        for (var i = 0; i < 4; i++) {
          if (chart.series[i].data[0].y < 47) {
            chart.series[i].data[0].dataLabel.attr({
              y: 24
            });
          }
        }
      });
    } else {
      new Highcharts.Chart(GraphiqueQoS_VoixTransports(features));
      new Highcharts.Chart(GraphiqueQoS_SMSTransports(features));
      new Highcharts.Chart(GraphiqueQoS_WebTransports(features, sousStrateTransports));
    }
    return 1;
  }
};

function GraphiqueCouvCumul(texteLeg, inUnite) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueCouv' + texteLeg,
      margin: [25, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      widthAdjust: 140,
      x: -7,
      y: 97,
      text: '<span style="font-size:10px; color:white; font-weight: bold">' + texteLeg + '</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.x) + '">' + this.x + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">' + texteLeg + ' sous ' + this.series.name + ' </div>';
      },
      followPointer: true,
      useHTML: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      categories: ['Orange', 'Bouygues', 'SFR', 'Free'],
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          inside: false,
          y: -15,
          crop: false,
          overflow: 'none',
          padding: 0,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.series.name == 'couverture limitée') {
              if (this.total > 99)
                return '> 99 %';
              if (this.total > 0)
                return this.total + ' %';
            }
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'couverture limitée',
        data: [{
          y: dataRaw.couvertureTechno.CL[inUnite].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffdac1'],
              [1, '#ffdac1']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.CL[inUnite].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cce2e3'],
              [1, '#cce2e3']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.CL[inUnite].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ebc1c1'],
              [1, '#ebc1c1']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.CL[inUnite].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#c1e8c1'],
              [1, '#c1e8c1']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'bonne couverture',
        data: [{
          y: dataRaw.couvertureTechno.BC[inUnite].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffa366'],
              [1, '#ffa366']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.BC[inUnite].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#81b8ba'],
              [1, '#81b8ba']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.BC[inUnite].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf6666'],
              [1, '#cf6666']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.BC[inUnite].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#66c766'],
              [1, '#66c766']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'très bonne couverture',
        data: [{
          y: dataRaw.couvertureTechno.TBC[inUnite].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#FF6600'],
              [1, '#FF6600']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.TBC[inUnite].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#2e898d'],
              [1, '#2e898d']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.TBC[inUnite].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#af0000'],
              [1, '#af0000']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.TBC[inUnite].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#00a200'],
              [1, '#00a200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueCouvCumul_3G4G(texteLeg, inUnite, inTechno) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueCouv' + texteLeg + inTechno,
      margin: [25, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      widthAdjust: 140,
      x: -7,
      y: 97,
      text: '<span style="font-size:10px; color:white; font-weight: bold">' + texteLeg + '</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.x) + '">' + this.x + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">' + texteLeg + ' sous ' + this.series.name + ' </div>';
      },
      followPointer: true,
      useHTML: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      categories: ['Orange', 'Bouygues', 'SFR', 'Free'],
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          inside: false,
          y: -15,
          crop: false,
          overflow: 'none',
          padding: 0,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.series.name == 'couverture ' + inTechno + ' bridée à 1Mbit/s') {
              if (this.total > 99)
                return '> 99 %';
              if (this.total > 0)
                return this.total + ' %';
            }
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'couverture ' + inTechno + ' bridée à 1Mbit/s',
        data: [{
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffdac1'],
              [1, '#ffdac1']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cce2e3'],
              [1, '#cce2e3']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ebc1c1'],
              [1, '#ebc1c1']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#c1e8c1'],
              [1, '#c1e8c1']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'couverture ' + inTechno,
        data: [{
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffa366'],
              [1, '#ffa366']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#81b8ba'],
              [1, '#81b8ba']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf6666'],
              [1, '#cf6666']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#66c766'],
              [1, '#66c766']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },

    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_Voix(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_Voix',
      margin: [18, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      x: -7,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Voix</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Appels maintenus 2 minutes avec une qualité parfaite</div>';
      },
      followPointer: true,
      useHTML: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_VoixTransports(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_VoixTransports',
      margin: [18, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      y: 87,
      x: -7,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Voix</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Appels maintenus 2 minutes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_SMS(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_SMS',
      margin: [18, 10, 16, 20],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      x: 5,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">SMS</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 95px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">SMS reçus en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.SMS[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.SMS[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.SMS[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.SMS[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_SMSTransports(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_SMSTransports',
      margin: [18, 10, 16, 20],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      x: 5,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">SMS</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 95px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">SMS reçus en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.SMS[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.SMS[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.SMS[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.SMS[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_Web(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_Web',
      margin: [18, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      x: -7,
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Navigation Web</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Pages Web chargées en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.web[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.web[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.web[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.web[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_WebTransports(inStrate, sousStrateTransports) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_WebTransports',
      margin: [18, 15, 16, 15],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Navigation Web</span>',
    },
    subtitle: {
      text: sousTitreVariableGraphMetro(),
      align: 'center',
      verticalAlign: 'middle',
      x: 0,
      y: -15,
      widthAdjust: -10,
      style: {
        fontSize: '11px',
        color: '#FFFFFF',
      },
      useHTML: true,
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Pages Web chargées en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_DebitsDl(inStrate) {
  var options = {
    chart: {
      type: 'solidgauge',
      renderTo: 'GraphiqueQoS_DebitsDl',
      margin: [0, 10, 5, 0],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      x: -7,
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Débit descendant</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Débit moyen constaté lors de téléchargements de fichiers</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    pane: {
      center: ['50%', '85%'],
      size: '85%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        innerRadius: '40%',
        shape: 'arc'
      }
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    yAxis: {
      min: 0,
      max: 50000,
      tickWidth: 0,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.debitsDl[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '100%',
        radius: '85%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#ff8432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -75,
        }
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.debitsDl[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '85%',
        radius: '70%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#3baeb3',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -62,
        }
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.debitsDl[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '70%',
        radius: '55%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#cf3232',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -75,
        }
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.debitsDl[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '55%',
        radius: '40%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#32b432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -62,
        }
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_DebitsUl(inStrate) {
  var options = {
    chart: {
      type: 'solidgauge',
      renderTo: 'GraphiqueQoS_DebitsUl',
      margin: [0, 0, 5, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      widthAdjust: 140,
      x: 5,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Débit montant</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Débit moyen constaté lors de l\'envoi de fichiers</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    pane: {
      center: ['50%', '85%'],
      size: '85%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        innerRadius: '40%',
        shape: 'arc'
      }
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    yAxis: {
      min: 0,
      max: 50000,
      tickWidth: 0,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.debitsUl[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '100%',
        radius: '85%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#ff8432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -75,
        }
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.debitsUl[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '85%',
        radius: '70%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#3baeb3',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -62,
        }
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.debitsUl[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '70%',
        radius: '55%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#cf3232',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -75,
        }
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.debitsUl[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '55%',
        radius: '40%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#32b432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -62,
        }
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_Video(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_Video',
      margin: [18, 10, 16, 20],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      align: 'center',
      x: 5,
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Vidéo en ligne</span>',
    },
    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Vidéos de 2 minutes avec une qualité parfaite</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          //crop:false,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },
    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.video[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.video[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.video[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.video[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

//Haut, haut, bas, bas, gauche, droite, gauche, droite, B, A
var kb = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
//superman
var ks = [83, 85, 80, 69, 82, 77, 65, 78];
n = 0;
i = 0;
var timer;
$(document).keydown(function(e) {
  if (e.keyCode === ks[n++]) {
    if (n === ks.length) {
      n = 0;
      document.getElementById('timerS').style.display = 'block';
      map.addSource('testFree', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [2.3214, 48.8717],
                [2.3218, 48.8715],
                [2.3218, 48.8713],
                [2.3214, 48.8711],
                [2.321, 48.8711],
                [2.3206, 48.8713],
                [2.3206, 48.8715],
                [2.321, 48.8717],
                [2.3214, 48.8717]
              ]
            ]
          }
        }
      });
      map.addSource('testBouygues', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [2.2895, 48.8673],
                [2.2899, 48.8671],
                [2.2899, 48.8669],
                [2.2895, 48.8667],
                [2.2891, 48.8667],
                [2.2887, 48.8669],
                [2.2887, 48.8671],
                [2.2891, 48.8673],
                [2.2895, 48.8673]
              ]
            ]
          }
        }
      });
      map.addSource('testOrange', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [2.2938, 48.8334],
                [2.2942, 48.8332],
                [2.2942, 48.833],
                [2.2938, 48.8328],
                [2.2934, 48.8328],
                [2.293, 48.833],
                [2.293, 48.8332],
                [2.2934, 48.8334],
                [2.2938, 48.8334]
              ]
            ]
          }
        }
      });
      map.addSource('testSFR', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [2.2859, 48.8512],
                [2.2863, 48.851],
                [2.2863, 48.8508],
                [2.2859, 48.8506],
                [2.2855, 48.8506],
                [2.2851, 48.8508],
                [2.2851, 48.851],
                [2.2855, 48.8512],
                [2.2859, 48.8512]
              ]
            ]
          }
        }
      });
      map.addLayer({
        'id': 'testFree',
        'type': 'fill-extrusion',
        'source': 'testFree',
        'layout': {},
        'paint': {
          'fill-extrusion-color': '#32b432',
          'fill-extrusion-height': 300,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.6
        }
      });
      map.addLayer({
        'id': 'testBouygues',
        'type': 'fill-extrusion',
        'source': 'testBouygues',
        'layout': {},
        'paint': {
          'fill-extrusion-color': '#3baeb3',
          'fill-extrusion-height': 300,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.6
        }
      });
      map.addLayer({
        'id': 'testOrange',
        'type': 'fill-extrusion',
        'source': 'testOrange',
        'layout': {},
        'paint': {
          'fill-extrusion-color': '#ff8432',
          'fill-extrusion-height': 300,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.6
        }
      });
      map.addLayer({
        'id': 'testSFR',
        'type': 'fill-extrusion',
        'source': 'testSFR',
        'layout': {},
        'paint': {
          'fill-extrusion-color': '#cf3232',
          'fill-extrusion-height': 300,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.6
        }
      });
      var superMan = $('<img>');
      superMan.attr('id', "superMan");
      superMan.attr('src', "https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/superman.png");
      var x = 300;
      var y = 0;
      superMan.attr('style', "position:absolute;bottom:" + (y - 0) + "px; margin-bottom:-38px; margin-left: auto; margin-right: auto; left: 100px; right: 0; width: 400px;");
      superMan.appendTo('body');
      map.setPitch(80);
      map.setBearing(270);
      map.setZoom(15);
      map.setCenter([2.3380, 48.8719]);

      map.keyboard.disable();
      map.getCanvas().focus();
      map.getCanvas().addEventListener('keydown', function(e) {
        e.preventDefault();
        if (e.which === 37) { // left
          document.getElementById("superMan").style.transform = "rotate(-10deg)";
          map.setBearing(map.getBearing() - 6);
          map.panBy([-80, 0], {
            easing: easingLinear,
            duration: 0
          });
          map.panBy([0, -100], {
            easing: easingLinear,
            duration: 500
          });
        } else if (e.which === 39) { // right
          document.getElementById("superMan").style.transform = "rotate(10deg)";
          map.setBearing(map.getBearing() + 6);
          map.panBy([80, 0], {
            easing: easingLinear,
            duration: 0
          });
          map.panBy([-0, -100], {
            easing: easingLinear,
            duration: 500
          });
        }
      }, true);
      timer = setInterval('decompte()', 500);
      return false;
    }
  } else if (e.keyCode === kb[i++]) {
    if (i === kb.length) {
      i = 0;
      var doABarrelRoll = function() {
        var a = "-webkit-",
          b = 'transform:rotate(3turn);',
          c = 'transition:4s;';
        document.head.innerHTML += '<style>#map{' + a + b + a + c + b + c + '}'
      }
      doABarrelRoll();
      return false;
    }
  } else {
    n = 0;
    i = 0;
  }
});

var compte = 30;
var xSuper;
var ySuper;
var distanceFree, distanceBouygues, distanceSFR, distanceOrange;

function decompte() {
  document.getElementById('BOUM').style.display = 'none';
  document.getElementById("superMan").style.transform = "rotate(0deg)";
  map.panBy([0, -200], {
    easing: easingLinear,
    duration: 500
  });
  document.getElementById("timerS").innerHTML = Math.round(compte / 2);
  if (compte == 0 || compte < 0) {
    compte = 0;
    clearInterval(timer);
  }
  compte--;
  xSuper = document.getElementById("superMan").getBoundingClientRect().right - document.getElementById("superMan").getBoundingClientRect().left;
  ySuper = document.getElementById("superMan").getBoundingClientRect().top;
  //distance
  distanceFree = Math.sqrt(Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lng - 2.3213, 2) + Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lat - 48.8712, 2));
  distanceBouygues = Math.sqrt(Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lng - 2.2892, 2) + Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lat - 48.8669, 2));
  distanceSFR = Math.sqrt(Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lng - 2.2857, 2) + Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lat - 48.8508, 2));
  distanceOrange = Math.sqrt(Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lng - 2.2936, 2) + Math.pow(map.unproject({
    "x": xSuper,
    "y": ySuper
  }).lat - 48.8330, 2));
  //console.log(distanceFree);
  if (distanceFree < 0.003) {
    document.getElementById('BOUM').style.left = (xSuper + 300) + 'px';
    document.getElementById('BOUM').style.top = (ySuper - 220) + 'px';
    document.getElementById('BOUM').style.display = 'block';
    map.setLayoutProperty('testFree', 'visibility', 'none');
  }
  if (distanceBouygues < 0.003) {
    document.getElementById('BOUM').style.left = (xSuper + 300) + 'px';
    document.getElementById('BOUM').style.top = (ySuper - 220) + 'px';
    document.getElementById('BOUM').style.display = 'block';
    map.setLayoutProperty('testBouygues', 'visibility', 'none');
  }
  if (distanceSFR < 0.003) {
    document.getElementById('BOUM').style.left = (xSuper + 300) + 'px';
    document.getElementById('BOUM').style.top = (ySuper - 220) + 'px';
    document.getElementById('BOUM').style.display = 'block';
    map.setLayoutProperty('testSFR', 'visibility', 'none');
  }
  if (distanceOrange < 0.003) {
    document.getElementById('BOUM').style.left = (xSuper + 300) + 'px';
    document.getElementById('BOUM').style.top = (ySuper - 220) + 'px';
    document.getElementById('BOUM').style.display = 'block';
    map.setLayoutProperty('testOrange', 'visibility', 'none');
  }
}

function easingLinear(t) {
  return t;
}

$("#toggleHUD").click(function() {
  if ($(this).css("left") == "5px") {
    $("aside").show();
    $("#agglos,.mapboxgl-ctrl").hide();
    $(this).text("❰")
    $(this).css("left", "287px")
  } else {
    $("aside").hide();
    $("#agglos, .mapboxgl-ctrl").show();
    $(this).text("☰")
    $(this).css("left", "5px")
  }
});
window.addEventListener('orientationchange', function() {
  if ($(window).width() > "910") {
    $("aside, #agglos, .mapboxgl-ctrl").show();;
    $("#toggleHUD").text("❰")
    $("#toggleHUD").css("left", "287px")
  }
});

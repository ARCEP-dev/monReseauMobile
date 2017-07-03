var emphasePublication = "QoS";
var strate = "national";
var carteCouverture = "voix";
var carteCouvertureAvant = "voix";
var technoCarteCouverture = "4G";
var technoCarteCouvertureAvant = "4G";
var strateTransports = "routes";
var sousStrateTransports = "tous";
var MCCMNC;
var MCCMNCAvant;
var couvertureQoSAvant = emphasePublication;
var couvertureQoS = emphasePublication;
var agglosTransportsAvant = "transports";
var agglosTransports = "transports";
var transportsVoixDataAvant = "data";
var transportsVoixData = "data";
var map;

var sourceLoaded = [];
var layerVisible = [];

console.log("Le site monreseaumobile est développé par l'Arcep.\nLes différentes bibliothèques utilisées sont : \n- MapBox pour la cartographie,\n- highcharts pour les graphiques\n- et bien sûr un peu de jquery.\n\nLe code est disponible sur gitHub : \nhttps://github.com/ARCEP-dev/monReseauMobile/\n\nN'hésitez pas à nous faire des retours quant à votre utilisation et d'éventuels bugs constatés, nous nous efforcerons d'améliorer cela.\nBonne utilisation ;-)");

activerMenuQoS();

if (!mapboxgl.supported()) {
  alert("Votre navigateur Internet ne permet pas d’afficher cette page.\nTrouvez à cette adresse les navigateurs compatibles :\nhttps://www.mapbox.com/help/mapbox-browser-support/");
} else {
  mapboxgl.accessToken = mapBoxToken;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/stephanedeboysson/cixuos482006j2slg51a945r8',
    center: [3, 46.5],
    zoom: 5,
    maxZoom: 15,
    minZoom: 5,
    maxBounds: [-12, 39, 18, 53],
    attributionControl: false
  });
  // disable map rotation
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.ready = true;
}

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
  addMbSource("point");
  addMbSource("transports_data");
  addMbSource("transports_voix");
  addMbSource("Sites");
  addMbSource("BC_Orange");
  addMbSource("CL_Orange");
  addMbSource("TBC_Orange");
  addMbSource("BC_Bouygues");
  addMbSource("CL_Bouygues");
  addMbSource("TBC_Bouygues");
  addMbSource("BC_SFR");
  addMbSource("CL_SFR");
  addMbSource("TBC_SFR");
  addMbSource("BC_Free");
  addMbSource("CL_Free");
  addMbSource("TBC_Free");

  if (couvertureQoS == "QoS") {
    addMbLayer("Sites");
    addMbLayer("point");
    addMbLayer("transports_data");
    addMbLayer("transports_voix");
  } else if (couvertureQoS == "couverture") {
    addMbLayer("TBC_Orange");
    addMbLayer("BC_Orange");
    addMbLayer("CL_Orange");
    addMbLayer("TBC_Bouygues");
    addMbLayer("BC_Bouygues");
    addMbLayer("CL_Bouygues");
    addMbLayer("TBC_SFR");
    addMbLayer("BC_SFR");
    addMbLayer("CL_SFR");
    addMbLayer("TBC_Free");
    addMbLayer("BC_Free");
    addMbLayer("CL_Free");
  }
  setAllLayersInvisible();
  randomOperateur();
  afficherCouches();
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
  var z = map.getZoom();
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
    map.setZoom(z);
  }
});

//Site Info popup
var popupInfo = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('click', function(e) {
  if (layerVisible.includes("Sites")) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['Sites']
    });

    // Change the cursor style as a UI indicator.
    //map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    if (features.length !== 1) {
      popupInfo.remove();
      return;
    }
    var feature = features[0];
    // Populate the popup and set its coordinates based on the feature found.
    popupInfo.setLngLat(feature.geometry.coordinates)
      .setHTML(getIconeOperateur(feature.properties.Operateur) + "<br>Emetteur " + getTechnosInstalleesSite(feature.properties.C4G, feature.properties.C3G, feature.properties.C2G))
      .addTo(map);
  }
});

map.on('mousemove', function(e) {
  if (layerVisible.includes("transports_voix")) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["transports_voix"]
    });

    if (features.length !== 0) {
      var feature = features[0];

      if (feature.properties['bilan'] == "OK") {
        popupInfo.setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.protocole + " : succès :-)")
          .addTo(map);
      } else {
        popupInfo.setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.protocole + " : échec ;-(")
          .addTo(map);
      }
    } else {
      popupInfo.remove();
      return;
    }
  }
});

geocoder.on('result', function(ev) {
  setLayerVisible("point");
  map.getSource('point').setData(ev.result.geometry);
});

function randomOperateur() {
  var randOp = Math.floor(Math.random() * 4);
  if (randOp === 0) {
    miseAJourChoixOperateur(20801);
  }
  if (randOp == 1) {
    miseAJourChoixOperateur(20810);
  }
  if (randOp == 2) {
    miseAJourChoixOperateur(20815);
  }
  if (randOp == 3) {
    miseAJourChoixOperateur(20820);
  }
}

function afficherCouches() {
  if (map != undefined && map.ready) {
    setAllLayersInvisible();
    if ((boutonCouverture.status == "active") || (MCCMNC != MCCMNCAvant) || (carteCouverture != carteCouvertureAvant) || (technoCarteCouverture != technoCarteCouvertureAvant)) {
      if (boutonCarteVoix.status == "active") {
        if (MCCMNC == 20801) {
          setLayerVisible("TBC_Orange");
          setLayerVisible("BC_Orange");
          setLayerVisible("CL_Orange");
        }
        if (MCCMNC == 20810) {
          setLayerVisible("TBC_SFR");
          setLayerVisible("BC_SFR");
          setLayerVisible("CL_SFR");
        }
        if (MCCMNC == 20815) {
          setLayerVisible("TBC_Free");
          setLayerVisible("BC_Free");
          setLayerVisible("CL_Free");
        }
        if (MCCMNC == 20820) {
          setLayerVisible("TBC_Bouygues");
          setLayerVisible("BC_Bouygues");
          setLayerVisible("CL_Bouygues");
        }
      }

      if (boutonCarteData.status == "active") {
        if (MCCMNC == 20801) {
          if (technoCarteCouverture == "3G") {
            setLayerVisible("3G_Orange");
          } else if (technoCarteCouverture == "4G") {
            setLayerVisible("4G_Orange");
          }
        }
        if (MCCMNC == 20810) {
          if (technoCarteCouverture == "3G") {
            setLayerVisible("3G_SFR");
          } else if (technoCarteCouverture == "4G") {
            setLayerVisible("4G_SFR");
          }
        }
        if (MCCMNC == 20815) {
          if (technoCarteCouverture == "3G") {
            setLayerVisible("3G_Free");
            setLayerVisible("3G_Free_bridee");
          }
          if (technoCarteCouverture == "4G") {
            setLayerVisible("4G_Free");
          }
        }
        if (MCCMNC == 20820) {
          if (technoCarteCouverture == "3G") {
            setLayerVisible("3G_Bouygues");
          }
          if (technoCarteCouverture == "4G") {
            setLayerVisible("4G_Bouygues");
          }
        }
      }
      setLayerVisible("Sites");
    }

    if (boutonQoS.status == "active" && agglosTransports == "agglos" && (agglosTransportsAvant == "transports" || couvertureQoSAvant == "couverture")) {
      setAllLayersInvisible();
    }

    if (boutonQoS.status == "active" && agglosTransports == "transports") {
      if (transportsVoixData == "data") {
        setLayerVisible("transports_data");
      } else if (transportsVoixData == "voix") {
        setLayerVisible("transports_voix");
      }
      setTransportsFilter();
    }

    carteCouvertureAvant = carteCouverture;
    technoCarteCouvertureAvant = technoCarteCouverture;
    couvertureQoSAvant = couvertureQoS;
    agglosTransportsAvant = agglosTransports;
    transportsVoixDataAvant = transportsVoixData;
    MCCMNCAvant = MCCMNC;
  }
}

function activeBoutonCouverture() {
  unactiveButton(boutonQoS);
  unactiveButton(boutonTransports);
  unactiveButton(boutonRoutes);
  unactiveButton(boutonQoSTransportsVoixSMS);
  unactiveButton(boutonQoSTransportsData);
  activeButton(boutonCouverture);
}

function activeBoutonQoS() {
  unactiveButton(boutonCouverture);
  unactiveButton(boutonCarteVoix);
  unactiveButton(boutonCarteData);
  activeButton(boutonQoS);
}

function activeBoutonAgglos() {
  unactiveButton(boutonTransports);
  unactiveButton(boutonRoutes);
  unactiveButton(boutonQoSTransportsVoixSMS);
  unactiveButton(boutonQoSTransportsData);
  activeButton(boutonAgglos);
}

function activeBoutonTransports() {
  unactiveButton(boutonAgglos);
  activeButton(boutonTransports);
}

function activeBoutonQoSTransportsVoixSMS() {
  unactiveButton(boutonQoSTransportsData);
  activeButton(boutonQoSTransportsVoixSMS);
}

function activeBoutonQoSTransportsData() {
  unactiveButton(boutonQoSTransportsVoixSMS);
  activeButton(boutonQoSTransportsData);
}

function activeBoutonCarteVoix() {
  unactiveButton(boutonCarteData);
  activeButton(boutonCarteVoix);
}

function activeBoutonCarteData() {
  unactiveButton(boutonCarteVoix);
  activeButton(boutonCarteData);
}

function activeBouton3G() {
  unactiveButton(bouton4G);
  activeButton(bouton3G);
}

function activeBouton4G() {
  unactiveButton(bouton3G);
  activeButton(bouton4G);
}

function activeBoutonNational() {
  unactiveButton(boutonRural);
  unactiveButton(boutonIntermediaire);
  unactiveButton(boutonDense);
  activeButton(boutonNational);
}

function activeBoutonRural() {
  unactiveButton(boutonNational);
  unactiveButton(boutonIntermediaire);
  unactiveButton(boutonDense);
  activeButton(boutonRural);
}

function activeBoutonIntermediaire() {
  unactiveButton(boutonNational);
  unactiveButton(boutonRural);
  unactiveButton(boutonDense);
  activeButton(boutonIntermediaire);
}

function activeBoutonDense() {
  unactiveButton(boutonNational);
  unactiveButton(boutonRural);
  unactiveButton(boutonIntermediaire);
  activeButton(boutonDense);
}

function activeBoutonRoutes() {
  unactiveButton(boutonTGV);
  unactiveButton(boutonIntercites_TER);
  unactiveButton(boutonRER_Transiliens);
  unactiveButton(boutonMetros);
  activeButton(boutonRoutes);
}

function activeBoutonTGV() {
  unactiveButton(boutonRoutes);
  unactiveButton(boutonIntercites_TER);
  unactiveButton(boutonRER_Transiliens);
  unactiveButton(boutonMetros);
  activeButton(boutonTGV);
}

function activeBoutonIntercites_TER() {
  unactiveButton(boutonRoutes);
  unactiveButton(boutonTGV);
  unactiveButton(boutonRER_Transiliens);
  unactiveButton(boutonMetros);
  activeButton(boutonIntercites_TER);
}

function activeBoutonRER_Transiliens() {
  unactiveButton(boutonRoutes);
  unactiveButton(boutonTGV);
  unactiveButton(boutonIntercites_TER);
  unactiveButton(boutonMetros);
  activeButton(boutonRER_Transiliens);
}

function activeBoutonMetros() {
  unactiveButton(boutonRoutes);
  unactiveButton(boutonTGV);
  unactiveButton(boutonIntercites_TER);
  unactiveButton(boutonRER_Transiliens);
  activeButton(boutonMetros);
}

document.getElementById("boutonCouverture").addEventListener("click", activerMenuCouverture);
document.getElementById("boutonQoS").addEventListener("click", activerMenuQoS);
document.getElementById("boutonAgglos").addEventListener("click", activerMenuAgg);
document.getElementById("boutonTransports").addEventListener("click", activerMenuTransports);
document.getElementById("boutonQoSTransportsVoixSMS").addEventListener("click", activerMenuQoSTransportsVoixSMS);
document.getElementById("boutonQoSTransportsData").addEventListener("click", activerMenuQoSTransportsData);

function activerMenuCouverture() {
  if (boutonCouverture.status != "active") {
    couvertureQoS = "couverture";
    addMbLayer("TBC_Orange");
    addMbLayer("BC_Orange");
    addMbLayer("CL_Orange");
    addMbLayer("TBC_Bouygues");
    addMbLayer("BC_Bouygues");
    addMbLayer("CL_Bouygues");
    addMbLayer("TBC_SFR");
    addMbLayer("BC_SFR");
    addMbLayer("CL_SFR");
    addMbLayer("TBC_Free");
    addMbLayer("BC_Free");
    addMbLayer("CL_Free");

    activeBoutonCouverture();

    setElInvisible("containerBoutonQoSTransportsOuLDV");
    setElInvisible("ZoneGraphiquesQoSTransports");
    setElInvisible("ZoneGraphiquesQoSLDV");
    setElInvisible("masquerMap");
    setElVisible("ZoneGraphiquesCouv");
    activerMenuCarteVoix();
    afficherCouches();
    return 1;
  }
  return -1;
}

function activerMenuCarteVoix() {
  if (boutonCarteVoix.status != "active") {
    activeBoutonCarteVoix();
    chartsGenerator("2G");
    carteCouverture = "voix";
    afficherCouches();

    setElInvisible("ZoneGraphiquesCouvData");
    setElInvisible("infoQoS");
    setElVisible("ZoneGraphiquesCouvVoix");

    resetLegendesCarte();

    /*setElInvisible("PopupInfosLegendeCouvData3G");
    setElInvisible("PopupInfosLegendeCouvData3GFree");
    setElInvisible("PopupInfosLegendeCouvData4G");*/

    setElInvisible("infoCouv");
    setElInvisible("bouton3G");
    setElInvisible("bouton4G");
    afficherInfo();
    afficherLegendeCarte();
    return 1;
  }
  return -1;
}

function activerMenuCarteData() {
  if (boutonCarteData.status != "active") {
    activerMenu4G();
    addMbSource("4G_Orange");
    addMbSource("4G_Bouygues");
    addMbSource("4G_SFR");
    addMbSource("4G_Free");

    addMbLayer("4G_Orange");
    addMbLayer("4G_Bouygues");
    addMbLayer("4G_SFR");
    addMbLayer("4G_Free");
    activeBoutonCarteData();
    chartsGenerator(technoCarteCouverture);
    carteCouverture = "data";
    afficherCouches();

    afficherInfo();
    setElInvisible("ZoneGraphiquesCouvVoix");
    setElInvisible("PopupInfosLegendeCouvVoix");
    setElVisible("ZoneGraphiquesCouvData");

    setElInvisible("infoCouv");
    setElVisible("infoCouv");
    setElVisible("bouton3G");
    setElVisible("bouton4G");
    afficherLegendeCarte();
    return 1;
  }
  return -1;
}

function activerMenu3G() {
  if (bouton3G.status != "active") {
    technoCarteCouverture = "3G";
    activeBouton3G();

    addMbSource("3G_Orange");
    addMbSource("3G_Bouygues");
    addMbSource("3G_SFR");
    addMbSource("3G_Free");
    addMbSource("3G_Free_bridee");

    addMbLayer("3G_Orange");
    addMbLayer("3G_Bouygues");
    addMbLayer("3G_SFR");
    addMbLayer("3G_Free");
    addMbLayer("3G_Free_bridee");

    chartsGenerator(technoCarteCouverture);
    setElInvisible("boutonInfosCouvData4G");
    setElInvisible("GraphiqueCouvPopulation4G");
    setElInvisible("GraphiqueCouvSurface4G");
    setElInvisible("PopupInfosLegendeCouvVoix");
    setElInvisible("PopupInfosLegendeCouvData4G");
    setElVisible("boutonInfosCouvData3G");
    setElVisible("GraphiqueCouvPopulation3G");
    setElVisible("GraphiqueCouvSurface3G");

    afficherLegendeCarte();
    afficherCouches();
    return 1;
  }
  return -1;
}

function activerMenu4G() {
  if (bouton4G.status != "active") {
    technoCarteCouverture = "4G";
    activeBouton4G();

    addMbSource("4G_Orange");
    addMbSource("4G_Bouygues");
    addMbSource("4G_SFR");
    addMbSource("4G_Free");

    addMbLayer("4G_Orange");
    addMbLayer("4G_Bouygues");
    addMbLayer("4G_SFR");
    addMbLayer("4G_Free");

    chartsGenerator(technoCarteCouverture);
    setElInvisible("boutonInfosCouvData3G");
    setElInvisible("GraphiqueCouvPopulation3G");
    setElInvisible("GraphiqueCouvSurface3G");
    setElInvisible("PopupInfosLegendeCouvVoix");
    setElInvisible("PopupInfosLegendeCouvData3G");
    setElInvisible("PopupInfosLegendeCouvData3GFree");
    setElVisible("boutonInfosCouvData4G");
    setElVisible("GraphiqueCouvPopulation4G");
    setElVisible("GraphiqueCouvSurface4G");

    afficherLegendeCarte();
    afficherCouches();
    return 1;
  }
  return -1;
}

function activerMenuQoS() {
  if (boutonQoS.status != "active") {
    activeBoutonQoS();
    couvertureQoS = "QoS";

    resetZoneGraphiques();
    resetAffichagePopupInfosLegende();
    afficherCouches();
    setElInvisible("ZoneGraphiquesCouv");
    setElVisible("containerBoutonQoSTransportsOuLDV");

    afficherInfo();
    afficherLegendeCarte();

    activerMenuTransports();
    return 1;
  }
  return -1;
}

function activerMenuAgg() {
  if (boutonAgglos.status != "active") {
    activeBoutonAgglos();
    activeBoutonNational();
    boutonQoSTransportsData.status = "unactive";
    boutonQoSTransportsVoixSMS.status = "unactive";
    agglosTransports = "agglos";
    chartsGenerator(strate);
    afficherCouches();

    resetZoneGraphiques();
    setElVisible("ZoneGraphiquesQoSLDV");
    afficherLegendeCarte();
    setElVisible("masquerMap");
    return 1;
  }
  return -1;
}

function activerMenuTransports() {
  if (boutonTransports.status != "active") {
    agglosTransports = "transports";
    activeBoutonTransports();
    createDataList(strateTransports);
    chartsGenerator(strate);

    setElInvisible("masquerMap");
    setElInvisible("ZoneGraphiquesQoSLDV");
    setElVisible("ZoneGraphiquesQoSTransports");
    activerMenuRoutes();
    if (transportsVoixData == "data") {
      activerMenuQoSTransportsData();
    } else {
      activerMenuQoSTransportsVoixSMS();
      setElInvisible("legendeQoSTransports");
    }
    return 1;
  }
  return -1;
}

function activerMenuQoSTransportsVoixSMS() {
  if (boutonQoSTransportsVoixSMS.status != "active") {
    activeBoutonQoSTransportsVoixSMS();
    transportsVoixData = "voix";
    sousStrateTransports = holdAutocompleteValue(sousStrateTransports);
    setElInvisible("ZoneGraphiquesQoSTransportsData");
    chartsGenerator(strateTransports);
    setElVisible("ZoneGraphiquesQoSTransportsVoixSMS");
    afficherLegendeCarte();
    afficherCouches();
    return 1;
  }
  return -1;
}

function activerMenuQoSTransportsData() {
  if (boutonQoSTransportsData.status != "active") {
    activeBoutonQoSTransportsData();
    transportsVoixData = "data";
    sousStrateTransports = holdAutocompleteValue(sousStrateTransports);
    setElInvisible("ZoneGraphiquesQoSTransportsVoixSMS");
    chartsGenerator(strateTransports);
    setElVisible("ZoneGraphiquesQoSTransportsData");
    afficherLegendeCarte();
    afficherCouches();
    return 1;
  }
  return -1;
}

function holdAutocompleteValue(value) {
  if (value == "tous" || value == "") {
    return "tous";
  }
  if (transportsVoixData == "data") {
    obj = JSON.parse(listeVoies);
    obj = obj.data;
  } else if (transportsVoixData == "voix") {
    obj = JSON.parse(listeVoies);
    obj = obj.voix;
  }
  switch (strateTransports) {
    case "routes":
      listeStrateTransports = obj.routes;
      break;
    case "tgv":
      listeStrateTransports = obj.tgv;
      break;
    case "metros":
      listeStrateTransports = obj.metros;
      break;
    case "rer_transiliens":
      listeStrateTransports = obj.rer_transiliens;
      break;
    case "intercites_ter":
      listeStrateTransports = obj.intercites_ter;
      break;
  }
  for (var i = 0; i < listeStrateTransports.length; i++) {
    if (value == listeStrateTransports[i].key) {
      document.getElementById("autocompleteRouteData").value = listeStrateTransports[i].value;
      document.getElementById("autocompleteRouteVoix").value = listeStrateTransports[i].value;
      return listeStrateTransports[i].key;
    }
  }
  document.getElementById("autocompleteRouteData").value = "";
  document.getElementById("autocompleteRouteVoix").value = "";
  return "tous";
}

document.getElementById("popupBoutonFermerBienvenue").addEventListener("click", deletePopup);
document.getElementById("BoutonFermerPopupInfosCouvVoix").addEventListener("click", closePopup);
document.getElementById("BoutonFermerPopupInfosCouvData3G").addEventListener("click", closePopup);
document.getElementById("BoutonFermerPopupInfosCouvData3GFree").addEventListener("click", closePopup);
document.getElementById("BoutonFermerPopupInfosCouvData4G").addEventListener("click", closePopup);
document.getElementById("BoutonFermerPopupInfosInfosComplementairesCouverture").addEventListener("click", closePopup);
document.getElementById("popupBoutonFermerBienvenue").addEventListener("click", closePopup);
document.getElementById("popupBoutonFermerBienvenue").addEventListener("click", closePopup);
document.getElementById("popupBoutonFermerBienvenue").addEventListener("click", closePopup);

document.getElementById("boutonCarteData").addEventListener("click", activerMenuCarteData);
document.getElementById("bouton3G").addEventListener("click", activerMenu3G);
document.getElementById("bouton4G").addEventListener("click", activerMenu4G);
document.getElementById("boutonCarteVoix").addEventListener("click", activerMenuCarteVoix);

function deletePopup(e) {
  var el = e.target;
  var popup = el.parentNode;
  popup.parentNode.removeChild(popup);
}

function closePopup(e) {
  e.target.parentNode.style.display = 'none';
}

//addEventListener on each clicEnSavoirPlusCouv class elements
for (var i = 0; i < document.getElementsByClassName("clicEnSavoirPlusCouv").length; i++) {
  document.getElementsByClassName("clicEnSavoirPlusCouv")[i].addEventListener("click", displayPopupInfo);
}

function displayPopupInfo() {
  document.getElementById('PopupInfosInfosComplementairesCouverture').style.display = 'block';
}

document.getElementById("boutonNational").addEventListener("click", activerMenuNational);
document.getElementById("boutonDense").addEventListener("click", activerMenuDense);
document.getElementById("boutonIntermediaire").addEventListener("click", activerMenuIntermediaire);
document.getElementById("boutonRural").addEventListener("click", activerMenuRural);

function activerMenuNational() {
  if (boutonNational.status != "active") {
    activeBoutonNational();
    strate = "national";
    chartsGenerator(strate);
    return 1;
  }
  return -1;
}

function activerMenuDense() {
  if (boutonDense.status != "active") {
    activeBoutonDense();
    strate = "dense";
    chartsGenerator(strate);
    return 1;
  }
  return -1;
}

function activerMenuIntermediaire() {
  if (boutonIntermediaire.status != "active") {
    activeBoutonIntermediaire();
    strate = "intermediaire";
    chartsGenerator(strate);
    return 1;
  }
  return -1;
}

function activerMenuRural() {
  if (boutonRural.status != "active") {
    activeBoutonRural();
    strate = "rural";
    chartsGenerator(strate);
    return 1;
  }
  return -1;
}

document.getElementById("boutonRoutes").addEventListener("click", activerMenuRoutes);
document.getElementById("boutonTGV").addEventListener("click", activerMenuTGV);
document.getElementById("boutonIntercites_TER").addEventListener("click", activerMenuIntercites_TER);
document.getElementById("boutonRER_Transiliens").addEventListener("click", activerMenuRER_Transiliens);
document.getElementById("boutonMetros").addEventListener("click", activerMenuMetro);

function activerMenuRoutes() {
  if (boutonRoutes.status != "active") {
    activeBoutonRoutes();
    strateTransports = "routes";
    sousStrateTransports = "tous";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    //resetChoixOperateurs();
    //miseAJourChoixOperateur(MCCMNC);
    setTransportsFilter();
    return 1;
  }
  return -1;
}

function activerMenuTGV() {
  if (boutonTGV.status != "active") {
    activeBoutonTGV();
    strateTransports = "tgv";
    sousStrateTransports = "tous";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    miseAJourChoixOperateur(MCCMNC);
    setTransportsFilter();
    return 1;
  }
  return -1;
}

function activerMenuIntercites_TER() {
  if (boutonIntercites_TER.status != "active") {
    activeBoutonIntercites_TER();
    strateTransports = "intercites_ter";
    sousStrateTransports = "tous";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    miseAJourChoixOperateur(MCCMNC);
    setTransportsFilter();
    return 1;
  }
  return -1;
}

function activerMenuRER_Transiliens() {
  if (boutonRER_Transiliens.status != "active") {
    activeBoutonRER_Transiliens();
    strateTransports = "rer_transiliens";
    sousStrateTransports = "tous";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    miseAJourChoixOperateur(MCCMNC);
    setTransportsFilter();
    return 1;
  }
  return -1;
}

function activerMenuMetro() {
  if (boutonMetros.status != "active") {
    activeBoutonMetros();
    strateTransports = "metros";
    sousStrateTransports = "tous";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    miseAJourChoixOperateur(MCCMNC);
    setTransportsFilter();
    return 1;
  }
  return -1;
}

$("#boutonInfosCouvVoix").click(function() {
  if (boutonInfosCouvVoix.status != "active") {
    setElVisible("PopupInfosLegendeCouvVoix");
  }
});
$("#boutonInfosCouvData3G").click(function() {
  if (boutonInfosCouvData3G.status != "active") {
    if (MCCMNC == 20815) {
      setElVisible("PopupInfosLegendeCouvData3GFree");
    } else {
      setElVisible("PopupInfosLegendeCouvData3G");
    }
  }
});
$("#boutonInfosCouvData4G").click(function() {
  if (boutonInfosCouvData4G.status != "active") {
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
  }
});

function metrosVillesFilter(ville) {
  switch (ville) {
    case "lille":
      list = ["in", "sous_strate", "lille_ligne_1", "lille_ligne_2"];
      return list;
    case "lyon":
      list = ["in", "sous_strate", "lyon_ligne_a", "lyon_ligne_b", "lyon_ligne_c", "lyon_ligne_d"];
      return list;
    case "marseille":
      list = ["in", "sous_strate", "marseille_ligne_1", "marseille_ligne_2"];
      return list;
    case "paris":
      list = ["in", "sous_strate", "paris_ligne_1", "paris_ligne_2", "paris_ligne_3", "paris_ligne_3_bis", "paris_ligne_4", "paris_ligne_5", "paris_ligne_6", "paris_ligne_7", "paris_ligne_7_bis", "paris_ligne_8", "paris_ligne_9", "paris_ligne_10", "paris_ligne_11", "paris_ligne_12", "paris_ligne_13", "paris_ligne_14"];
      return list;
    case "toulouse":
      list = ["in", "sous_strate", "toulouse_ligne_a", "toulouse_ligne_b"];
      return list;
  }
}

function setTransportsFilter() {
  if (map != undefined && map.ready) {
    var metrosVilles = ["lille", "lyon", "marseille", "paris", "toulouse"];
    if (transportsVoixData == "data") {
      if (sousStrateTransports == "tous") { // All lines
        map.setFilter("transports_data", ["all", ["==", "strate", strateTransports],
          ["==", "mcc_mnc", MCCMNC]
        ]);
      } else if (metrosVilles.includes(sousStrateTransports)) { // All single city lines
        map.setFilter("transports_data", ["all", ["==", "strate", strateTransports],
          ["==", "mcc_mnc", MCCMNC],
          metrosVillesFilter(sousStrateTransports)
        ]);
      } else { // Filter on single line
        map.setFilter("transports_data", ["all", ["==", "strate", strateTransports],
          ["==", "mcc_mnc", MCCMNC],
          ["==", "sous_strate", sousStrateTransports]
        ]);
      }
    } else if (transportsVoixData == "voix") {
      if (sousStrateTransports == "tous") {
        map.setFilter("transports_voix", ["all", ["==", "strate", strateTransports],
          ["==", "mcc_mnc", MCCMNC]
        ]);
      } else if (metrosVilles.includes(sousStrateTransports)) {
        map.setFilter("transports_voix", ["all", ["==", "strate", strateTransports],
          ["==", "mcc_mnc", MCCMNC],
          metrosVillesFilter(sousStrateTransports)
        ]);
      } else {
        map.setFilter("transports_voix", ["all", ["==", "strate", strateTransports],
          ["==", "sous_strate", sousStrateTransports],
          ["==", "mcc_mnc", MCCMNC]
        ]);
      }
    }
  }
}

function metroFilter(strate, subStrate) {
  if (strate != "metros") {
    return subStrate;
  } else {
    var listMetroVilles = ["lille", "lyon", "marseille", "paris", "rennes", "toulouse"];
    if (listMetroVilles.indexOf(subStrate) > -1) {} else {
      return subStrate;
    }
  }
}

function setSitesCouvFilter() {
  if (map.ready) {
    map.setFilter("Sites", ["==", "Operateur", MCCMNC]);
  }
}

function miseAJourLegendeCouverture(element) {
  if (window.innerWidth > 910 && couvertureQoS == "couverture" && carteCouverture == "data" && technoCarteCouverture == "3G") {
    if (MCCMNC == 20815) {
      setElInvisible("PopupInfosLegendeCouvData3G");
      setElVisible("PopupInfosLegendeCouvData3GFree");
    } else {
      setElInvisible("PopupInfosLegendeCouvData3GFree");
      setElVisible("PopupInfosLegendeCouvData3G");
    }
  }
}

function getCouleurOperateur(codeOperateur, colorLevel=0) {
  if (codeOperateur == 20801) {
    switch (colorLevel) {
      case 1:
        return "#ff6600";
      break;
      case 2:
        return "#ffa366";
      break;
      case 3:
        return "#ffdac1";
      break;
      default:
        return "#ff8432";
    }
  }
  else if (codeOperateur == 20810) {
    switch (colorLevel) {
      case 1:
        return "#af0000";
      break;
      case 2:
        return "#cf6666";
      break;
      case 3:
        return "#ebc1c1";
      break;
      default:
        return "#cf3232";
    }
  }
  else if (codeOperateur == 20815) {
    switch (colorLevel) {
      case 1:
        return "#00A200";
      break;
      case 2:
        return "#66C766";
      break;
      case 3:
        return "#c1e8c1";
      break;
      default:
        return "#32b432";
    }
  }
  else if (codeOperateur == 20820) {
    switch (colorLevel) {
      case 1:
        return "#2e898d";
      break;
      case 2:
        return "#81b8ba";
      break;
      case 3:
        return "#cce2e3";
      break;
      default:
        return "#3baeb3";
    }
  }else {
    return -1
  }
}

function getCouleurNiveauCouverture(value) {
  switch (value) {
    case 1:
      return "#E36565";
    break;
    case 2:
      return "#EEA2A2";
    break;
    case 3:
      return "#F6D2D2";
    break;
  }
}

function getTechnosInstalleesSite(C4G, C3G, C2G) {
  if (C2G === 0 && C3G === 0 && C4G === 0) {
    return "";
  }
  if (C2G == 1 && C3G === 0 && C4G === 0) {
    return "2G";
  }
  if (C2G === 0 && C3G == 1 && C4G === 0) {
    return "3G";
  }
  if (C2G == 1 && C3G == 1 && C4G === 0) {
    return "2G/3G";
  }
  if (C2G === 0 && C3G === 0 && C4G == 1) {
    return "4G";
  }
  if (C2G == 1 && C3G === 0 && C4G == 1) {
    return "2G/4G";
  }
  if (C2G === 0 && C3G == 1 && C4G == 1) {
    return "3G/4G";
  }
  if (C2G == 1 && C3G == 1 && C4G == 1) {
    return "2G/3G/4G";
  }
}

function getIconeOperateur(value) {
  switch (value) {
    case 20801:
      return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoOrange.png' alt='' style='position:absolute; top:9px; left:calc(50% - 9px); width: 18px; height: 18px;'/>";
    case 20820:
      return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoBouygues.png' alt='' style='position:absolute; top:9px; left:calc(50% - 10px); width: 21px; height: 18px;'/>";
    case 20810:
      return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoSFR.png' alt='' style='position:absolute; top:9px; left:calc(50% - 9px); width: 18px; height: 18px;'/>";
    case 20815:
      return "<img src='https://monreseaumobile.fr/fileadmin/reprise/observatoire/qsmobile/logoFree.png' alt='' style='position:absolute; top:10px; left:calc(50% - 15px); width: 30px; height: 17px;'/>";
    default:
      return "";
  }
}

$("#toggleHUD").click(function() {
  if ($(this).css("left") == "5px") {
    $("aside").show();
    $("#agglos,.mapboxgl-ctrl").hide();
    $(this).text("❰");
    $(this).css("left", "287px");
  } else {
    $("aside").hide();
    $("#agglos, .mapboxgl-ctrl").show();
    $(this).text("☰");
    $(this).css("left", "5px");
  }
});

window.addEventListener('orientationchange', function() {
  if ($(window).width() > "910") {
    $("aside, #agglos, .mapboxgl-ctrl").show();
    $("#toggleHUD").text("❰");
    $("#toggleHUD").css("left", "287px");
  }
});

document.getElementById("autocompleteRouteData").addEventListener("input", getSelectedRoute);
document.getElementById("autocompleteRouteVoix").addEventListener("input", getSelectedRoute);

function createDataList(strateTransports) {
  var parentNode = document.getElementById("autocompleteListeVoies");
  removeAllChild("autocompleteListeVoies");

  if (transportsVoixData == "data") {
    resetInput("autocompleteRouteData");
    obj = JSON.parse(listeVoies);
    obj = obj.data;
  } else if (transportsVoixData == "voix") {
    resetInput("autocompleteRouteVoix");
    obj = JSON.parse(listeVoies);
    obj = obj.voix;
  } else {
    return -1;
  }
  var listeStrateTransports;
  switch (strateTransports) {
    case "routes":
      listeStrateTransports = obj.routes;
      break;
    case "tgv":
      listeStrateTransports = obj.tgv;
      break;
    case "metros":
      listeStrateTransports = obj.metros;
      break;
    case "rer_transiliens":
      listeStrateTransports = obj.rer_transiliens;
      break;
    case "intercites_ter":
      listeStrateTransports = obj.intercites_ter;
      break;
  }
  //Select the blank datalist
  for (var i = 0; i < listeStrateTransports.length; i++) {
    var newOption = document.createElement("option");
    newOption.value = listeStrateTransports[i].value;
    parentNode.appendChild(newOption);
  }
}

function removeAllChild(selector) {
  var parentNode = document.getElementById(selector);
  while (parentNode.childElementCount > 0) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function resetInput(selector) {
  document.getElementById(selector).value = "";
}

function getSelectedRoute() {
  var selectedValue;
  if (transportsVoixData == "data" && document.getElementById("autocompleteRouteData").value !== "") {
    selectedValue = document.getElementById("autocompleteRouteData").value;
    obj = JSON.parse(listeVoies);
    obj = obj.data;
  } else if (transportsVoixData == "voix" && document.getElementById("autocompleteRouteVoix").value !== "") {
    selectedValue = document.getElementById("autocompleteRouteVoix").value;
    obj = JSON.parse(listeVoies);
    obj = obj.voix;
  }
  switch (strateTransports) {
    case "routes":
      listeStrateTransports = obj.routes;
      break;
    case "tgv":
      listeStrateTransports = obj.tgv;
      break;
    case "metros":
      listeStrateTransports = obj.metros;
      break;
    case "rer_transiliens":
      listeStrateTransports = obj.rer_transiliens;
      break;
    case "intercites_ter":
      listeStrateTransports = obj.intercites_ter;
      break;
  }

  for (var i = 0; i < listeStrateTransports.length; i++) {
    if (selectedValue == listeStrateTransports[i].value) {
      sousStrateTransports = listeStrateTransports[i].key;
      chartsGenerator(strateTransports);
      setTransportsFilter();
    }
  }
}

function activeButton(value) {
  value.className = value.className + " active";
  value.querySelector(".selectLight").className = "selectLight active";
  value.status = "active";
}

function unactiveButton(value) {
  value.querySelector(".selectLight").classList.remove("active");
  value.classList.remove("active");
  value.status = "unactive";
}

function addMbSource(value) {
  for (var i = 0; i < sourceLoaded.length; i++) {
    if (sourceLoaded[i] == value) {
      //Source already loaded
      return 0;
    }
  }
  if (value == "point") {
    map.addSource('point', {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    });
  } else {
    var obj = JSON.parse(mbData);
    var MbSources = obj.sources;
    for (var j = 0; j < MbSources.length; j++) {
      if (value == MbSources[j].id) {
        map.addSource(value, {
          type: MbSources[j].type,
          url: MbSources[j].url
        });
      }
    }
  }
  sourceLoaded.push(value);
}

function addMbLayer(value) {
  if (value == "3d-buildings") {
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
        'fill-extrusion-opacity': 0.7
      }
    }, 'place_label_other');
  } else if (value == "point") {
    map.addLayer({
      "id": "point",
      "source": "point",
      "type": "circle",
      "paint": {
        "circle-radius": 10,
        "circle-color": "#4c4c4c"
      }
    });
  } else if (value == "Sites") {
    map.addLayer({
      "id": "Sites",
      "type": "symbol",
      "minzoom": 10,
      "source": "Sites",
      "source-layer": "2017-01_sites-58ec8q",
      "layout": {
        "icon-image": "triangle-15",
      },
    });
  } else if (value == "transports_data") {
    map.addLayer({
      "id": "transports_data",
      "type": "circle",
      "source": "transports_data",
      "source-layer": "QoSTransportsData_20170621_0949geojson",
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
          property: 'bilan',
          type: 'categorical',
          stops: [
            ["ECHEC-HR", '#d82727'],
            ["2G", '#d82727'],
            ["3G", '#8AE300'],
            ["4G", '#3b913b']
          ]
        }
      },
      //"filter": ["all",["==", "strate", "ROUTES"],["==", "mcc_mnc", 20801]],
      //"filter": ["all",["==", "strate", "ROUTES"],["==", "mcc_mnc", MCCMNC]],
    });
  } else if (value == "transports_voix") {
    map.addLayer({
      "id": "transports_voix",
      "type": "circle",
      "source": "transports_voix",
      "source-layer": "QoSTransportsVoix_20170621_0948geojson",
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
          property: 'bilan',
          type: 'categorical',
          stops: [
            ["KO", '#d82727'],
            ["OK", '#3b913b'],
          ]
        }
      },
      //"filter": ["all",["==", "strate", "ROUTES"],["==", "mcc_mnc", 20801]],
      //"filter": ["all",["==", "strate", "ROUTES"],["==", "mcc_mnc", MCCMNC]],
    });
  }
  //Layers Couverture, 3G, 4G
  else {
    var obj = JSON.parse(mbData);
    var MbLayers = obj.layers;
    for (var i = 0; i < MbLayers.length; i++) {
      if (value == MbLayers[i].id) {
        map.addLayer({
          "id": MbLayers[i].id,
          "type": MbLayers[i].type,
          "source": MbLayers[i].source,
          "source-layer": MbLayers[i].sourceLayer,
          "paint": {
            "fill-color": MbLayers[i].paint.fillColor,
            'fill-opacity': MbLayers[i].paint.fillOpacity,
            "fill-outline-color": MbLayers[i].paint.fillOutlineColor,
          },
        }, 'place_label_other');
      }
    }
  }
  layerVisible.push(value);
}

function setLayerVisible(layer) {
  if (!layerVisible.includes(layer)) {
    map.setLayoutProperty(layer, "visibility", "visible");
    layerVisible.push(layer);
  }
}

function setLayerInvisible(layer) {
  map.setLayoutProperty(layer, "visibility", "none");
  removeFromArray(layerVisible, layer);
}

function setAllLayersInvisible() {
  while (layerVisible.length > 0) {
    setLayerInvisible(layerVisible[0]);
  }
}

function setElVisible(value) {
  var element = document.getElementById(value);
  element.style.display = "block";
}

function setElInvisible(value) {
  var element = document.getElementById(value);
  element.style.display = "none";
}

function removeFromArray(array, value) {
  if (array.indexOf(value) >= 0) {
    array.splice(array.indexOf(value), 1);
  }
}

function resetZoneGraphiques() {
  setElInvisible("ZoneGraphiquesCouv");
  setElInvisible("ZoneGraphiquesCouvData");
  setElInvisible("ZoneGraphiquesCouvVoix");
  setElInvisible("ZoneGraphiquesQoSTransports");
  setElInvisible("ZoneGraphiquesQoSTransportsData");
  setElInvisible("ZoneGraphiquesQoSTransportsVoixSMS");
  setElInvisible("ZoneGraphiquesQoSLDV");
}

function resetAffichagePopupInfosLegende() {
  setElInvisible("PopupInfosLegendeCouvVoix");
  setElInvisible("PopupInfosLegendeCouvData3G");
  setElInvisible("PopupInfosLegendeCouvData3GFree");
  setElInvisible("PopupInfosLegendeCouvData4G");
  setElInvisible("PopupInfosInfosComplementairesCouverture");
}

function resetAffichageInfo() {
  setElInvisible("infoCouv");
  setElInvisible("infoQoS");
}

function afficherInfo() {
  resetAffichageInfo();
  if (couvertureQoS == "couverture") {
    setElVisible("infoCouv");
  } else if (couvertureQoS == "QoS") {
    setElVisible("infoQoS");
  }
}

function afficherLegendeCarte() {
  resetLegendesCarte();
  if (couvertureQoS == "couverture") {
    if (carteCouverture == "voix") {
      afficherLegendeCarteCouvVoix();
    }
    if (carteCouverture == "data" && technoCarteCouverture == "3G") {
      afficherLegendeCarteCouv3G();
    }
    if (carteCouverture == "data" && technoCarteCouverture == "4G") {
      afficherLegendeCarteCouv4G();
    }
  } else if (couvertureQoS == "QoS") {
    if (agglosTransports == "transports" && transportsVoixData == "data") {
      afficherLegendeCarteQoSData();
    }
    if (agglosTransports == "transports" && transportsVoixData == "voix") {
      afficherLegendeCarteQoSVoixSMS();
    }
  }
}

function afficherLegendeCarteCouvVoix() {
  setElVisible("enteteLegendeCouvVoix");
  setElVisible("sousLegendeCouverture");
  setElVisible("blocLegendeCouvVoix");
}

function afficherLegendeCarteCouv3G() {
  setElVisible("enteteLegendeCouvData");
  setElVisible("sousLegendeCouverture");
  setElVisible("blocLegendeCouvData");
  setElVisible("blocLegendeCouvData3G");
}

function afficherLegendeCarteCouv4G() {
  setElInvisible("blocLegendeCouvData3G"); //To solve mysterious bug
  setElVisible("enteteLegendeCouvData");
  setElVisible("sousLegendeCouverture");
  setElVisible("blocLegendeCouvData");
  setElVisible("blocLegendeCouvData4G");
}

function afficherLegendeCarteQoSData() {
  setElVisible("legendeQoS");
  setElVisible("enteteLegendeQoSWeb");
  setElVisible("blocLegendeQoSData");
  setElVisible("sousLegendeQoS");
}

function afficherLegendeCarteQoSVoixSMS() {
  setElVisible("legendeQoS");
  setElVisible("enteteLegendeQoSVoixSMS");
  setElVisible("blocLegendeQoSVoix");
  setElVisible("sousLegendeQoS");
}

function resetLegendesCarte() {
  masquerLegendeCarteCouvVoix();
  masquerLegendeCarteCouv3G();
  masquerLegendeCarteCouv4G();
  masquerLegendeCarteQoSData();
  masquerLegendeCarteQoSVoixSMS();
}

function masquerLegendeCarteCouvVoix() {
  setElInvisible("enteteLegendeCouvVoix");
  setElInvisible("sousLegendeCouverture");
  setElInvisible("blocLegendeCouvVoix");
}

function masquerLegendeCarteCouv3G() {
  setElInvisible("enteteLegendeCouvData");
  setElVisible("blocLegendeCouvData3G");
  setElInvisible("blocLegendeCouvData");
  setElInvisible("sousLegendeCouverture");
}

function masquerLegendeCarteCouv4G() {
  setElInvisible("enteteLegendeCouvData");
  setElInvisible("blocLegendeCouvData4G");
  setElInvisible("blocLegendeCouvData");
  setElInvisible("sousLegendeCouverture");
}

function masquerLegendeCarteQoSData() {
  setElInvisible("legendeQoS");
  setElInvisible("enteteLegendeQoSWeb");
  setElInvisible("sousLegendeQoS");
  setElInvisible("blocLegendeQoSData");
}

function masquerLegendeCarteQoSVoixSMS() {
  setElInvisible("legendeQoS");
  setElInvisible("enteteLegendeQoSVoixSMS");
  setElInvisible("sousLegendeQoS");
  setElInvisible("blocLegendeQoSVoix");
}

function miseAJourChoixOperateur(value) {
  resetChoixOperateurs();
  MCCMNC = value;
  switch (MCCMNC) {
    case 20801:
      setRadioChecked("choixCouvOrange");
      setRadioChecked("choixQoSOrange");
      break;
    case 20810:
      setRadioChecked("choixCouvSFR");
      setRadioChecked("choixQoSSFR");
      break;
    case 20815:
      setRadioChecked("choixCouvFree");
      setRadioChecked("choixQoSFree");
      break;
    case 20820:
      setRadioChecked("choixCouvBouygues");
      setRadioChecked("choixQoSBouygues");
      break;
    default:
  }
  afficherCouches();
  setSitesCouvFilter();
  setTransportsFilter();
  miseAJourLegendeCouverture();
}

function resetChoixOperateurs() {
  setRadioUnchecked("choixCouvOrange");
  setRadioUnchecked("choixQoSOrange");
  setRadioUnchecked("choixCouvBouygues");
  setRadioUnchecked("choixQoSBouygues");
  setRadioUnchecked("choixCouvFree");
  setRadioUnchecked("choixQoSFree");
  setRadioUnchecked("choixCouvSFR");
  setRadioUnchecked("choixQoSSFR");
}

function setRadioChecked(elId) {
  document.getElementById(elId).checked = true;
}

function setRadioUnchecked(elId) {
  document.getElementById(elId).checked = false;
}

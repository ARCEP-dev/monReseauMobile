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
var couvertureQosAvant = "couverture";
var couvertureQos = "couverture";
var agglosTransportsAvant = "transports";
var agglosTransports = "transports";
var transportsVoixDataAvant = "data";
var transportsVoixData = "data";

chartsGenerator("2G");

activeBoutonCouverture();
activeBoutonCarteVoix();
activeBouton4G();
activeBoutonTransports();
activeBoutonNational();
activeBoutonQoSTransportsData();
activeBoutonAutoroutes();

if (!mapboxgl.supported()) {
  alert("Votre navigateur Internet ne permet pas d’afficher cette page. Veuillez le mettre à jour.");
}
else {
  mapboxgl.accessToken = mapBoxToken;
  var map = new mapboxgl.Map({
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
  //addMbSource("3d-buildings");
  addMbSource("transports");
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

  //addMbLayer("3d-buildings");
  addMbLayer("Sites");
  addMbLayer("point");
  addMbLayer("transports");
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

  setAllLayersInvisible();
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
var siteInfoPopup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['Sites']
  });

  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  if (features.length !== 1) {
    siteInfoPopup.remove();
    return;
  }
  var feature = features[0];
  // Populate the popup and set its coordinates based on the feature found.
  siteInfoPopup.setLngLat(feature.geometry.coordinates)
    .setHTML(getIconeOperateur(feature.properties.Operateur) + "<br>Emetteur " + getTechnosInstalleesSite(feature.properties.C4G, feature.properties.C3G, feature.properties.C2G))
    .addTo(map);
});

map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, {layers: ["transports"]});
    if (features.length !== 0) {
      var feature = features[0];
      var logo = "";
      if(getIconeOperateur(feature.properties["MCC-MNC"]) !== ""){logo = getIconeOperateur(feature.properties["MCC-MNC"]) + "<br>";}

      siteInfoPopup.setLngLat(feature.geometry.coordinates)
      .setHTML(logo + "Résultat : " + feature.properties['BILAN2-OD'])
      .addTo(map);
    }
});

geocoder.on('result', function(ev) {
  setLayerVisible("point");
  map.getSource('point').setData(ev.result.geometry);
});

function randomOperateur() {
  var randOp = Math.floor(Math.random() * 4);
  if (randOp === 0) {
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
}

function afficherCouches() {
  if ((boutonCouverture.status == "active") || (MCCMNCCouv != MCCMNCCouvAvant) || (carteCouverture != carteCouvertureAvant) || (technoCarteCouverture != technoCarteCouvertureAvant)) {
    if (boutonCarteVoix.status == "active") {
      if (MCCMNCCouv == 20801) {
        setAllLayersInvisible();
        setLayerVisible("TBC_Orange");
        setLayerVisible("BC_Orange");
        setLayerVisible("CL_Orange");
      }
      if (MCCMNCCouv == 20810) {
        setAllLayersInvisible();
        setLayerVisible("TBC_SFR");
        setLayerVisible("BC_SFR");
        setLayerVisible("CL_SFR");
      }
      if (MCCMNCCouv == 20815) {
        setAllLayersInvisible();
        setLayerVisible("TBC_Free");
        setLayerVisible("BC_Free");
        setLayerVisible("CL_Free");
      }
      if (MCCMNCCouv == 20820) {
        setAllLayersInvisible();
        setLayerVisible("TBC_Bouygues");
        setLayerVisible("BC_Bouygues");
        setLayerVisible("CL_Bouygues");
      }
    }

    if (boutonCarteData.status == "active") {
      if (MCCMNCCouv == 20801) {
        setAllLayersInvisible();
        if (technoCarteCouverture == "3G") {
          setLayerVisible("3G_Orange");
        } else if (technoCarteCouverture == "4G") {
          setLayerVisible("4G_Orange");
        }
      }
      if (MCCMNCCouv == 20810) {
        setAllLayersInvisible();
        if (technoCarteCouverture == "3G") {
          setLayerVisible("3G_SFR");
        } else if (technoCarteCouverture == "4G") {
          setLayerVisible("4G_SFR");
        }
      }
      if (MCCMNCCouv == 20815) {
        setAllLayersInvisible();
        if (technoCarteCouverture == "3G") {
          setLayerVisible("3G_Free");
          setLayerVisible("3G_Free_bridee");
        }
        if (technoCarteCouverture == "4G") {
          setLayerVisible("4G_Free");
        }
      }
      if (MCCMNCCouv == 20820) {
        setAllLayersInvisible();
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

  if (boutonQoS.status == "active" && agglosTransports == "agglos" && (agglosTransportsAvant == "transports" || couvertureQosAvant == "couverture")) {
    setAllLayersInvisible();
  }

  if ((boutonQoS.status == "active" && agglosTransports == "transports" && (agglosTransportsAvant == "agglos" || couvertureQosAvant == "couverture") || transportsVoixDataAvant != transportsVoixData)) {
    setAllLayersInvisible();
    if (transportsVoixData == "data") {
      setLayerVisible("transports");
    } else if (transportsVoixData == "voix") {
      setAllLayersInvisible();
    }
  }

  carteCouvertureAvant = carteCouverture;
  technoCarteCouvertureAvant = technoCarteCouverture;
  couvertureQosAvant = couvertureQos;
  agglosTransportsAvant = agglosTransports;
  transportsVoixDataAvant = transportsVoixData;
  MCCMNCCouvAvant = MCCMNCCouv;
}

function activeBoutonCouverture() {
  unactiveButton(boutonQoS);
  unactiveButton(selectLightQoS);
  activeButton(selectLightCouverture);
  activeButton(boutonCouverture);
}

function activeBoutonQoS() {
  unactiveButton(boutonCouverture);
  unactiveButton(selectLightCouverture);
  activeButton(boutonQoS);
  activeButton(selectLightQoS);
}

function activeBoutonAgglos() {
  unactiveButton(boutonTransports);
  unactiveButton(selectLightTransports);
  activeButton(boutonAgglos);
  activeButton(selectLightAgglos);
}

function activeBoutonTransports() {
  unactiveButton(boutonAgglos);
  unactiveButton(selectLightAgglos);
  activeButton(boutonTransports);
  activeButton(selectLightTransports);
}

function activeBoutonQoSTransportsVoixSMS() {
  unactiveButton(boutonQoSTransportsData);
  unactiveButton(selectLightQoSTransportsData);
  activeButton(boutonQoSTransportsVoixSMS);
  activeButton(selectLightQoSTransportsVoixSMS);
}

function activeBoutonQoSTransportsData() {
  unactiveButton(boutonQoSTransportsVoixSMS);
  unactiveButton(selectLightQoSTransportsVoixSMS);
  activeButton(boutonQoSTransportsData);
  activeButton(selectLightQoSTransportsData);
}

function activeBoutonCarteVoix() {
  unactiveButton(selectLightCarteData);
  unactiveButton(boutonCarteData);
  activeButton(selectLightCarteVoix);
  activeButton(boutonCarteVoix);
}

function activeBoutonCarteData() {
  unactiveButton(boutonCarteVoix);
  unactiveButton(selectLightCarteVoix);
  activeButton(boutonCarteData);
  activeButton(selectLightCarteData);
}

function activeBouton3G() {
  unactiveButton(bouton4G);
  unactiveButton(selectLight4G);
  activeButton(bouton3G);
  activeButton(selectLight3G);
}

function activeBouton4G() {
  unactiveButton(bouton3G);
  unactiveButton(selectLight3G);
  activeButton(selectLight4G);
  activeButton(bouton4G);
}

function activeBoutonNational() {
  unactiveButton(boutonRural);
  unactiveButton(boutonIntermediaire);
  unactiveButton(boutonDense);
  unactiveButton(selectLightRural);
  unactiveButton(selectLightIntermediaire);
  unactiveButton(selectLightDense);
  activeButton(selectLightNational);
  activeButton(boutonNational);
}

function activeBoutonRural() {
  unactiveButton(boutonNational);
  unactiveButton(boutonIntermediaire);
  unactiveButton(boutonDense);
  unactiveButton(selectLightNational);
  unactiveButton(selectLightIntermediaire);
  unactiveButton(selectLightDense);
  activeButton(selectLightRural);
  activeButton(boutonRural);
}

function activeBoutonIntermediaire() {
  unactiveButton(boutonNational);
  unactiveButton(boutonRural);
  unactiveButton(boutonDense);
  unactiveButton(selectLightNational);
  unactiveButton(selectLightRural);
  unactiveButton(selectLightDense);
  activeButton(boutonIntermediaire);
  activeButton(selectLightIntermediaire);
}

function activeBoutonDense() {
  unactiveButton(boutonNational);
  unactiveButton(boutonRural);
  unactiveButton(boutonIntermediaire);
  unactiveButton(selectLightNational);
  unactiveButton(selectLightRural);
  unactiveButton(selectLightIntermediaire);
  activeButton(boutonDense);
  activeButton(selectLightDense);
}

function activeBoutonAutoroutes() {
  unactiveButton(boutonTGV);
  unactiveButton(boutonTET);
  unactiveButton(boutonTDQ);
  unactiveButton(boutonMetro);
  unactiveButton(selectLightTGV);
  unactiveButton(selectLightTET);
  unactiveButton(selectLightTDQ);
  unactiveButton(selectLightMetro);
  activeButton(boutonAutoroutes);
  activeButton(selectLightAutoroutes);
}

function activeBoutonTGV() {
  unactiveButton(boutonAutoroutes);
  unactiveButton(boutonTET);
  unactiveButton(boutonTDQ);
  unactiveButton(boutonMetro);
  unactiveButton(selectLightAutoroutes);
  unactiveButton(selectLightTET);
  unactiveButton(selectLightTDQ);
  unactiveButton(selectLightMetro);
  activeButton(selectLightTGV);
  activeButton(boutonTGV);
}

function activeBoutonTET() {
  unactiveButton(boutonAutoroutes);
  unactiveButton(boutonTGV);
  unactiveButton(boutonTDQ);
  unactiveButton(boutonMetro);
  unactiveButton(selectLightAutoroutes);
  unactiveButton(selectLightTGV);
  unactiveButton(selectLightTDQ);
  unactiveButton(selectLightMetro);
  activeButton(boutonTET);
  activeButton(selectLightTET);
}

function activeBoutonTDQ() {
  unactiveButton(boutonAutoroutes);
  unactiveButton(boutonTGV);
  unactiveButton(boutonTET);
  unactiveButton(boutonMetro);
  unactiveButton(selectLightAutoroutes);
  unactiveButton(selectLightTGV);
  unactiveButton(selectLightTET);
  unactiveButton(selectLightMetro);
  activeButton(boutonTDQ);
  activeButton(selectLightTDQ);
}

function activeBoutonMetro() {
  unactiveButton(boutonAutoroutes);
  unactiveButton(boutonTGV);
  unactiveButton(boutonTET);
  unactiveButton(boutonTDQ);
  unactiveButton(selectLightAutoroutes);
  unactiveButton(selectLightTGV);
  unactiveButton(selectLightTET);
  unactiveButton(selectLightTDQ);
  activeButton(boutonMetro);
  activeButton(selectLightMetro);
}

document.getElementById("boutonCouverture").addEventListener("click", activerMenuCouverture);
document.getElementById("boutonQoS").addEventListener("click", activerMenuQoS);
document.getElementById("boutonAgglos").addEventListener("click", activerMenuAgg);
document.getElementById("boutonTransports").addEventListener("click", activerMenuTransports);
document.getElementById("boutonQoSTransportsVoixSMS").addEventListener("click", activerMenuQoSTransportsVoixSMS);
document.getElementById("boutonQoSTransportsData").addEventListener("click", activerMenuQoSTransportsData);

function activerMenuCouverture(){
  if (boutonCouverture.status != "active") {
    activerMenuCarteVoix();
    activeBoutonCouverture();
    chartsGenerator("2G");
    couvertureQos = "couverture";
    afficherCouches();
    document.getElementById('containerboutonAggloTransports').style.display = 'none';
    document.getElementById('ZoneGraphiquesCouv').style.display = 'block';
    document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
    document.getElementById('ZoneGraphiquesTransports').style.display = 'none';
    if (carteCouverture == "voix") {
      document.getElementById('EnteteLegendeAgglos').style.display = 'block';
      if (window.innerWidth > 910) {
        document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'block';
      }
      document.getElementById('EnteteLegendeCouvData').style.display = 'none';
      document.getElementById('infoCouvVoix').style.display = 'block';
      document.getElementById('infoCouvData').style.display = 'none';
    }
    if (carteCouverture == "data") {
      document.getElementById('EnteteLegendeAgglos').style.display = 'none';
      if (window.innerWidth > 910 && technoCarteCouverture == "3G") {
        if (MCCMNCCouv == 20815) {
          document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
        } else {
          document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
        }
      }
      if (window.innerWidth > 910 && technoCarteCouverture == "4G") {
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
}

function activerMenuQoS() {
  if (boutonQoS.status != "active") {
    activeBoutonQoS();
    activeBoutonTransports();
    activeBoutonAutoroutes();
    activeBoutonQoSTransportsData();

    chartsGenerator(strateTransports);
    createDataList(strateTransports);

    couvertureQos = "QoS";
    afficherCouches();

    document.getElementById('masquerMap').style.display = 'none';
    document.getElementById('EnteteLegendeTransports').style.display = 'block';
    document.getElementById('legendeTransports').style.display = 'block';

    document.getElementById('containerboutonAggloTransports').style.display = 'block';
    document.getElementById('ZoneGraphiquesCouv').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'none';

    document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
    document.getElementById('ZoneGraphiquesTransports').style.display = 'block';

    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('EnteteLegendeCouvData').style.display = 'none';
    document.getElementById('legendeAgglos').style.display = 'none';
    document.getElementById('infoCouvVoix').style.display = 'none';
    document.getElementById('infoCouvData').style.display = 'none';
    document.getElementById('infoQoS').style.display = 'block';
  }
}
function activerMenuAgg() {
  if (boutonAgglos.status != "active") {
    activeBoutonAgglos();
    activeBoutonNational();
    chartsGenerator(strate);
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
}

function activerMenuTransports() {
  if (boutonTransports.status != "active") {
    activeBoutonTransports();
    activerMenuAutoroute();
    activerMenuQoSTransportsData();

    agglosTransports = "transports";
    afficherCouches();
    document.getElementById('ZoneGraphiquesQoS').style.display = 'none';
    document.getElementById('ZoneGraphiquesTransports').style.display = 'block';
    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('legendeAgglos').style.display = 'none';
    if (transportsVoixData == "data") {
      activerMenuQoSTransportsData();
      document.getElementById('masquerMap').style.display = 'none';
    } else {
      activerMenuQoSTransportsVoixSMS();
      document.getElementById('masquerMap').style.display = 'block';
      document.getElementById('EnteteLegendeTransports').style.display = 'none';
      document.getElementById('legendeTransports').style.display = 'none';
    }
  }
}

function activerMenuQoSTransportsVoixSMS() {
  if(boutonQoSTransportsVoixSMS.status != "active"){
    activeBoutonQoSTransportsVoixSMS();
    transportsVoixData = "voix";
    afficherCouches();
    document.getElementById('ZoneGraphiquesTransportsVoixSMS').style.display = 'block';
    document.getElementById('ZoneGraphiquesTransportsData').style.display = 'none';
    document.getElementById('EnteteLegendeTransports').style.display = 'none';
    document.getElementById('legendeTransports').style.display = 'none';
    document.getElementById('masquerMap').style.display = 'block';
  }
}
function activerMenuQoSTransportsData() {
  if(boutonQoSTransportsData.status != "active"){
    activeBoutonQoSTransportsData();
    transportsVoixData = "data";
    afficherCouches();
    document.getElementById('ZoneGraphiquesTransportsVoixSMS').style.display = 'none';
    document.getElementById('ZoneGraphiquesTransportsData').style.display = 'block';
    document.getElementById('EnteteLegendeTransports').style.display = 'block';
    document.getElementById('legendeTransports').style.display = 'block';
    document.getElementById('masquerMap').style.display = 'none';
  }
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

function activerMenuCarteVoix() {
  if(boutonCarteVoix.status != "active"){
    activeBoutonCarteVoix();
    chartsGenerator("2G");
    carteCouverture = "voix";
    afficherCouches();

    document.getElementById('ZoneGraphiquesCouvVoix').style.display = 'block';
    document.getElementById('ZoneGraphiquesCouvData').style.display = 'none';
    document.getElementById('blocLegendeCouvVoix').style.display = 'block';
    document.getElementById('blocLegendeCouvData').style.display = 'none';
    document.getElementById('EnteteLegendeAgglos').style.display = 'block';
    document.getElementById('EnteteLegendeCouvData').style.display = 'none';
    if (window.innerWidth > 910) {
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
    document.getElementById('ZoneGraphiquesCouvVoix').style.display = 'none';
    document.getElementById('ZoneGraphiquesCouvData').style.display = 'block';
    document.getElementById('blocLegendeCouvVoix').style.display = 'none';
    document.getElementById('blocLegendeCouvData').style.display = 'block';
    document.getElementById('EnteteLegendeAgglos').style.display = 'none';
    document.getElementById('EnteteLegendeCouvData').style.display = 'block';
    document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'none';
    if (window.innerWidth > 910 && technoCarteCouverture == "3G") {
      if (MCCMNCCouv == 20815) {
        document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
      } else {
        document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
      }
    }
    if (window.innerWidth > 910 && technoCarteCouverture == "4G") {
      document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
    }
    document.getElementById('infoCouvVoix').style.display = 'none';
    document.getElementById('infoCouvData').style.display = 'block';
    document.getElementById('bouton3G').style.display = 'block';
    document.getElementById('bouton4G').style.display = 'block';
  }
}
function activerMenu3G() {
  if(bouton3G.status != "active"){
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
    technoCarteCouverture = "3G";
    activeBouton3G();
    chartsGenerator(technoCarteCouverture);
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
    if (window.innerWidth > 910) {
      if (MCCMNCCouv == 20815) {
        document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
      } else {
        document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
      }
    }
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'none';
    afficherCouches();
  }
}
function activerMenu4G() {
  if(bouton4G.status != "active"){
    addMbSource("4G_Orange");
    addMbSource("4G_Bouygues");
    addMbSource("4G_SFR");
    addMbSource("4G_Free");

    addMbLayer("4G_Orange");
    addMbLayer("4G_Bouygues");
    addMbLayer("4G_SFR");
    addMbLayer("4G_Free");
    technoCarteCouverture = "4G";
    activeBouton4G();
    chartsGenerator(technoCarteCouverture);
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
    if (window.innerWidth > 910) {
      document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
    }
    afficherCouches();
  }
}

$("#boutonNational").click(function() {
  if(boutonNational.status != "active"){
    activeBoutonNational();
    strate = "national";
    chartsGenerator(strate);
  }
});
$("#boutonRural").click(function() {
  if(boutonRural.status != "active"){
    activeBoutonRural();
    strate = "rural";
    chartsGenerator(strate);
  }
});
$("#boutonIntermediaire").click(function() {
  if(boutonIntermediaire.status != "active"){
    activeBoutonIntermediaire();
    strate = "intermediaire";
    chartsGenerator(strate);
  }
});
$("#boutonDense").click(function() {
  if(boutonDense.status != "active"){
    activeBoutonDense();
    strate = "dense";
    chartsGenerator(strate);
  }
});

document.getElementById("boutonAutoroutes").addEventListener("click", activerMenuAutoroute);

function activerMenuAutoroute() {
  if(boutonDense.status != "active"){
    activeBoutonAutoroutes();
    strateTransports = "autoroutes";
    sousStrateTransports = "toutesAutoroutes";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    MiseAjourCheckboxOperateursMetro();
    setTransportsFilter();
  }
}

$("#boutonTGV").click(function() {
  if(boutonTGV.status != "active"){
    activeBoutonTGV();
    strateTransports = "tgv";
    sousStrateTransports = "tousTGV";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    MiseAjourCheckboxOperateursMetro();
    setTransportsFilter();
  }
});
$("#boutonTET").click(function() {
  if(boutonTET.status != "active"){
    activeBoutonTET();
    strateTransports = "tet";
    sousStrateTransports = "tousTET";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    MiseAjourCheckboxOperateursMetro();
    setTransportsFilter();
  }
});
$("#boutonTDQ").click(function() {
  if(boutonTDQ.status != "active"){
    activeBoutonTDQ();
    strateTransports = "tdq";
    sousStrateTransports = "tousTDQ";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    MiseAjourCheckboxOperateursMetro();
    setTransportsFilter();
  }
});
$("#boutonMetro").click(function() {
  if(boutonMetro.status != "active"){
    activeBoutonMetro();
    strateTransports = "metro";
    sousStrateTransports = "tousMetros";
    createDataList(strateTransports);
    chartsGenerator(strateTransports);
    MiseAjourCheckboxOperateursMetro();
    setTransportsFilter();
  }
});
$("#boutonInfosCouvVoix").click(function() {
  if(boutonInfosCouvVoix.status != "active"){
    document.getElementById('PopupInfosLegendeCouvVoix').style.display = 'block';
  }
});
$("#boutonInfosCouvData3G").click(function() {
  if(boutonInfosCouvData3G.status != "active"){
    if (MCCMNCCouv == 20815) {
      document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
    } else {
      document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
    }
  }
});
$("#boutonInfosCouvData4G").click(function() {
  if(boutonInfosCouvData4G.status != "active"){
    document.getElementById('PopupInfosLegendeCouvData4G').style.display = 'block';
  }
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
  }
  else {
    document.getElementById("checkboxOrange").checked = false;
    document.getElementById("checkboxBouygues").checked = false;
    document.getElementById("checkboxSFR").checked = false;
    document.getElementById("checkboxFree").checked = false;
    document.getElementById("checkboxOrange").disabled = false;
    document.getElementById("checkboxBouygues").disabled = false;
    document.getElementById("checkboxSFR").disabled = false;
    document.getElementById("checkboxFree").disabled = false;
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
}

function setTransportsFilter() {
  if (sousStrateTransports == "toutesAutoroutes" || sousStrateTransports == "tousTGV" || sousStrateTransports == "tousTDQ" || sousStrateTransports == "tousTET" || sousStrateTransports == "tousMetros") {
    if (strateTransports != 'metro') {
      map.setFilter("transports", ["all", ["==", "STRATE", strateTransports.toUpperCase()],
        ["==", "MCC-MNC", MCCMNCCouv]
      ]);
    } else {
      map.setFilter("transports", ["all", ["==", "STRATE", strateTransports.toUpperCase()]]);
    }
  } else {
    if (strateTransports != 'metro') {
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
}

function setSitesCouvFilter() {
  map.setFilter("Sites", ["==", "Operateur", MCCMNCCouv]);
}

function miseAJourLegendeCouverture(element) {
  if (window.innerWidth > 910 && technoCarteCouverture == "3G") {
    if (MCCMNCCouv == 20815) {
      document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'none';
      document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'block';
    } else {
      document.getElementById('PopupInfosLegendeCouvData3GFree').style.display = 'none';
      document.getElementById('PopupInfosLegendeCouvData3G').style.display = 'block';
    }
  }
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

function sousTitreVariableGraphMetro() {
  if (strateTransports == 'metro') {
    return '<div style="font: 13px Arial; text-align:center; font-weight:bold;">Moyenne : ' + dataRaw.web[strateTransports][sousStrateTransports].tous + '%<br><span style="font-size:9px; font-weight:normal;">Performances par opérateurs en 2017</span></div>';
  }
  return '';
}

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

document.getElementById("autocompleteRoute").addEventListener("input", getSelectedRoute);

function createDataList(strateTransports){
  resetInput("autocompleteRoute");
  removeAllChild("voies");
  var obj = JSON.parse(listeVoies);
  var listeStrateTransports;
  switch (strateTransports) {
    case "autoroutes":
      listeStrateTransports = obj.autoroutes;
      break;
    case "tgv":
      listeStrateTransports = obj.tgv;
      break;
    case "metro":
      listeStrateTransports = obj.metros;
      break;
    case "tet":
      listeStrateTransports = obj.trainsET;
      break;
    case "tdq":
      listeStrateTransports = obj.trainsQuotidien;
      break;
  }

  //Select the blank datalist
  var parentNode = document.getElementById("voies");

  for (var i = 0; i < listeStrateTransports.length; i++) {
    var newOption = document.createElement("option");
    newOption.value = listeStrateTransports[i].value;
    parentNode.appendChild(newOption);
  }
}

function removeAllChild(selector) {
  var parentNode = document.getElementById(selector);
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function resetInput(selector){
  document.getElementById(selector).value = "";
}

function getSelectedRoute(){
  if (document.getElementById("autocompleteRoute").value !== "") {
    var selectedValue = document.getElementById("autocompleteRoute").value;

    var obj = JSON.parse(listeVoies);
    switch (strateTransports) {
      case "autoroutes":
        var listeStrateTransports = obj.autoroutes;
        break;
      case "tgv":
        var listeStrateTransports = obj.tgv;
        break;
      case "metro":
        var listeStrateTransports = obj.metros;
        break;
      case "tet":
        var listeStrateTransports = obj.trainsET;
        break;
      case "tdq":
        var listeStrateTransports = obj.trainsQuotidien;
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
}

function activeButton(value){
  $(value).addClass('active');
  value.status = "active";
}

function unactiveButton(value){
  $(value).removeClass('active');
  value.status = "unactive";
}

var sourceLoaded = [];
var layerVisible = [];

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

function addMbLayer(value){
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
  }
  else if (value == "point") {
    map.addLayer({
      "id": "point",
      "source": "point",
      "type": "circle",
      "paint": {
        "circle-radius": 10,
        "circle-color": "#4c4c4c"
      }
    });
  }
  else if (value == "Sites") {
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
  }
  else if (value == "transports") {
    map.addLayer({
      "id": "transports",
      "type": "circle",
      "source": "transports",
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
  map.setLayoutProperty(layer, "visibility", "visible");
}

function setLayerInvisible(layer) {
  map.setLayoutProperty(layer, "visibility", "none");
}

function setAllLayersInvisible() {
  for (var i = 0; i < layerVisible.length; i++) {
    setLayerInvisible(layerVisible[i]);
  }
}

function setElInvisible(value){
  var allDiv = document.querySelectorAll("div");
  for (var i = 0; i < allDiv.length; i++) {
    if (allDiv[i].id.match(/value/)) {
      allDiv[i].style.display = "none";
    }
  }
}

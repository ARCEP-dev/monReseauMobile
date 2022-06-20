/* global $, localStorage */
/* global mapboxgl, MapboxGeocoder, mapBoxToken */
/* global territoires, operateurs, mbData, listeVoies */
/* global chartsGenerator */

var emphasePublication = "QoS";
var emphaseTerritory = "timezone" ;
var emphaseNew = "boutonSelectionTerritoire" ;

var strate = "national";
var carteCouverture;
var technoCarteCouverture;
var sousStrate = "tous";
var origineDonnees = "arcep"
var MCCMNC;
var couvertureQoS = emphasePublication;
var agglosTransports = "agglos";
var qosVoixData = "data";
var driveCrowd = "drive";
var fournisseur = "arcep";
var fournisseurCrowd = "";
var map;
var geocoder;
var noPopup = false;
var successRateThreshold = [0, 0.3, 0.7];
var bitrateThresholdExtended = [0, 1, 1000, 3000, 8000, 9999999]


var territoireSelectionne;

var layersVisible = [];

var popupInfo = new mapboxgl.Popup({ closeButton: false, closeOnClick: false }); //Site Info popup

if (emphaseTerritory == "timezone") emphaseTerritory = devinerTerritoire();
if (emphaseTerritory == "random") emphaseTerritory = territoires[Math.floor(Math.random() * territoires.length)].key;

selectionTerritoire(territoires.findByProperty('key', emphaseTerritory));
initialiserActionsBoutonsMenu();

if (!mapboxgl.supported()) {
  activerMenuParDefaut();
  setElVisible("masquerMap");
  alert("Votre navigateur Internet ne permet pas d’afficher la carte MapBox.\nTrouvez à cette adresse les navigateurs compatibles :\nhttps://www.mapbox.com/help/mapbox-browser-support/\nVous pouvez tout de même consulter les données de graphes");
} else {
  mapboxgl.accessToken = mapBoxToken;

  var mapParams = construireMapParams();
  map = new mapboxgl.Map(mapParams);
  // disable map rotation
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.ready = true;

  var geolocate = new mapboxgl.GeolocateControl({showUserLocation: false});
  geolocate.on('geolocate', function(e) {
	  var nouveauTerritoire = territoireSelectionne.key;
	  if (e.coords.latitude > 42 && e.coords.latitude < 51 && e.coords.longitude > -5 && e.coords.longitude < 9)
		nouveauTerritoire = "metropole" ;
	  if (e.coords.latitude > 15.5 && e.coords.latitude < 17 && e.coords.longitude > -62 && e.coords.longitude < -60)
		nouveauTerritoire = "guadeloupe" ;
	  if (e.coords.latitude > 2 && e.coords.latitude < 6 && e.coords.longitude > -55 && e.coords.longitude < -51)
		nouveauTerritoire = "guyane" ;
	  if (e.coords.latitude > 14 && e.coords.latitude < 15 && e.coords.longitude > -62 && e.coords.longitude < -60)
		nouveauTerritoire = "martinique" ;
	  if (e.coords.latitude > -22 && e.coords.latitude < -20 && e.coords.longitude > 55 && e.coords.longitude < 56)
		nouveauTerritoire = "la_reunion" ;
	  if (e.coords.latitude > -13 && e.coords.latitude < -12 && e.coords.longitude > 45 && e.coords.longitude < 46)
		nouveauTerritoire = "mayotte" ;
    if (e.coords.latitude > 17.5 && e.coords.latitude < 18 && e.coords.longitude > -62.9 && e.coords.longitude < -62.7)
    nouveauTerritoire = "st-barth" ;
    if (e.coords.latitude > 17.95 && e.coords.latitude < 18.2 && e.coords.longitude > -63.20 && e.coords.longitude < -62.9)
    nouveauTerritoire = "st-martin" ;
	  if (territoireSelectionne.key !== nouveauTerritoire) {
		  selectionTerritoire(territoires.findByProperty('key', nouveauTerritoire));
		  geolocate.trigger();
	  }
  });

  geocoder = initGeocoder();// Initialize geocoder
  map.addControl(geocoder); // Add geocoder to the map
  map.addControl(geolocate);// Add geolocate control to the map.
  map.addControl(new mapboxgl.NavigationControl({showCompass: false}));// Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.AttributionControl({compact:false}), 'bottom-left');// Add attributions
  map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric'}));// Add scale
  map.on('load', initMap);
  map.on('dblclick', function (e) { afficherPoisson(e); });
  map.on('mousemove', function (e) { mapMouseHandler(e); });
}

function construireMapParams(){
  var map = territoireSelectionne.map;
  return {
    "container": 'map',
    "style": 'mapbox://styles/stephanedeboysson/cixuos482006j2slg51a945r8', // Fond de carte : mapbox://styles/stephanedeboysson/cixuos482006j2slg51a945r8
    "center": map.center,
    "zoom": calculerZoom(map.zoom),
    "maxZoom": map.maxZoom,
    "minZoom": map.minZoom,
    "maxBounds": map.maxBounds,
    "attributionControl": false
  };
}

function initMap(){
  logMessage();
  determinerAffichagePopupBienvenue();
  initialiserActionsBoutonsMenu();

  mbData.layers.forEach(function(mbLayer){addMbLayer(mbLayer.id);});

  randomOperateur();
  activerMenuParDefaut();
}

function activerMenuParDefaut(){
  if (emphasePublication == "couverture") activerMenuCouverture();
  else activerMenuQoS();
  //activerMenuQoSAgglos();
}

function afficherPoisson(e){
  var features = map.queryRenderedFeatures(e.point);
  if (features[0] != null && features[0].layer.id == "water_pattern") {
    var img = document.createElement('img');
    img.src = "./img/GRsnzIk.gif";
    var x = e.originalEvent.clientX || e.point.x;
    var y = e.originalEvent.clientY || e.point.y;
    img.style.position = "absolute";
    img.style.top = (y - 50) +"px";
    img.style.left = (x - 50) +"px";
    img.style.width = "140px";
    document.getElementsByTagName("body")[0].appendChild(img);
    setTimeout(function () {
      img.remove();
    }, 2700);
  }
}

function mapMouseHandler(e){
  if (layersVisible.indexOf(territoireSelectionne.key+"_sites") > -1) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: [territoireSelectionne.key+"_sites"]
    });

    if (features.length !== 1) {
      popupInfo.remove();
      return;
    }
    var feature = features[0];
    // Populate the popup and set its coordinates based on the feature found.
    if (!popupInfo.isOpen() || popupInfo.getLngLat() !== feature.geometry.coordinates)
      //ajout sites 5G
      popupInfo.setLngLat(feature.geometry.coordinates)
        .setHTML(createPopup(feature.properties))
        .addTo(map);
  } else {
    popupInfo.remove();
  }

  // getIconeOperateur(feature.properties.Operateur) + "Emetteur " + getTechnosInstalleesSite(feature.properties.C2G, feature.properties.C3G, feature.properties.C4G, feature.properties.C5G700, feature.properties.C5G2100, feature.properties.C5G3500)
}

function getIconeOperateur(value) {
  var popupEmetteur = "";

  var operateur = operateurByMCCMNC(value);
  if (operateur == undefined)
    return document.createElement("img");
  var width = operateur.logo.size.width;
  var height = operateur.logo.size.height;

  popupEmetteur = document.createElement("img");
  popupEmetteur.src = operateur.logo.url;
  popupEmetteur.style.width = width + 'px';
  popupEmetteur.style.height = height + 'px';
  popupEmetteur.style.float = 'left';
  popupEmetteur.style.padding = '0 5px 0 5px';
  return popupEmetteur.outerHTML;
}

function initGeocoder(){
  var countries = '';
  territoires.forEach(function(territoire) {
    if(countries != '') countries += ',';
    countries += territoire.code; });
  var geocoderParams = {
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries : countries,
    types: "country, region, postcode, district, place, locality, neighborhood, address",
    flyto: false,
    language : 'fr'
  };
  var geocoder = new MapboxGeocoder(geocoderParams);
  geocoder.options.placeholder = "Rechercher votre commune";
  geocoder.on('result', onGeocoderResult);
  return geocoder;
}

function onGeocoderResult(e){
	var propertiesShortCode = e.result.properties.short_code;
	var nouveauTerritoire = territoireSelectionne;

	if (propertiesShortCode != undefined) nouveauTerritoire = determinerNouveauTerritoirePourShortCode(propertiesShortCode);
	else if (e.result.properties.wikidata == "Q34617") nouveauTerritoire = territoires.findByProperty('key','saint_pierre_et_miquelon');
	else nouveauTerritoire = determinerNouveauTerritoirePourShortCode(e.result.context[0].short_code);

	setLayerVisible("point");

	if (territoireSelectionne != nouveauTerritoire) selectionTerritoire(nouveauTerritoire);
	if (e.result.bbox != undefined) map.fitBounds(e.result.bbox, {linear: true});
	else {
		map.jumpTo({center: e.result.center, zoom: 18});
		map.getSource('point').setData(e.result.geometry);
	}
}

function determinerNouveauTerritoirePourShortCode(shortCode){
  var nouveauTerritoire;
  territoires.forEach(function(territoire){
    if(territoire.code.toUpperCase() == shortCode) nouveauTerritoire = territoire;
  });
  if (nouveauTerritoire == null) nouveauTerritoire = territoires.findByProperty('key', 'metropole');
  return nouveauTerritoire;
}

function logMessage(){
  var message = "Le site monreseaumobile est développé par l'Arcep.\n";
  message += "Les différentes bibliothèques utilisées sont : \n";
  message += "\t- MapBox pour la cartographie,\n";
  message += "\t- highcharts pour les graphiques\n";
  message += "\t- moment-timezone pour déterminer une première localisation.\n\n";
  message += "Le code est disponible sur gitHub : \n";
  message += "https://github.com/ARCEP-dev/monReseauMobile/\n\n";
  message += "N'hésitez pas à nous faire des retours quant à votre utilisation et d'éventuels bugs constatés, nous nous efforcerons d'améliorer cela.\n";
  message += "Bonne utilisation ;-)";
  console.log(message);
}

function determinerAffichagePopupBienvenue(){
  var popupId = "PopupBienvenue";
  try {
    if(localStorage[popupId + "open"] == "true" || localStorage[popupId + "open"] == undefined) {
      openPopupBienvenue();
    }
  }
  catch(e) {
	  openPopupBienvenue();
  }
}

function randomOperateur() {
  var randOpIndex = Math.floor(Math.random() * territoireSelectionne.operateurs.length);
  majChoixOperateur(territoireSelectionne.operateurs[randOpIndex].MCCMNC);
}

function randomFournisseurDonneesCrowd() {
  var randFournisseurIndex = Math.floor(Math.random() * listeFournisseursCrowd.length);
  fournisseurCrowd = listeFournisseursCrowd[randFournisseurIndex].key;
  document.getElementById("autocompleteFournisseurCrowd").value = fournisseurCrowd;
  choisirFournisseurDonneesCrowd(true, false);
  
  /*
  resetAffichagePopupInfosLegende();
  afficherCouches();
  majLegendeCouverture();
  afficherLegendeCarte();
  afficherInfo();
  */
}

function afficherCouches() {
  if (map !== undefined && map.ready) {

    var multipleDisplay = false;

    setAllLayersInvisible();
    afficherInfo();
    setElInvisible("noOperatorData");
    setElInvisible("masquerMap");
    setElInvisible("noCrowdData");

    if(couvertureQoS == "couverture") {
      var layerName = [technoCarteCouverture, operateurByMCCMNC(MCCMNC).mbKey, territoireSelectionne.key].join('_');
      setLayerVisible(layerName);
      setLayerVisible(territoireSelectionne.key+"_sites");
      setSitesCouvFilter();
    } 
    else if (couvertureQoS == "QoS") {
      if (driveCrowd == "drive") var layerName = [territoireSelectionne.key, "QoS", agglosTransports, qosVoixData, fournisseur].join('_');
      if (driveCrowd == "crowd") var layerName = [territoireSelectionne.key, "crowd", qosVoixData, fournisseurCrowd].join('_');

      // Affichage multiCouches
      if (driveCrowd == "allDriveDebit") multipleDisplay = displayMultipleLayer("debit");
      else if (driveCrowd == "allDriveWeb") multipleDisplay = displayMultipleLayer("web");
      else if (driveCrowd == "allCrowdDebit") multipleDisplay = displayMultipleLayer("debit");
      else if (driveCrowd == "allCrowdWeb") multipleDisplay = displayMultipleLayer("web");

      if (multipleDisplay == false) {
        var mapLayer = map.getLayer(layerName);
        if(typeof mapLayer !== 'undefined') {
          setLayerVisible(layerName);
          setQoSFilter(layerName);
          var specialLayerName = [territoireSelectionne.key, strate , "text"].join('_');
          var specialLayer = map.getLayer(specialLayerName);
          if (typeof specialLayer !== 'undefined') {
              setLayerVisible(specialLayerName);
          }
        }
        else {
          if (fournisseurCrowd == "Pas de données de crowdsourcing disponibles") setElVisible("noCrowdData");
          else setElVisible("masquerMap");
        }
      }
    }     
  }
}
  


function initialiserActionsBoutonsMenu(){

  initialiserActionsBoutonsTerritoire(); // TERRITOIRE
  initialiserActionsBoutonsCouverture();
  initialiserActionsBoutonsQoS();
  initialiserActionsBoutonsMenuTransport();
  initialiserActionsBoutonsMenuAgglos();

  document.getElementById("logo-arcep").addEventListener("click", function(){openPopupBienvenue();} );
  document.getElementById("popupBoutonFermerBienvenue").addEventListener("click", closePopupBienvenue);
  document.body.addEventListener('click',hidePopupBienvenueOnClickOut);

  //document.getElementById("BoutonFermerPopupInfosCouvVoix").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosCouvData3G").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosCouvData3GFree").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosCouvData4G").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosCouvData5G").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosLegendeQoSSuccessRate").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosLegendeQoSBitrate").addEventListener("click", closePopupInfosCouverture);
  //document.getElementById("BoutonFermerPopupInfosComplementairesCouverture").addEventListener("click", closePopupInfosComplementaires);

  //activation clic event popup infos complementaires pour toutes les legendes
  var buttonsInfosComplementairesCouverture = document.getElementsByClassName("clicEnSavoirPlusCouv");
  Object.keys(buttonsInfosComplementairesCouverture).forEach(function(key){
    var buttonInfosComplementairesCouverture = buttonsInfosComplementairesCouverture[key];
    buttonInfosComplementairesCouverture.addEventListener("click", openPopupInfosComplementaires);
  });
}


function initialiserActionsBoutonsCouverture(){
  document.getElementById("boutonCouverture").addEventListener("click", activerMenuCouverture);
  document.getElementById("boutonCarteVoix").addEventListener("click", activerMenuCarteVoix);
  document.getElementById("boutonCarteData").addEventListener("click", activerMenuCarteData);
  document.getElementById("bouton2G").addEventListener("click", activerMenu2G);
  document.getElementById("bouton2G3G").addEventListener("click", activerMenu2G3G);
  document.getElementById("bouton3G").addEventListener("click", activerMenu3G);
  document.getElementById("bouton4G").addEventListener("click", activerMenu4G);
  document.getElementById("bouton5G").addEventListener("click", activerMenu5G);
}

function initialiserActionsBoutonsQoS(){
  document.getElementById("boutonQoS").addEventListener("click", activerMenuQoS);
  initialiserActionsBoutonsQoSArcep();
  initialiserActionsBoutonsCrowd();
}

function initialiserActionsBoutonsQoSArcep(){
  document.getElementById("boutonQoSArcep").addEventListener("click", activerMenuQoSArcep);
  initialiserActionsBoutonsQoSTransports();
  initialiserActionsBoutonsQoSAgglos();
}

function initialiserActionsBoutonsCrowd(){
  document.getElementById("boutonCrowd").addEventListener("click", activerMenuCrowd);
  document.getElementById("boutonCrowdVoixSMS").addEventListener("click", activerMenuCrowdVoixSMS);
  document.getElementById("boutonCrowdData").addEventListener("click", activerMenuCrowdData);
}

function initialiserActionsBoutonsQoSTransports(){
  document.getElementById("boutonTransports").addEventListener("click", activerMenuQoSTransports);
  document.getElementById("boutonQoSTransportsVoixSMS").addEventListener("click", activerMenuQoSTransportsVoixSMS);
  document.getElementById("boutonQoSTransportsData").addEventListener("click", activerMenuQoSTransportsData);
}

function initialiserActionsBoutonsQoSAgglos(){
  document.getElementById("boutonAgglos").addEventListener("click", activerMenuQoSAgglos);
  document.getElementById("boutonQoSAgglosVoixSMS").addEventListener("click", activerMenuQoSAgglosVoixSMS);
  document.getElementById("boutonQoSAgglosData").addEventListener("click", activerMenuQoSAgglosData);
}

function activerMenuCouverture() {
  if (boutonCouverture.status != "active") {
    couvertureQoS = "couverture";
    [boutonCarteVoix, boutonCarteData].forEach(function(bouton){unactiveButton(bouton)});
    activeButton(boutonCouverture);
    ["containerBoutonQoSOuCrowd", "containerBoutonQoSTransportsOuAgglos","ZoneGraphiquesQoSTransports","ZoneGraphiquesQoSAgglos", "ZoneAfficherCrowd","noOperatorData", "noCrowdData"].forEach(function(el){setElInvisible(el)});
    if(map !== undefined) setElInvisible("masquerMap");
    setElVisible("ZoneGraphiquesCouv");
    masquerFournisseurDonnees();
    masquerFournisseurDonneesCrowd();

    activerMenuCarteData();
  }
}

function activerMenuCarteVoix() {
  if (boutonCarteVoix.status != "active") {
    carteCouverture = "voix";
    [bouton2G,bouton2G3G].forEach(function(bouton){unactiveButton(bouton)});
    activeButton(boutonCarteVoix);

    setElVisible("ZoneGraphiquesCouvGraph");
    setElInvisible("ZoneGraphiquesSitesGraph");
    setElInvisible("notes");
    setElInvisible("noteSpeciale");
    setElInvisible("renvoiObs5G");

    //ajout sites 5G
    ["bouton3G","bouton4G", "bouton5G"].forEach(function(el){setElInvisible(el)});
    ["bouton2G","bouton2G3G"].forEach(function(el){setElVisible(el)});
    
    /* pour gérer affichage en métropole ou masquage en outremer du bouton 2G3G - à supprimer au T4 2021 et décommenter la ligne précédente
    if (territoireSelectionne.key == "metropole"){
      ["bouton2G","bouton2G3G"].forEach(function(el){setElVisible(el)});
    }
    else {
      ["bouton2G"].forEach(function(el){setElVisible(el)});
    }
    // fin gestion masque/affichage */
    activerMenu2G3G();

    afficherInfo();
    
  }
}

function activerMenuCarteData() {
  //ajout sites 5G
  var boutonCarteData = document.getElementById("boutonCarteData");
  var bouton3G = document.getElementById("bouton3G");
  var bouton4G = document.getElementById("bouton4G");
  var bouton5G = document.getElementById("bouton5G");

  if (boutonCarteData.status != "active") {
    carteCouverture = "data";
    [bouton3G,bouton4G,bouton5G].forEach(function(bouton){unactiveButton(bouton)});
    activeButton(boutonCarteData);

    setElVisible("notes");
    setElVisible("noteSpeciale");

    ["bouton2G","bouton2G3G"].forEach(function(el){setElInvisible(el)});

    // pour gérer affichage en métropole ou masquage en outremer du bouton 5G - à supprimer au T4 2021 et décommenter la ligne précédente
    if (territoireSelectionne.key == "metropole"){
      ["bouton3G","bouton4G", "bouton5G"].forEach(function(el){setElVisible(el)});
    }
    else {
      ["bouton3G","bouton4G"].forEach(function(el){setElVisible(el)});
    }
    // fin gestion masque/affichage

    activerMenu4G();

    afficherInfo();
  }
}

function activerMenu2G() {
  var bouton2G = document.getElementById("bouton2G");
  if (bouton2G.status != "active") {
    technoCarteCouverture = "2G";

    activeButton(bouton2G);
    afficherLegendeCarte();
    afficherCouches();
    majLegendeCouverture();

    afficherInfo();
    chartsGenerator();

  }
}


function activerMenu2G3G() {
  var bouton2G3G = document.getElementById("bouton2G3G");
  if (bouton2G3G.status != "active") {
    technoCarteCouverture = "2G3G";
    
    activeButton(bouton2G3G);
    afficherLegendeCarte();
    afficherCouches();
    majLegendeCouverture();

    afficherInfo();
    chartsGenerator();

  }
}

function activerMenu3G() {
  var bouton3G = document.getElementById("bouton3G");
  if (bouton3G.status != "active") {
    technoCarteCouverture = "3G";
    activeButton(bouton3G);

    setElVisible("ZoneGraphiquesCouvGraph");
    setElInvisible("ZoneGraphiquesSitesGraph");

    chartsGenerator();

    afficherLegendeCarte();
    afficherCouches();
    majLegendeCouverture();

    afficherInfo();
    afficherNoteSpeciale();

  }
}


function activerMenu4G() {
  var bouton4G = document.getElementById("bouton4G");
  if (bouton4G.status != "active") {
    technoCarteCouverture = "4G";
    activeButton(bouton4G);

    setElVisible("ZoneGraphiquesCouvGraph");
    setElInvisible("ZoneGraphiquesSitesGraph");

    chartsGenerator();

    majLegendeCouverture();
    afficherLegendeCarte();
    afficherCouches();

    afficherInfo();
    afficherNoteSpeciale();

  }
}

//ajout sites 5G
function activerMenu5G() {
  var bouton5G = document.getElementById("bouton5G");
  if (bouton5G.status != "active") {
    technoCarteCouverture = "5G";
    activeButton(bouton5G);

    setElInvisible("ZoneGraphiquesCouvGraph");
    setElVisible("ZoneGraphiquesSitesGraph");

    chartsGenerator();

    majLegendeCouverture();
    afficherLegendeCarte();
    afficherCouches();

    afficherInfo();
    afficherNoteSpeciale();

  }
}


function activerMenuQoS() {
  var boutonQoS = document.getElementById("boutonQoS");
  if (boutonQoS.status != "active") {
    activeButton(boutonQoS);
    couvertureQoS = "QoS";
    technoCarteCouverture = "";
    carteCouverture = "";

    resetAffichagePopupInfosLegende();
    setElInvisible("ZoneGraphiquesCouv");
    //[GD 18/11/2021]
    setElVisible("containerBoutonQoSOuCrowd");

    [boutonQoSArcep, boutonCrowd].forEach(function(bouton){unactiveButton(bouton)});

    activerMenuQoSArcep(); // par defaut

  }
}

function activerMenuQoSArcep() {
  var boutonQoSArcep = document.getElementById("boutonQoSArcep");
  if (boutonQoSArcep.status != "active") {
    activeButton(boutonQoSArcep);
    driveCrowd = "drive";
    afficherFournisseurDonnees();
    resetAffichagePopupInfosLegende();
    setElInvisible("ZoneAfficherCrowd");
    setElVisible("containerBoutonQoSTransportsOuAgglos");
    activerMenuQoSAgglos(); // par defaut

    afficherInfo();
  }
}

function activerMenuCrowd() {
  var boutonCrowd = document.getElementById("boutonCrowd");
  if (boutonCrowd.status != "active") {
    activeButton(boutonCrowd);
    driveCrowd = "crowd";

    afficherFournisseurDonneesCrowd();
    ["containerBoutonQoSTransportsOuAgglos", "ZoneGraphiquesQoSTransports","ZoneGraphiquesQoSAgglos"].forEach(function(el){setElInvisible(el)});
    setElVisible("ZoneAfficherCrowd");

    completerFournisseurDonneesCrowd();
    randomFournisseurDonneesCrowd();

    // Pour l'instant on masque Voix/SMS
    $("#boutonCrowdVoixSMS").css('visibility', 'hidden');

    //par défaut, on préférera afficher les informations sur la data, mais si d'aventure un fournisseur de crowd ne fournissait que des données sur le service voix/SMS, on afficher le menu voix/SMS.
    // Noter que activerMenuQoSData gérera l'affichage s'il n'y a pas de fournisseur de crowd sur le
    if (fournisseurCrowd == "Pas de données de crowdsourcing disponibles" || fournisseurCrowd == "") {
      activerMenuCrowdData();
    }
    else {
      var technosFournisseurCrowd = listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).scope[territoireSelectionne.key];
      if (technosFournisseurCrowd.indexOf("data") >-1) activerMenuCrowdData();
      else activerMenuCrowdVoixSMS();
    }
  }
}

function activerMenuCrowdVoixSMS(){
  qosVoixData = "voix";
  activeButton(boutonCrowdVoixSMS);
  resetAffichagePopupInfosLegende();
  afficherCouches();
  majLegendeCouverture();
  afficherLegendeCarte();
  afficherInfo();
}

function activerMenuCrowdData(){
  qosVoixData = "data";
  activeButton(boutonCrowdData);
  resetAffichagePopupInfosLegende();
  afficherCouches();
  majLegendeCouverture();
  afficherLegendeCarte();
  afficherInfo();
}

function afficherBoutonsQoSAgglos(){
  setElVisible("zoneSelectionSousStrateAgglos");
}

function masquerBoutonsQoSAgglos(){
  setElInvisible("zoneSelectionSousStrateAgglos");
}

function activerMenuQoSAgglos() {
    agglosTransports = "agglos";
    activeButton(boutonAgglos);
    strate = "national";
    if(territoireSelectionne.key == "metropole") {
      sousStrate = "tous";
      afficherBoutonsQoSAgglos();
      activerMenuQoSAgglosNational(); //par defaut
    } else {
      sousStrate = null;
      masquerBoutonsQoSAgglos();
    }
    setElInvisible("ZoneGraphiquesQoSTransports");
    ["ZoneGraphiquesQoSAgglos"/*, "masquerMap"*/].forEach(function(el){setElVisible(el)});
    afficherLegendeCarte();
    if (qosVoixData == "data") activerMenuQoSAgglosData();
    else if (qosVoixData == "voix") activerMenuQoSAgglosVoixSMS();
    else console.error('menu LDV non reconnu : ' + qosVoixData);
}

function activerMenuQoSAgglosVoixSMS(){
    qosVoixData = "voix";
    activeButton(boutonQoSAgglosVoixSMS);
    setElInvisible("ZoneGraphiquesQoSAgglosData");
    chartsGenerator();
    setElVisible("ZoneGraphiquesQoSAgglosVoixSMS");
    completerFournisseurDonnees();
    afficherLegendeCarte();
    majLegendeCouverture();
    afficherCouches();
}

function activerMenuQoSAgglosData(){
    activeButton(boutonQoSAgglosData);
    qosVoixData = "data";
    setElInvisible("ZoneGraphiquesQoSAgglosVoixSMS");
    chartsGenerator();
    setElVisible("ZoneGraphiquesQoSAgglosData");
    gererAffichageGraphesQoSAgglosData_Web_Video();
    completerFournisseurDonnees();
    afficherCouches();
    afficherLegendeCarte();
    majLegendeCouverture();
}

function gererAffichageGraphesQoSAgglosData_Web_Video(){
   var graphiqueQoSAgglos_Web = document.getElementById("GraphiqueQoSAgglos_Web");
    setElVisible("GraphiqueQoSAgglos_Video");
    graphiqueQoSAgglos_Web.style.marginLeft = "5px";
}

function afficherBoutonsQoSTransport(){
  setElVisible("zoneSelectionSousStrateTransport");
}

function masquerBoutonsQoSTransport(){
  setElInvisible("zoneSelectionSousStrateTransport");
}

function activerMenuQoSTransports() {
    if(territoireSelectionne.key == "metropole") {
      unactiveButton(boutonRoutes);
      afficherBoutonsQoSTransport();
      activerMenuQoSTransportsRoutes(); // par defaut
    }
    else {
      strate = "transport";
      sousStrate = null;
      masquerBoutonsQoSTransport();
      completerFournisseurDonnees();
    }
    agglosTransports = "transports";
    activeButton(boutonTransports);
    setElInvisible("ZoneGraphiquesQoSAgglos");
    if(map !== undefined) setElInvisible("masquerMap");
    setElVisible("ZoneGraphiquesQoSTransports");
    if (qosVoixData == "data") activerMenuQoSTransportsData();
    else if (qosVoixData == "voix") activerMenuQoSTransportsVoixSMS();
    else console.error('menu transports non reconnu :' + qosVoixData );
}

function activerMenuQoSTransportsVoixSMS() {
  if (!boutonQoSTransportsVoixSMS.classList.contains("disabled")) {
    activeButton(boutonQoSTransportsVoixSMS);
    qosVoixData = "voix";
    if(territoireSelectionne.key == "metropole"){
        var hold = sousStrate;
       createDataList(strate);
       sousStrate = holdAutocompleteValue(hold);
       setElInvisible("ZoneSelectionQoSTransportsSousStrateData");
       setElVisible("ZoneSelectionQoSTransportsSousStrateVoixSMS");
    }
    setElInvisible("ZoneGraphiquesQoSTransportsData");
    completerFournisseurDonnees();
    chartsGenerator();
    setElVisible("ZoneGraphiquesQoSTransportsVoixSMS");
    afficherLegendeCarte();
    afficherCouches();
    majLegendeCouverture();
  }
}

function activerMenuQoSTransportsData() {
  if (!boutonQoSTransportsData.classList.contains("disabled")) {
    activeButton(boutonQoSTransportsData);
    qosVoixData = "data";
    if(territoireSelectionne.key == "metropole") {
      createDataList(strate);
      sousStrate = holdAutocompleteValue(sousStrate);
      setElInvisible("ZoneSelectionQoSTransportsSousStrateVoixSMS");
      setElVisible("ZoneSelectionQoSTransportsSousStrateData");
    }
    setElInvisible("ZoneGraphiquesQoSTransportsVoixSMS");
    completerFournisseurDonnees();
    chartsGenerator();
    setElVisible("ZoneGraphiquesQoSTransportsData");
    afficherLegendeCarte();
    afficherCouches();
    majLegendeCouverture();
  }
}

function holdAutocompleteValue(value) {
  if (value == "tous" || value == "") return "tous";
  var sousListeVoies;
  if (qosVoixData == "data") {
    sousListeVoies = listeVoies.data;
  } else if (qosVoixData == "voix") {
    sousListeVoies = listeVoies.voix;
  }

  var listeStrateTransports = determinerListeStrateTransports(strate, sousListeVoies);
  for(var i=0; i < listeStrateTransports.length ; i++){
    var transportPourStrate = listeStrateTransports[i];
    if (value == transportPourStrate.key) {
      document.getElementById("autocompleteRouteData").value = transportPourStrate.value;
      document.getElementById("autocompleteRouteVoix").value = transportPourStrate.value;
      return transportPourStrate.key;
    }
  }

  document.getElementById("autocompleteRouteData").value = "";
  document.getElementById("autocompleteRouteVoix").value = "";
  return "tous";
}

function openPopupBienvenue(){

  displayEmphaseNewMask();

  var popupId = "PopupBienvenue";
  openPopup(popupId);
  try {
    localStorage[popupId + "open"] = "true";
  } catch(e) {console.log(e)}
}

function hidePopupBienvenueOnClickOut(e){
  var popupId = "PopupBienvenue";

  var popupBienvenue = document.getElementById(popupId);
  if(popupBienvenue.style.display === "none" || ["logo-arcep", popupId].indexOf(e.target.id) >= 0 || isElementSubNodeOfParentNode(e.target, popupBienvenue)) return;
  setElInvisible(popupId);

  hideEmphaseNewMask();
  try {
    localStorage[popupId + "open"] = false;
  } catch(e) {console.log(e)}
}

function isElementSubNodeOfParentNode(element, parentNode){
  var currentNode = element;
  while(currentNode != document.body){
    if(currentNode == parentNode) return true;
    currentNode = currentNode.parentNode;
  }
  return false;
}

function closePopupBienvenue(e){
  closePopup(e);
  var popupId = e.target.parentNode.id;

  hideEmphaseNewMask()
	try {
    localStorage[popupId + "open"] = false;
  } catch(e) {console.log(e)}
}

function openPopupInfosLegendeCouvVoix(){
  if (boutonInfosCouvVoix.status != "active") {
    noPopup = false;
    setElVisible("PopupInfosLegendeCouvVoix");
  }
}

function openPopupInfosLegendeCouvData3G(){
  if (boutonInfosCouvData3G.status != "active") {
    noPopup = false;
    if (MCCMNC == operateurs.free_metropole.MCCMNC) setElVisible("PopupInfosLegendeCouvData3GFree");
    else setElVisible("PopupInfosLegendeCouvData3G");
  }
}

function openPopupInfosLegendeQoSSuccessRate() {
  if (boutonInfosQoSSuccessRate.status != "active") {
    noPopup = false;
    setElVisible("PopupInfosLegendeQoSSuccessRate");
  }
}

function openPopupInfosLegendeQoSSuccessRateSMS() {
  if (boutonInfosQoSSuccessRateSMS.status != "active") {
    noPopup = false;
    setElVisible("PopupInfosLegendeQoSSuccessRateSMS");
  }
}

function openPopupInfosLegendeQoSBitrate() {
  if (boutonInfosQoSBitrate.status != "active") {
    noPopup = false;
    setElVisible("PopupInfosLegendeQoSBitrate");
  }
}

function openPopupInfosLegendeCouvData4G(){
  if (boutonInfosCouvData4G.status != "active") {
    noPopup = false;
    setElVisible("PopupInfosLegendeCouvData4G");
  }
}

//ajout sites 5G
function openPopupInfosLegendeCouvData5G(){
  if (boutonInfosCouvData5G.status != "active") {
    noPopup = false;
    setElVisible("PopupInfosLegendeCouvData5G");
  }
}

function closePopupInfosCouverture(e){
  closePopup(e);
  noPopup = true;
}

function openPopupInfosComplementaires(){
  var popupId = "PopupInfosInfosComplementairesCouverture";
  openPopup(popupId);
}

function closePopupInfosComplementaires(e){
  closePopup(e);
}

function openPopup(popupId){
  setElVisible(popupId);
}

function closePopup(e) {
  setElInvisible(e.target.parentNode.id);
}

function hideEmphaseNewMask() {
  if (emphaseNew != false && emphaseNew != undefined) {
	  setElInvisible("emphaseNewMask") ;
	  document.getElementById(emphaseNew).style.zIndex = 20 ;
	  if (document.getElementById(emphaseNew).classList != undefined)
		  document.getElementById(emphaseNew).classList.remove("emphased-button");
  }
}
function displayEmphaseNewMask() {
  if (emphaseNew != false && emphaseNew != undefined) {
    setElVisible("emphaseNewMask") ;
    document.getElementById(emphaseNew).style.zIndex = 2500 ;

	if (emphaseNew == "boutonSelectionTerritoire")
		toggleMenuTerritoires();

    if (document.getElementById(emphaseNew).classList != undefined)
      document.getElementById(emphaseNew).classList.add("emphased-button");
  }
}

function initialiserActionsBoutonsMenuAgglos(){
  document.getElementById("boutonNational").addEventListener("click", activerMenuQoSAgglosNational);
  document.getElementById("boutonTouristique").addEventListener("click", activerMenuTouristique);
  //document.getElementById("boutonTouristique").disabled = true;
  //document.getElementById("boutonTouristique").style.visibility = "hidden";
  document.getElementById("boutonDense").addEventListener("click", activerMenuDense);
  document.getElementById("boutonIntermediaire").addEventListener("click", activerMenuIntermediaire);
  document.getElementById("boutonRural").addEventListener("click", activerMenuRural);
}

function activerMenuQoSAgglosLDVGenerique(boutonStrate, nouvelleStrate){
  if(boutonStrate.status != "active") {
    activeButton(boutonStrate);
    strate = nouvelleStrate;
    sousStrate = "tous";
    document.getElementById("typeMesuresAgglos").selectedIndex = 0;
    chartsGenerator();
    document.getElementById("boutonQoSTransportsData").classList.remove('disabled');
    document.getElementById("boutonQoSTransportsVoixSMS").classList.remove('disabled');
    completerFournisseurDonnees();
    afficherCouches();
    majLegendeCouverture();
    afficherLegendeCarte();
  }
}

function activerMenuQoSAgglosNational() {
  activerMenuQoSAgglosLDVGenerique(boutonNational, "national");
}

function activerMenuTouristique() {
  activerMenuQoSAgglosLDVGenerique(boutonTouristique, "touristique");
}

function activerMenuDense() {
  activerMenuQoSAgglosLDVGenerique(boutonDense, "dense");
}

function activerMenuIntermediaire() {
  activerMenuQoSAgglosLDVGenerique(boutonIntermediaire, "intermediaire");
}

function activerMenuRural() {
  activerMenuQoSAgglosLDVGenerique(boutonRural, "rurale");
}

function initialiserActionsBoutonsMenuTransport(){
  document.getElementById("boutonRoutes").addEventListener("click", activerMenuQoSTransportsRoutes);
  document.getElementById("boutonTGV").addEventListener("click", activerMenuQoSTransportsTGV);
  // Décommenter les 2 lignes suivantes pour remettre les boutons TER et RER
  document.getElementById("boutonIntercites_TER").addEventListener("click", activerMenuQoSTransportsIntercites_TER);
  document.getElementById("boutonRER_Transiliens").addEventListener("click", activerMenuQoSTransportsRER_Transiliens);
  document.getElementById("boutonMetros").addEventListener("click", activerMenuQoSTransportsMetros);
  // commenter les 6 lignes suivantes pour remettre les boutons TER et RER
  //document.getElementById("boutonIntercites_TER").disabled = true;
  //document.getElementById("boutonRER_Transiliens").disabled = true;
  //document.getElementById("boutonMetros").disabled = true;
  //document.getElementById("boutonIntercites_TER").style.visibility = "hidden";
  //document.getElementById("boutonRER_Transiliens").style.visibility = "hidden";
  //document.getElementById("boutonMetros").style.visibility = "hidden";

}

function activerMenuQoSTransportsGenerique(boutonStrate, nouvelleStrate){
  if (boutonStrate.status != "active") {
    activeButton(boutonStrate);
    strate = nouvelleStrate;
    sousStrate = "tous";
    createDataList(strate);
    chartsGenerator();
    document.getElementById("boutonQoSTransportsData").classList.remove('disabled');
    document.getElementById("boutonQoSTransportsVoixSMS").classList.remove('disabled');
    completerFournisseurDonnees();
    afficherCouches();
    majLegendeCouverture();
    afficherLegendeCarte();
  }
}

function activerMenuQoSTransportsRoutes() {
  activerMenuQoSTransportsGenerique(boutonRoutes, "routes");
}

function activerMenuQoSTransportsTGV() {
  activerMenuQoSTransportsGenerique(boutonTGV, "tgv");
}

function activerMenuQoSTransportsIntercites_TER() {
  activerMenuQoSTransportsGenerique(boutonIntercites_TER, "intercites_ter");
}

function activerMenuQoSTransportsRER_Transiliens() {
  activerMenuQoSTransportsGenerique(boutonRER_Transiliens, "rer_transiliens");
}

function activerMenuQoSTransportsMetros() {
  activerMenuQoSTransportsGenerique(boutonMetros, "metros");
}

function metrosVillesFilter(ville) {
  if(ville == "lille") return ["in", "sous_strate", "lille_ligne_1", "lille_ligne_2"];
  else if (ville == "lyon") return ["in", "sous_strate", "lyon_ligne_a", "lyon_ligne_b", "lyon_ligne_c", "lyon_ligne_d"];
  else if (ville == "marseille") return ["in", "sous_strate", "marseille_ligne_1", "marseille_ligne_2"];
  else if (ville == "paris") return ["in", "sous_strate", "paris_ligne_1", "paris_ligne_2", "paris_ligne_3", "paris_ligne_3_bis", "paris_ligne_4", "paris_ligne_5", "paris_ligne_6", "paris_ligne_7", "paris_ligne_7_bis", "paris_ligne_8", "paris_ligne_9", "paris_ligne_10", "paris_ligne_11", "paris_ligne_12", "paris_ligne_13", "paris_ligne_14"];
  else if (ville == "toulouse") return ["in", "sous_strate", "toulouse_ligne_a", "toulouse_ligne_b"];
}


function setQoSFilter(layerId) {
  if (map == undefined || !map.ready || !map.style.getLayer(layerId)) return;

  var filters = ["all"] ;
  var filter_mcc_mnc = ["==", "mcc_mnc", MCCMNC];
  var filterStrate = ["==", "strate", strate];

  var villes = ["lille", "lyon", "marseille", "paris", "toulouse"].indexOf(sousStrate)>-1;
  var filterSousStrate = (villes)?metrosVillesFilter(sousStrate):["==", "sous_strate", sousStrate];

  filters.push(filter_mcc_mnc);

  if(driveCrowd == "drive"){
    if (strate != "transport" && strate != "national") {
      filters.push(filterStrate);
    }

    if (sousStrate != "tous" && sousStrate != null)
      filters.push(filterSousStrate);
  }

  map.setFilter(layerId, filters);
}

function setSitesCouvFilter() {
  var layer = territoireSelectionne.key+"_sites";
  if (!map.ready || !map.style.getLayer(layer)) return;
  map.setFilter(layer, ["all", ["==", "Operateur", MCCMNC], ["==", "C"+technoCarteCouverture, 1]]);
  //ajout sites 5G - permettre d'afficher les sites 5G à un zoom plus éloigné que les sites 2G/3G/4G
  if (technoCarteCouverture == "5G") map.setLayerZoomRange(layer, 8, 22);
  else map.setLayerZoomRange(layer, 10, 22);
}

function majLegendeCouverture() {
  if(map === undefined) return;
    resetAffichagePopupInfosLegende();
  /*if ((window.innerWidth < 600 || (window.innerWidth < 1100 & window.innerWidth > 910) || window.innerHeight < 600) & !noPopup) {
    noPopup = true;
  }*/
  if (!noPopup) {
    if (couvertureQoS == "couverture" && carteCouverture == "data") {
      if (technoCarteCouverture == "3G") {
        if (MCCMNC == operateurs.free_metropole.MCCMNC) setElVisible("PopupInfosLegendeCouvData3GFree");
        else setElVisible("PopupInfosLegendeCouvData3G");
      }
      else if (technoCarteCouverture == "4G") setElVisible("PopupInfosLegendeCouvData4G");
      //ajout sites 5G
      else if (technoCarteCouverture == "5G") setElVisible("PopupInfosLegendeCouvData5G")
    } 
    else if (couvertureQoS == "couverture") {
      setElVisible("PopupInfosLegendeCouvVoix");
    } 
    else if (couvertureQoS == "QoS" && document.getElementById("boutonInfosQoSSuccessRate") != undefined) {
      setElVisible("PopupInfosLegendeQoSSuccessRate");
    }
    else if (couvertureQoS == "QoS" && document.getElementById("boutonInfosQoSSuccessRateSMS") != undefined) {
      setElVisible("PopupInfosLegendeQoSSuccessRateSMS");
    }
    else if (couvertureQoS == "QoS" && document.getElementById("boutonInfosQoSBitrate") != undefined) {
      setElVisible("PopupInfosLegendeQoSBitrate");
    }
    
  }
}

//ajout sites 5G
function getTechnosInstalleesSite(C2G, C3G, C4G, C5G700, C5G2100, C5G3500) {
  var technos = [];
  if (C2G) technos.push("2G");
  if (C3G) technos.push("3G");
  if (C4G) technos.push("4G");
  if (C5G700) technos.push("5G 700 MHz");
  if (C5G2100) technos.push("5G 2100 MHz");
  if (C5G3500) technos.push("5G 3500 MHz");

  if (technos != null) return technos.join("/");
}

function openAside() {
  document.getElementsByTagName("aside")[0].style.transform = "translate(0px)";
  var tmp = document.getElementsByClassName("mapboxgl-ctrl");
  for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.display = "none";}

  document.getElementById("toggleHUD").textContent = "❰";
  document.getElementById("toggleHUD").style.left = '280px';
  document.getElementById("toggleHUD").style.borderRadius = '0px 5px 5px 0px';

  var tmp = document.getElementsByClassName("bouton-selection-territoire");
  for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.transform = "translate(0px)";}
  var tmp = document.getElementsByClassName("bouton-selection-territoires");
  for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.transform = "translate(0px)";}

  $('#tarteaucitronIcon').css('display','none');
}


function closeAside() {
  document.getElementsByTagName("aside")[0].style.transform = "translate(-285px)";
  var tmp = document.getElementsByClassName("mapboxgl-ctrl");
  for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.display = "block";}

  document.getElementById("toggleHUD").textContent = '☰';
  document.getElementById("toggleHUD").style.left = '5px';
  document.getElementById("toggleHUD").style.borderRadius = '5px 5px 5px 5px';

  var tmp = document.getElementsByClassName("bouton-selection-territoire");
  for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.transform = "translate(-282px)";}
  var tmp = document.getElementsByClassName("bouton-selection-territoires");
  for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.transform = "translate(-280px)";}

  $('#tarteaucitronIcon').css('display','block');
}

document.getElementById("toggleHUD").addEventListener('click', function () {
  if (this.style.left == "" || this.style.left == "5px")
    openAside();
  else
    closeAside();
});

["map", "PopupInfosLegendeCouvVoix", "PopupInfosLegendeCouvData3G",
"PopupInfosLegendeCouvData3GFree", "PopupInfosLegendeCouvData4G",
"PopupInfosLegendeCouvData5G", "PopupInfosInfosComplementairesCouverture",
"PopupInfosLegendeQoSSuccessRate","PopupInfosLegendeQoSSuccessRateSMS","PopupInfosLegendeQoSBitrate"].forEach(
  function(e) {
    document.getElementById(e).addEventListener('click', function () {
      if (document.getElementById("toggleHUD").style.left == "280px")
        closeAside();
    });
  }
)



window.addEventListener('resize', function () {
  if (document.documentElement.clientWidth > 910) {

    document.getElementsByTagName("aside")[0].style.transform = "translate(0px)";

    var tmp = document.getElementsByClassName("mapboxgl-ctrl");
    for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.display = "block";}

  } else {
    closeAside();
  }
});

document.getElementById("autocompleteRouteData").addEventListener("change", getSelectedRoute);
document.getElementById("autocompleteRouteVoix").addEventListener("change", getSelectedRoute);
document.getElementById("autocompleteFournisseur").addEventListener("change", choisirFournisseurDonnees);
document.getElementById("autocompleteFournisseurCrowd").addEventListener("change", choisirFournisseurDonneesCrowd);
document.getElementById("typeMesuresAgglos").addEventListener("change", getSelectedType);

function createDataList(strateTransports) {
  var selectEl;
  var listeVoiesCourante;
  if (qosVoixData == "data") {
    removeAllChildForSelector("autocompleteRouteData");
    if(strateTransports == "transport") return;
    selectEl = document.getElementById("autocompleteRouteData");
    listeVoiesCourante = listeVoies.data;
  } else if (qosVoixData == "voix") {
    removeAllChildForSelector("autocompleteRouteVoix");
    if(strateTransports == "transport") return;
    selectEl = document.getElementById("autocompleteRouteVoix");
    listeVoiesCourante = listeVoies.voix;
  }

  if(listeVoiesCourante != null) ajouterSousStrates(strateTransports, listeVoiesCourante, selectEl);
}

function ajouterSousStrates(strateTransports, listeVoiesCourante, selectEl){
  var listeStrateTransports = determinerListeStrateTransports(strateTransports,listeVoiesCourante);
      listeStrateTransports.forEach(function(transportPourStrate){
        selectEl.appendChild(createHtmlOption(transportPourStrate.value));
    });
}

function createHtmlOption(text, value){
  if (value === undefined) value = text;
  var newOption = document.createElement("option");
  newOption.value = value;
  newOption.innerText = text;
  return newOption;
}

function determinerListeStrateTransports(strateTransports, obj){
  var listeStrateTransports;
  if(strateTransports == "routes") listeStrateTransports = obj.routes;
  else if (strateTransports == "tgv") listeStrateTransports = obj.tgv;
  else if (strateTransports == "metros") listeStrateTransports = obj.metros;
  else if (strateTransports == "rer_transiliens") listeStrateTransports = obj.rer_transiliens;
  else if (strateTransports == "intercites_ter") listeStrateTransports = obj.intercites_ter;
  return listeStrateTransports;
}

function removeAllChildForSelector(selector) {
  var node = document.getElementById(selector);
  if(node != null) removeAllChildOfNode(node);
}

function removeAllChildOfNode(node){
  while (node.firstChild) node.removeChild(node.firstChild);
}

function getSelectedType() {
  sousStrate = document.getElementById("typeMesuresAgglos").value;
  afficherCouches();
  chartsGenerator();
  afficherInfo();
}

function getSelectedRoute() {
  var transportSelectionne;
  var listeVoiesCourante;
  var technoNonSelectionnee;
  if (qosVoixData == "data" && document.getElementById("autocompleteRouteData").value !== "") {
    transportSelectionne = document.getElementById("autocompleteRouteData").value;
    listeVoiesCourante = listeVoies.data;
    technoNonSelectionnee = "voix";
  } else if (qosVoixData == "voix" && document.getElementById("autocompleteRouteVoix").value !== "") {
    transportSelectionne = document.getElementById("autocompleteRouteVoix").value;
    listeVoiesCourante = listeVoies.voix;
    technoNonSelectionnee = "data";
  }
  // liste des transports pour la strate selectionnée : metros / TGV / routes / ter / rer
  var listeStrateTransports = determinerListeStrateTransports(strate,listeVoiesCourante);
  // permet de récuperer la clé du transport définie dans data-liste-voies.js, afin de retrouver les données correspondantes dans data-graph.js
  determinerSousStrateTransport(transportSelectionne, listeStrateTransports);

  var layerName = [territoireSelectionne.key, "QoS", agglosTransports, qosVoixData, fournisseur].join('_');
  chartsGenerator();
  setQoSFilter(layerName);
  actualiserBoutonsTechnos(technoNonSelectionnee);
}

function determinerSousStrateTransport(transportSelectionne, listeStrateTransports){
  listeStrateTransports.forEach(function(transportPourStrate){
    if (transportSelectionne == transportPourStrate.value) sousStrate = transportPourStrate.key;
  });
}

function actualiserBoutonsTechnos(technoNonSelectionnee){
  var symetrie = false;
  if (fournisseur != "arcep")
    symetrie = listeFournisseurs.findByProperty("key", fournisseur).scope[[territoireSelectionne.key, agglosTransports, strate].join("_")].length == 2;
  else if (listeVoies[technoNonSelectionnee][strate] != undefined)
    listeVoies[technoNonSelectionnee][strate].forEach(function(transportPourStrate){
      if (transportPourStrate.key == sousStrate) symetrie = true;
    });
  else if (territoireSelectionne.key != "metropole" || agglosTransports == "agglos")
    symetrie = true;
  if (agglosTransports == "transports") {
    if (symetrie == false) {
      if (technoNonSelectionnee == "voix") {
        document.getElementById("boutonQoSTransportsVoixSMS").classList.add('disabled');
      }
      else if (technoNonSelectionnee == "data") {
        document.getElementById("boutonQoSTransportsData").classList.add('disabled');
      }
    } else {
      document.getElementById("boutonQoSTransportsVoixSMS").classList.remove('disabled');
      document.getElementById("boutonQoSTransportsData").classList.remove('disabled');
    }
  } else {
    if (symetrie == false) {
      if (technoNonSelectionnee == "voix") document.getElementById("boutonQoSAgglosVoixSMS").classList.add('disabled');
      else if (technoNonSelectionnee == "data") document.getElementById("boutonQoSAgglosData").classList.add('disabled');
    } else {
      document.getElementById("boutonQoSAgglosVoixSMS").classList.remove('disabled');
      document.getElementById("boutonQoSAgglosData").classList.remove('disabled');
    }
  }
}

function actualiserBoutonsTechnosCrowd(technoSelectionnee){
  // on cahce les boutons des technos qui ne sont pas disponibles chez le fournisseur de données de crowd
  if (fournisseurCrowd == "Pas de données de crowdsourcing disponibles" || fournisseurCrowd == "") {
    document.getElementById("boutonCrowdVoixSMS").style.visibility = "hidden";
    document.getElementById("boutonCrowdData").style.visibility = "hidden";
  }
  else {
    var technosFournisseurCrowd = listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).scope[territoireSelectionne.key];
    document.getElementById("boutonCrowdVoixSMS").style.visibility = "visible";
    document.getElementById("boutonCrowdData").style.visibility = "visible";
    if (technosFournisseurCrowd.indexOf("voix") == -1) document.getElementById("boutonCrowdVoixSMS").style.visibility = "hidden";
    if (technosFournisseurCrowd.indexOf("data") == -1) document.getElementById("boutonCrowdData").style.visibility = "hidden";
    //si la seule techno disponible chez le fournisseur n'est pas celle sur laquelle on était, on bascule
    if (technosFournisseurCrowd.indexOf(technoSelectionnee) == -1 && (technosFournisseurCrowd.indexOf("voix")*technosFournisseurCrowd.indexOf("data")) <=0){
      if (technoSelectionnee == "voix") activerMenuCrowdData();
      if (technoSelectionnee == "data") activerMenuCrowdVoixSMS();
    }
  }
}


function activeButton(value) {
  [].forEach.call(value.parentElement.getElementsByClassName("boutonType1"), function(bouton){unactiveButton(bouton)});
  value.className = value.className + " active";
  value.querySelector(".selectLight").className = "selectLight active";
  value.status = "active";
}

function unactiveButton(value) {
  value.querySelector(".selectLight").classList.remove("active");
  value.classList.remove("active");
  value.status = "unactive";
}

function addMbSource(sourceId) {
  if (map === undefined || map.addSource === undefined) return;
  if (map.getSource(sourceId) != null) return -1;

  if (sourceId == "point") {
    map.addSource('point', {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    });
  }
  else {
    var mbSource = mbData.sources[mbData.sourcesHashTable[sourceId]];
    if (mbSource.type == "composite") {
      addMbCompositeSources(mbSource.id, mbSource.sources)
    }
    else {
      map.addSource(mbSource.id, {
        type: mbSource.type,
        url: mbSource.url
      });
    }
  }
}

function addMbCompositeSources(compositeSourceId, sourcesId){
  if (map === undefined) return;
  if (map.getSource(compositeSourceId) != null) return -1;
  var compositeSource;
  var sourceUrlPrefix = "mapbox://";

  sourcesId.forEach(function(sourceId) {
    if (map.getSource(sourceId) != null) return -1;

    var mbSource = mbData.sources[mbData.sourcesHashTable[sourceId]];
    if (compositeSource == undefined) {
      compositeSource = {
        type : mbSource.type,
        url : mbSource.url
      };
    } else if(compositeSource.type == mbSource.type){
      compositeSource.url += "," + mbSource.url.substring(sourceUrlPrefix.length);
    }
  });
  map.addSource(compositeSourceId,compositeSource);
}

function addMbLayer(value) {
  if(map === undefined) return;

  if (value.indexOf("_text") !== -1) addTextLayer(value);
  else if (value == "point") addPointLayer();
  else if (value.indexOf("_sites") !== -1) addSitesLayer(value);
  else if (value.indexOf("QoS") != -1 || value.indexOf("crowd") != -1) addQoSLayer(value);
  else addLayerCouverture(value); //Layers Couverture 2G, 3G, 4G
}

function addLayerCouverture(value){
  if (map.addLayer === undefined) return;

  var mbLayer = mbData.layers[mbData.layersHashTable[value]];
  if (map.getSource(mbLayer.source) == null)
    addMbSource(mbLayer.source);

  map.addLayer({
    "id": mbLayer.id,
    "type": mbLayer.type,
    "source": mbLayer.source,
    "source-layer": mbLayer.sourceLayer,
    "paint": {
      "fill-color": mbLayer.paint.fillColor,
      "fill-opacity": mbLayer.paint.fillOpacity,
      "fill-outline-color": mbLayer.paint.fillOutlineColor,
    },
    "layout": {
      "visibility": "none"
    }
  }, "place_label_other");
}

function addPointLayer(){
  if (map.getSource("point") == null)
    addMbSource("point");
  map.addLayer({
    "id": "point",
    "source": "point",
    "type": "circle",
    "paint": {
      "circle-radius": 10,
      "circle-color": "#4c4c4c",
      "circle-opacity": 0.7
    }
  });
}

function addSitesLayer(id){
  var mbLayer = mbData.layers[mbData.layersHashTable[id]];
  if (map.getSource(mbLayer.source) == null)
    addMbSource(mbLayer.source);

  map.addLayer({
    "id": mbLayer.id,
    "type": "symbol",
    "minzoom": 10,
    "source": mbLayer.source,
    "source-layer": mbLayer.sourceLayer,
    "layout": {
      "visibility": "none",
      "icon-image": ["case",
        //ajout sites 5G
        ["==",['get', 'C5G3500'], 1], "antenne5G_3500",
        ["==",['get', 'C5G2100'], 1], "antenne5G_2100",
        ["==",['get', 'C5G700'], 1], "antenne5G_700",
        ["==",['get', 'C4G'], 1], "antenne4G",
        ["==",['get', 'C3G'], 1], "antenne3G",
        "antenne2G"],
        //pour afficher en priorité les sites en 3,5 GHz
        "symbol-sort-key": ["case",
        ["==",['get', 'C5G3500'], 1], 0,
        ["==",['get', 'C5G2100'], 1], 1,
        ["==",['get', 'C5G700'], 1], 2,
        ["==",['get', 'C4G'], 1], 3,
        ["==",['get', 'C3G'], 1], 4,
        5]
 
    },
  });
}

function addTextLayer(id){
  var mbLayer = mbData.layers[mbData.layersHashTable[id]];
  if (map.getSource(mbLayer.source) == null)
    addMbSource(mbLayer.source);

  map.addLayer({
    "id": mbLayer.id,
    "type": "symbol",
    "source": mbLayer.source,
    "source-layer": mbLayer.sourceLayer,
    "layout": {
      "visibility": "none",
      "icon-image": ["concat", ["get", "icon"], "-15"],
      "text-field": ["get", "nom"],
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": 0.5,
      "text-font":["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-justify": "auto",
      "text-size": {
        'base': 13,
        'stops': [
          [5, 13],
          [7, 14],
          [10, 16]
        ],
      },
      "text-padding": 4
    },
    "paint": {
      "text-color": "#6D2D1A",
      "text-halo-color": "#FFF",
      "text-halo-width": 1
    }
  }, "country_label_1");
}

function addQoSLayer(id){
  var mbLayer = mbData.layers[mbData.layersHashTable[id]];

  if (map.getSource(mbLayer.source) == null)
    addMbSource(mbLayer.source);

  var coloringScheme;

  if (mbLayer.typeBilan == "numeric")
    coloringScheme = {
      property: 'bilan',
      type: 'interval',
      stops: [
        [successRateThreshold[0], '#d82727'],
        [successRateThreshold[1], '#8AE300'],
        [successRateThreshold[2], '#3b913b']
      ]
    }
   else if (mbLayer.typeBilan == "continuous")
    coloringScheme = {
      property: 'bilan',
      type: 'interval',
      stops: [
        [bitrateThresholdExtended[0], '#E99787'],
        [bitrateThresholdExtended[1], '#F9E68F'],
        [bitrateThresholdExtended[2], '#A8DEAC'],
        [bitrateThresholdExtended[3], '#6C96CD'],
        [bitrateThresholdExtended[4], '#6771B4']
      ]
    }  
  else
    coloringScheme = {
      property: 'bilan',
      type: 'categorical',
      stops: [
        ["KO", '#d82727'],
        ["NOK", '#d82727'],
        ["OK", '#3b913b'],
        ["ECHEC-HR", '#d82727'],
        ["2G", '#d82727'],
        ["3G", '#8AE300'],
        ["4G", '#3b913b']
      ]
    }

  map.addLayer({
    "id": mbLayer.id,
    "type": "circle",
    "source": mbLayer.source,
    "source-layer": mbLayer.sourceLayer,
    "layout": {
      "visibility": "none",
    },
    'paint': {
      'circle-radius': {
        'base': 2.5,
        'stops': [
          [4, 2.5],
          [12, 8],
          [15, 10]
        ],
      },
      "circle-blur": 0.1,
      'circle-color': coloringScheme,
      "circle-opacity": 0.8
    }
  });
}

function setLayerVisible(layer) {
  if(map === undefined || !map.style.getLayer(layer)) return;
  if (layersVisible.indexOf(layer) == -1) {
    map.setLayoutProperty(layer, "visibility", "visible");
    layersVisible.push(layer);
  }
}

function setLayerInvisible(layer) {
  if(map === undefined || !map.style.getLayer(layer)) return;
  map.setLayoutProperty(layer, "visibility", "none");
  removeFromArray(layersVisible, layer);
}

function setAllLayersInvisible() {
  while (layersVisible.length > 0) {
    setLayerInvisible(layersVisible[0]);
  }
}

function setElVisible(value) {
  var element = document.getElementById(value);
  if(element != undefined) element.style.display = "block";
}

function setElInvisible(value) {
  var element = document.getElementById(value);
  if(element != undefined) element.style.display = "none";
}

function removeFromArray(array, value) {
  var index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
  }
}

function resetAffichagePopupInfosLegende() {
  ["PopupInfosLegendeCouvVoix","PopupInfosLegendeCouvData3G", "PopupInfosLegendeQoSSuccessRate","PopupInfosLegendeQoSSuccessRateSMS","PopupInfosLegendeQoSBitrate", "PopupInfosLegendeCouvData3GFree","PopupInfosLegendeCouvData4G", "PopupInfosLegendeCouvData5G","PopupInfosInfosComplementairesCouverture"].forEach(function(el){setElInvisible(el)});
}

function afficherInfo() {
  // [NF 27/04/2022]
  // --------------------------------------------------------------
  // Lien vers la page sur le calendrier des publications de l'UCIM
  var linkCalendrierPublication = "https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/calendrier-de-publication-des-documents-statistiques-de-larcep.html#c27617";
  // Dates : Campagne de QoS Metropole - format mmmm aaaa : minuscules
  var startQoSMetro = "avril 2021";
  var endQoSMetro = "septembre 2021";
  // Dates : Campagne de QoS Outremer - format mmmm aaaa : minuscules
  var startQoSOutremer = "octobre 2021";
  var endQoSOutremer = "décembre 2021";
  // Dates : Simulation des cartes de couverture - format mmmm aaaa : minuscules
  var dateSimulationMap4G = "31 décembre 2021";
  var dateSimulationMap2G3G = "31 décembre 2021";
  // Dates : Emplacements des sites 5G - format mmmm aaaa : minuscules
  var date5G = "31 décembre 2021";
  // Infos 
  var info5G = "Sites ouverts commercialement uniquement. Informations fournies par les opérateurs.";
  var infoMap = "Cartes de couverture 2G, 3G, 4G fournies par les opérateurs.";
  // var infoMap = "Cartes de couverture 2G, 3G simulées au 30/06/2021, carte de couverture 4G simulée au 30/09/2021, fournies par les opérateurs.";
  var infoCampagne = "Performances mesurées par l’Arcep avec des terminaux 2G/3G/4G.";
  // --------------------------------------------------------------

  var infoTxt = document.getElementById("infoTxt");
  var info = "Information de publication";

  if(territoireSelectionne.key == "metropole"){
    if (couvertureQoS == "couverture") {
      if (technoCarteCouverture == "5G") {
        info = info5G;
        $(".date-start-5G-site").text(date5G);
      }
      else {
        info = infoMap;
      
        //update date
        $(".date-start-4G").text(dateSimulationMap4G);
        $(".date-start-2G").text(dateSimulationMap2G3G);
        $(".date-start-3G").text(dateSimulationMap2G3G);
      }
    }
    else if (couvertureQoS == "QoS") {
      if(driveCrowd =="drive") {
        if (fournisseur == "arcep") {
          info = infoCampagne;

          //update date
          $(".date-start-voice").text(startQoSMetro);
          $(".date-end-voice").text(endQoSMetro);
          $(".date-start-web").text(startQoSMetro);
          $(".date-end-web").text(endQoSMetro);
        }
        else {
          info = listeFournisseurs.findByProperty("key", fournisseur).info;

          //update date
          $(".date-start-voice").text(listeFournisseurs.findByProperty("key", fournisseur).date_start);
          $(".date-end-voice").text(listeFournisseurs.findByProperty("key", fournisseur).date_end);
          $(".date-start-web").text(listeFournisseurs.findByProperty("key", fournisseur).date_start);
          $(".date-end-web").text(listeFournisseurs.findByProperty("key", fournisseur).date_end);
          $(".date-start-debit").text(listeFournisseurs.findByProperty("key", fournisseur).date_start);
          $(".date-end-debit").text(listeFournisseurs.findByProperty("key", fournisseur).date_end);
        }
      }
      else if (driveCrowd =="crowd") {
        var fournisseurCrowdInfo = listeFournisseursCrowd.findByProperty("key", fournisseurCrowd)

        if (fournisseurCrowdInfo != null) info = fournisseurCrowdInfo.info;
        else info = "Aucune donnée de crowdsourcing pour ce territoire";

        //update date
        if (listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start != null && listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end != null) {
          $(".date-start-voice").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start);
          $(".date-end-voice").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end);
          $(".date-start-web").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start);
          $(".date-end-web").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end);
          $(".date-start-debit").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start);
          $(".date-end-debit").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end);
        }

        // Ajout du lien vers le site du fournisseur
        var siteSection = document.createElement('span');
        var link = document.createElement('a');
        if (fournisseurCrowdInfo.fournisseur_link != null) {
          siteSection.textContent = "Le site du fournisseur de ces données est disponible : ";
          link.textContent = "ici";
          link.setAttribute('href', fournisseurCrowdInfo.fournisseur_link);
          link.setAttribute('target', '_blank');
        }
        else {
          siteSection.textContent = "Le site commercial du fournisseur de ces données ne nous a pas été communiqué.";
        }
        siteSection.setAttribute('class', 'link-section-crowd');
        siteSection.append(link);
      }
    }

    $(".date-link").attr("href",linkCalendrierPublication);
    
  }
  // Outre-mer
  else {
    if (couvertureQoS == "couverture") {
      info = "Cartes de couverture 2G, 3G, 4G simulées au 31/12/2021, fournies par les opérateurs.";
      // info = "Cartes de couverture 2G, 3G simulées au 30/06/2021, carte de couverture 4G simulée au 30/09/2021, fournies par les opérateurs.";

      //update date
      $(".date-start-4G").text(dateSimulationMap4G);
      $(".date-start-2G").text(dateSimulationMap2G3G);
      $(".date-start-3G").text(dateSimulationMap2G3G);
    } 
    else if (couvertureQoS == "QoS") {
      if(driveCrowd =="drive") {
        if (fournisseur == "arcep") {
          info = "Performances mesurées par l’Arcep d'octobre à décembre 2021, avec des terminaux compatibles 4G.";

          //update date
          $(".date-start-voice").text(startQoSOutremer);
          $(".date-end-voice").text(endQoSOutremer);
          $(".date-start-web").text(startQoSOutremer);
          $(".date-end-web").text(endQoSOutremer);
        }
        else info = listeFournisseurs.findByProperty("key", fournisseur).info;
      }
      else if (driveCrowd =="crowd") {
        var fournisseurCrowdInfo = listeFournisseursCrowd.findByProperty("key", fournisseurCrowd)
        if (fournisseurCrowdInfo != null) info = fournisseurCrowdInfo.info;
        else info = "Aucune donnée de crowdsourcing pour ce territoire";

        //update date
        if (listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start != null && listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end != null) {
          $(".date-start-voice").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start);
          $(".date-end-voice").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end);
          $(".date-start-web").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start);
          $(".date-end-web").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end);
          $(".date-start-debit").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_start);
          $(".date-end-debit").text(listeFournisseursCrowd.findByProperty("key", fournisseurCrowd).date_end);
        }
      }
    }
  }
  
  infoTxt.textContent = info;
  if (siteSection) infoTxt.append(siteSection);
  

  // Pas de gestion de l'exploration de la date la plus ancienne et de la plus récente parmi l'ensemble des mesures de crowd
  if (driveCrowd =="allDriveDebit" || driveCrowd =="allDriveWeb" || driveCrowd =="allCrowdDebit" || driveCrowd =="allCrowdWeb") {
    $(".date-start-voice").text("-");
    $(".date-end-voice").text("-");
    $(".date-start-web").text("-");
    $(".date-end-web").text("-");
    $(".date-start-debit").text("-");
    $(".date-end-debit").text("-");
  }
}

//ajout sites 5G
function afficherNoteSpeciale() {
  var noteSpeciale = document.getElementById("noteSpeciale");
  var info = "";
  if (technoCarteCouverture == "3G" || technoCarteCouverture == "4G") {
    info = "Les cartes du service Internet mobile en 3G et 4G sont binaires (couvert/non couvert). La présentation de cartes à plusieurs niveaux fera l'objet de travaux complémentaires.";
    setElInvisible("renvoiObs5G");
  }
  else if (technoCarteCouverture == "5G") {
    info = "Concernant la 5G, seuls les sites ouverts commercialement sont représentés et comptabilisés. Lorsqu'un site est équipé de plusieurs bandes de fréquences en 5G, il est comptabilisé uniquement dans la catégorie de la plus haute bande de fréquences (par exemple, un site équipé en 3,5 GHz et 700 mhz sera comptabilisé uniquement parmi les sites 3,5 GHz). La présentation de cartes de couverture prenant en compte la 5G fera l'objet de travaux complémentaires." ;
    setElVisible("renvoiObs5G");
  }
  noteSpeciale.textContent = info;
}
//fin ajout sites 5G

function afficherLegendeCarte() {
  if (couvertureQoS == "couverture") {
    if (carteCouverture == "voix") afficherLegendeCarteCouvVoix();
    else if (carteCouverture == "data") afficherLegendeCarteCouvData();
  } else if (couvertureQoS == "QoS") {
    actualiserMenuSelectionOperateurs();
    if (agglosTransports == "transports") afficherLegendeCarteQoSTransport();
    else if(agglosTransports == 'agglos') afficherLegendeCarteQoSAgglos();
    else if(driveCrowd == "crowd") afficherLegendeCarteQoSAgglos();
  }
}

// MODIFIED : [20/10]
function actualiserMenuSelectionOperateurs(){

  var listeSelectionOperateurs = document.getElementById('operatorsButtonsContainer');
  removeAllChildOfNode(listeSelectionOperateurs);
  territoireSelectionne.operateurs.forEach(function(operateur){

    var radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.id = 'radioButtonSelectionOperateur' + operateur.MCCMNC;
    radioButton.name = 'radioButtonSelectionOperateur' + operateur.MCCMNC;
    radioButton.addEventListener('change', function(){ majChoixOperateur(operateur.MCCMNC)});
    radioButton.checked = (MCCMNC == operateur.MCCMNC) ? true : false;
    radioButton.style.display = "none";
    radioButton.className = "radioButtonForOperatorSelection";

    var logoOperateur = document.createElement('img');
    logoOperateur.alt = "Logo " + operateur.label;
    logoOperateur.src = operateur.logo.url;
    logoOperateur.className = "logo";

    var light = document.createElement('div');
    light.className = "selectLight";

    var labelOp = document.createElement('label');
    labelOp.className = "boutonType1 operator";
    
    labelOp.appendChild(logoOperateur);
    labelOp.appendChild(light);
    labelOp.appendChild(radioButton);

    listeSelectionOperateurs.appendChild(labelOp);
    switchOperatorButtonLight();
  });
}

function actualiserBlocLegendeSelectionOperateur(legendes, boutonInfosId, onClickCallBack){
  var blocLegendeSelectionOperateur = document.getElementById('blocLegendeSelectionOperateur');
  removeAllChildOfNode(blocLegendeSelectionOperateur);

  legendes.forEach(function(legende){
    var legendeSousDiv = document.createElement('div');
    legendeSousDiv.style.height = '8px';
    legendeSousDiv.style.width = "8px";
    legendeSousDiv.style.border = "1px solid #CECECE";
    legendeSousDiv.style.margin = "5px 5px 5px 10px";
    legendeSousDiv.style.backgroundColor = legende.backgroundColor;
    legendeSousDiv.style.opacity = legende.opacity;
    legendeSousDiv.style.float = "left";

    var legendeTexte = document.createTextNode(legende.text);

    var legendeDiv = document.createElement('div');
    legendeDiv.style.color = "#000000";
    legendeDiv.style.fontSize = "11px";
    legendeDiv.style.float = "left";
    legendeDiv.appendChild(legendeSousDiv);
    legendeDiv.appendChild(legendeTexte);

    blocLegendeSelectionOperateur.appendChild(legendeDiv);
  });

  if(boutonInfosId != null && onClickCallBack != null){
    var boutonInfos = document.createElement('div');
    boutonInfos.id = boutonInfosId;
    boutonInfos.style.margin = '0px 0px 0px 5px';
    boutonInfos.innerHTML = 'i';
    boutonInfos.addEventListener('click', function(){onClickCallBack()});
    blocLegendeSelectionOperateur.appendChild(boutonInfos);
  }
}

function afficherLegendeCarteCouvVoix() {
  var entete = document.getElementById('enteteSelectionOperateur');
  entete.innerHTML = 'Couverture voix et SMS';
  actualiserMenuSelectionOperateurs();
  var legendes = [
    { backgroundColor : '#d82424', opacity : 0.7, text : 'Très bonne' },
    { backgroundColor : "#e36565", opacity : 0.6, text : 'Bonne' },
    { backgroundColor : "#efa7a7", opacity : 0.5, text : 'Limitée' },
  ];
  actualiserBlocLegendeSelectionOperateur(legendes, 'boutonInfosCouvVoix', openPopupInfosLegendeCouvVoix);
}

function afficherLegendeCarteCouvData(){
  var entete = document.getElementById('enteteSelectionOperateur');
  //ajout sites 5G
  if (technoCarteCouverture == '5G') entete.innerHTML = 'Emplacement des sites 5G';
  else entete.innerHTML = 'Couverture Internet mobile';
  actualiserMenuSelectionOperateurs();

  if(technoCarteCouverture == '3G') afficherLegendeCarteCouv3G();
  else if (technoCarteCouverture == '4G') afficherLegendeCarteCouv4G();
  else if (technoCarteCouverture == '5G') afficherLegendeCarteCouv5G();
}

function afficherLegendeCarteCouv3G() {
  var legendes = [
    { backgroundColor : "#e36565", opacity : 0.5, text : "3G"},
  ];
  if(territoireSelectionne.key == "metropole") legendes.push({ backgroundColor : "#efa7a7", opacity : 0.4, text : "3G bridée à 384 kbit/s (Free)"});

  actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosCouvData3G", openPopupInfosLegendeCouvData3G);
}
function afficherLegendeCarteCouv4G() {
  var legendes = [
    { backgroundColor : "#e36565", opacity : 0.5, text : "4G" }
  ];

  actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosCouvData4G", openPopupInfosLegendeCouvData4G);
}

//ajout sites 5G
function afficherLegendeCarteCouv5G() {
  //par défaut, legendes doit contenir une backgroundcolor, une opacity et un text (elle affiche un carré avec backgroundcolor/opacity et un texte à côté). En laissant vide, on n'affichera rien d'autre que le bouton d'information (qui permet d'afficher la légende)
  var legendes = [];
  actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosCouvData5G", openPopupInfosLegendeCouvData5G);
}

function afficherLegendeCarteQoSTransport(){
  if(qosVoixData == "data") afficherLegendeCarteQoSData();
  else if (qosVoixData == "voix") afficherLegendeCarteQoSVoix();
}

function afficherLegendeCarteQoSAgglos(){
  if(qosVoixData == "data") afficherLegendeCarteQoSData();
  else if (qosVoixData == "voix") afficherLegendeCarteQoSVoix();
}

function afficherLegendeCarteQoSData(){
  var entete = document.getElementById('enteteSelectionOperateur');
  removeAllChildOfNode(entete);
  var layerName = "";
  if (driveCrowd=="drive") layerName = [territoireSelectionne.key, "QoS", agglosTransports, qosVoixData, fournisseur].join('_');
  else if (driveCrowd=="crowd") layerName = [territoireSelectionne.key, "crowd", qosVoixData, fournisseurCrowd].join('_');

  if (mbData.layersHashTable[layerName] !== undefined && mbData.layers[mbData.layersHashTable[layerName]].typeBilan == "numeric") {
    var legendes = [
      { backgroundColor : "#d82727", opacity : 1, text : "Échec" },
      { backgroundColor : "#6eb500", opacity : 1, text : "Succès part." },
      { backgroundColor : "#267521", opacity : 1, text : "Succès" }
    ];
    entete.appendChild(document.createTextNode("Navigation Web"));
    var spanEntete = document.createElement('span');
    spanEntete.style.fontSize = "9px";
    spanEntete.innerHTML = " (chargement &lt;10s d’une page)";
    entete.appendChild(spanEntete);
    resetAffichagePopupInfosLegende();
    //openPopupInfosLegendeQoSSuccessRate();
    setElVisible("PopupInfosLegendeQoSSuccessRate");
    actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosQoSSuccessRate", openPopupInfosLegendeQoSSuccessRate);
  } 
  else if ((mbData.layersHashTable[layerName] !== undefined && mbData.layers[mbData.layersHashTable[layerName]].typeBilan == "continuous") || driveCrowd=="allDriveDebit" || driveCrowd=="allCrowdDebit") {
    var legendes = [
      { backgroundColor : "#d82727", opacity : 1, text : "0" },
      { backgroundColor : "#ebe727", opacity : 1, text : "0-1" },
      { backgroundColor : "#6eb500", opacity : 1, text : "1-3" },
      { backgroundColor : "#267521", opacity : 1, text : "3+" }
    ];
    entete.appendChild(document.createTextNode("Débits descendants (Mbit/s)"));
    resetAffichagePopupInfosLegende();
    //openPopupInfosLegendeQoSBitrate();
    setElVisible("PopupInfosLegendeQoSBitrate");
    actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosQoSBitrate", openPopupInfosLegendeQoSBitrate);
  }
  else {
    var legendes = [
      { backgroundColor : "#d82727", opacity : 1, text : "Échec" },
      { backgroundColor : "#267521", opacity : 1, text : "Succès" }
    ];
    entete.appendChild(document.createTextNode("Navigation Web"));
    var spanEntete = document.createElement('span');
    spanEntete.style.fontSize = "9px";
    spanEntete.innerHTML = " (chargement &lt;10s d’une page)";
    entete.appendChild(spanEntete);
    resetAffichagePopupInfosLegende();
    actualiserBlocLegendeSelectionOperateur(legendes, null, null);
  }
}

function afficherLegendeCarteQoSVoix() {
  var entete = document.getElementById('enteteSelectionOperateur');
  removeAllChildOfNode(entete);
  entete.appendChild(document.createTextNode("Voix et SMS"));
  var spanEntete = document.createElement('span');
  spanEntete.style.fontSize = "9px";
  spanEntete.innerHTML = " (appels de 2 min et SMS reçus &lt;10s)";
  entete.appendChild(spanEntete);
  
  if (driveCrowd=="drive") layerName = [territoireSelectionne.key, "QoS", agglosTransports, qosVoixData, fournisseur].join('_');
  else if (driveCrowd=="crowd") layerName = [territoireSelectionne.key, "crowd", qosVoixData, fournisseurCrowd].join('_');

  if (driveCrowd=="allDriveWeb" || driveCrowd=="allCrowdWeb") {
    var legendes = [
      { backgroundColor : "#d82727", opacity : 1, text : "Échec" },
      { backgroundColor : "#6eb500", opacity : 1, text : "Succès part." },
      { backgroundColor : "#267521", opacity : 1, text : "Succès" }
    ];
    resetAffichagePopupInfosLegende();
    //openPopupInfosLegendeQoSSuccessRate();
    setElVisible("PopupInfosLegendeQoSSuccessRate");
    actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosQoSSuccessRate", openPopupInfosLegendeQoSSuccessRate);
  }
  else if (mbData.layersHashTable[layerName] !== undefined && mbData.layers[mbData.layersHashTable[layerName]].typeBilan == "numeric") {
    var legendes = [
      { backgroundColor : "#d82727", opacity : 1, text : "Échec" },
      { backgroundColor : "#6eb500", opacity : 1, text : "Succès part." },
      { backgroundColor : "#267521", opacity : 1, text : "Succès" }
    ];
    resetAffichagePopupInfosLegende();
    //openPopupInfosLegendeQoSSuccessRate();
    setElVisible("PopupInfosLegendeQoSSuccessRate");
    actualiserBlocLegendeSelectionOperateur(legendes, "boutonInfosQoSSuccessRate", openPopupInfosLegendeQoSSuccessRate);
  }
  else {
    var legendes = [
      { backgroundColor : "#d82727", opacity : 1, text : "Échec" },
      { backgroundColor : "#267521", opacity : 1, text : "Succès" }
    ];
    resetAffichagePopupInfosLegende();
    actualiserBlocLegendeSelectionOperateur(legendes, null, null);
  }
}

function majChoixOperateur(value) {
  resetChoixOperateurs();
  MCCMNC = value;

  territoireSelectionne.operateurs.forEach(function(operateur){
    if(MCCMNC == operateur.MCCMNC) {
      setRadioChecked("radioButtonSelectionOperateur"+operateur.MCCMNC);
    }
  });

  afficherCouches();
  majLegendeCouverture();
  switchOperatorButtonLight();
}

function resetChoixOperateurs() {
  territoireSelectionne.operateurs.forEach(function(operateur){
    setRadioUnchecked("radioButtonSelectionOperateur"+operateur.MCCMNC);
  });
}

function setRadioChecked(elId) {
  var el = document.getElementById(elId);
  if(el != undefined) el.checked = true;
}

function setRadioUnchecked(elId) {
  var el = document.getElementById(elId);
  if(el != undefined) el.checked = false;
}


function selectionBoutonTerritoire(boutonSelectionne){
    var nouveauTerritoireSelectionne = territoires.findByProperty('value', boutonSelectionne.title);
    selectionTerritoire(nouveauTerritoireSelectionne);
}

function selectionTerritoire(nouveauTerritoireSelectionne){
    if(territoireSelectionne != null && territoireSelectionne.key == nouveauTerritoireSelectionne.key) return;

    document.getElementById('imgLogoTerritoire').src = nouveauTerritoireSelectionne.logo;

    territoireSelectionne = nouveauTerritoireSelectionne;

    if(nouveauTerritoireSelectionne.key != "metropole"){
      if(couvertureQoS == "QoS"){
        if(agglosTransports == "transports") {
          strate = "transport";
          sousStrate = null;
          masquerBoutonsQoSTransport();
          document.getElementById("boutonQoSTransportsVoixSMS").classList.remove('disabled');
          document.getElementById("boutonQoSTransportsData").classList.remove('disabled');
        } else if (agglosTransports == "agglos"){
          strate = "national";
          masquerBoutonsQoSAgglos();
          if(qosVoixData == "data"){
            gererAffichageGraphesQoSAgglosData_Web_Video();
          }
        }
        if (driveCrowd == "drive" || driveCrowd =="allDriveDebit" || driveCrowd =="allDriveWeb") completerFournisseurDonnees();
        else if (driveCrowd=="crowd" || driveCrowd =="allCrowdDebit" || driveCrowd =="allCrowdWeb") completerFournisseurDonneesCrowd();

      }
      //pour gérer affichage en métropole ou masquage en outremer du bouton 5G - à supprimer quand 5G lancée en outremer
      if (couvertureQoS == "couverture"){
        if (carteCouverture == "data"){
          ["bouton3G", "bouton4G"].forEach(function(el){setElVisible(el)});
          ["bouton5G"].forEach(function(el){setElInvisible(el)});
          activerMenu4G();
        }
      } 
      // fin gestion masque/affichage
    } else if (nouveauTerritoireSelectionne.key == "metropole"){
      if(couvertureQoS == "QoS"){
        if(agglosTransports == "transports") {
          strate = "routes";
          sousStrate = "tous";
          activeButton(boutonRoutes);
          afficherBoutonsQoSTransport();
          createDataList(strate);
          sousStrate = holdAutocompleteValue(sousStrate);
          if(qosVoixData == "voix") {
            setElInvisible("ZoneSelectionQoSTransportsSousStrateData");
            setElVisible("ZoneSelectionQoSTransportsSousStrateVoixSMS");
          } else if (qosVoixData == "data"){
            setElInvisible("ZoneSelectionQoSTransportsSousStrateVoixSMS");
            setElVisible("ZoneSelectionQoSTransportsSousStrateData");
          }
        } else if (agglosTransports == "agglos"){
          afficherBoutonsQoSAgglos();
          strate = "national";
          sousStrate = "tous";
          activeButton(boutonNational);
          if(qosVoixData == "data") {
            gererAffichageGraphesQoSAgglosData_Web_Video();
          }
        }
        if (driveCrowd == "drive") completerFournisseurDonnees();
        else if (driveCrowd=="crowd") completerFournisseurDonneesCrowd();

      }
      //pour gérer affichage en métropole ou masquage en outremer du bouton 5G - à supprimer quand 5G lancée en outremer
      if (couvertureQoS == "couverture") {
        if (carteCouverture == "data"){
          ["bouton3G", "bouton4G", "bouton5G"].forEach(function(el){setElVisible(el)});
        }
      }
      // fin gestion masque/affichage
    }

    majMap(territoireSelectionne); // actualise le fond de carte
    randomOperateur();

    majLegendeCouv();
    afficherLegendeCarte();
    afficherInfo();
    majLegendeCouverture();
    chartsGenerator();
}

function majLegendeCouv(){
  Array.prototype.forEach.call(document.getElementsByClassName('legendeCouv'), function(legendeCouv){
    removeAllChildOfNode(legendeCouv);
    territoireSelectionne.operateurs.forEach(function(operateur){
      var legendeOperateur = document.createElement('span');
      legendeOperateur.style.color = operateur.couleurs.defaut;
      legendeOperateur.innerText = operateur.label;
      legendeCouv.appendChild(legendeOperateur);
    });
  });
}

function majMap(nouveauTerritoireSelectionne){
    if(map === undefined || map.setMaxBounds == null) return;
    var mapConfigs = nouveauTerritoireSelectionne.map;
    map.setMaxBounds(mapConfigs.maxBounds);
    map.jumpTo({center:mapConfigs.center});
    map.setZoom(calculerZoom(mapConfigs.zoom));
}

function calculerZoom(zoomInitial){
  if(zoomInitial.constructor === Array){
     if(window.innerWidth > 700 && window.innerHeight > 700) return zoomInitial[0];
     else return zoomInitial[1];
   } else return zoomInitial;
}

function initialiserActionsBoutonsTerritoire(){

    document.getElementById("boutonSelectionTerritoire").addEventListener("click", toggleMenuTerritoires);
    document.getElementById("selectLightTerritoire").addEventListener("click", toggleMenuTerritoires);
    document.body.addEventListener('click',hideBoutonsSelectionTerritoiresOnClickOut);
    Array.prototype.forEach.call(document.getElementsByClassName("bouton-selection-territoires"), function(boutonSelection){
        boutonSelection.addEventListener("click", function(event){
            selectionBoutonTerritoire(boutonSelection);
        });
        boutonSelection.style.display = 'block';
    });
	if (document.getElementById("presentationTerritoires") == undefined) return;
	Array.prototype.forEach.call(document.getElementById("presentationTerritoires").getElementsByTagName("img"), function(boutonSelection){
        boutonSelection.addEventListener("click", function(event){
			document.getElementById("popupBoutonFermerBienvenue").click();
            selectionBoutonTerritoire(boutonSelection);
        });
        boutonSelection.style.display = 'block';
    });
}

function masquerFournisseurDonnees() {
  document.getElementById("fournisseurDonnées").style.visibility = "hidden";
}

function masquerFournisseurDonneesCrowd() {
  document.getElementById("fournisseurDonnéesCrowd").style.visibility = "hidden";
}

function afficherFournisseurDonnees() {
  if (listeFournisseurs.length>0)
    document.getElementById("fournisseurDonnées").style.visibility = "visible";
}

function afficherFournisseurDonneesCrowd() {
  if (listeFournisseursCrowd.length>0)
    document.getElementById("fournisseurDonnéesCrowd").style.visibility = "visible";
}

function completerFournisseurDonnees() {
  removeAllChildForSelector("autocompleteFournisseur");

  var select = document.getElementById("autocompleteFournisseur");
  var bounce = select.disabled;

  //var i = 0;

  var option = document.createElement('option');
  var keepFournisseur = (fournisseur=="arcep"); //cette variable sert à conserver l'information de la présence du même fournisseur lors d'un changement de territoire ou de strate QoS. Si le fournisseur est présent sur le territoire/strate d'origine et d'arrivée, alors keepFournisseur vaudra true.
  option.value = "arcep";
  option.textContent = "Données Arcep";
  select.appendChild(option);
  select.disabled = true;

  listeFournisseurs.forEach(function(f) {
    var keys = Object.keys(f.scope);
    for (var j = 0; j < keys.length ; j++) {
      if (keys[j] == [territoireSelectionne.key, agglosTransports, strate].join("_") && f.scope[keys[j]].indexOf(qosVoixData)>-1) {
        select.disabled = false;
        var option = document.createElement('option');
        option.value = f.key;
        if (f.key == fournisseur)
          keepFournisseur = true;
        option.textContent = "Données " + f.nom;
        select.appendChild(option);
      }
    }
  });

  // Afficher toutes les mesures de débit
  var optionAll = document.createElement('option');
  optionAll.value = "allDriveDebit";
  optionAll.textContent = "Afficher toutes les mesures de débit";
  select.appendChild(optionAll);

  // Afficher toutes les mesures de test web
  var optionAll = document.createElement('option');
  optionAll.value = "allDriveWeb";
  optionAll.textContent = "Afficher tous les tests web";
  select.appendChild(optionAll);

  if (keepFournisseur)
    select.value = fournisseur;
  else
    fournisseur = select.value;

  if (bounce && !select.disabled) {
    select.parentNode.classList.add("bounce");
    window.setTimeout(function(){select.parentNode.classList.remove("bounce")}, 1100)
  }

  choisirFournisseurDonnees(false, keepFournisseur);
}

function completerFournisseurDonneesCrowd() {
  removeAllChildForSelector("autocompleteFournisseurCrowd");

  var select = document.getElementById("autocompleteFournisseurCrowd");
  var bounce = select.disabled;
   

  keepFournisseurCrowd = false;
  select.disabled = true;
  //var i = 0;
  /* pas de données crowdssourcées Arcep
  var option = document.createElement('option');
  var keepFournisseur = (fournisseur=="arcep");
  option.value = "arcep";
  option.textContent = "Données Arcep";
  select.appendChild(option);
  select.disabled = true;
  */

  listeFournisseursCrowd.forEach(function(f) {
    var keys = Object.keys(f.scope);
    for (var j = 0; j < keys.length ; j++) {
      if (keys[j] == territoireSelectionne.key) {
        select.disabled = false;
        var option = document.createElement('option');
        option.value = f.key;
        if (f.key == fournisseurCrowd) keepFournisseurCrowd = true;
        option.textContent = "Données " + f.nom;
        select.appendChild(option);
      }
    }
  });

  // Afficher toutes les mesures de débit
  var optionAll = document.createElement('option');
  optionAll.value = "allCrowdDebit";
  optionAll.textContent = "Afficher toutes les mesures de débit";
  select.appendChild(optionAll);

  // Afficher toutes les mesures de test web
  var optionAll = document.createElement('option');
  optionAll.value = "allCrowdWeb";
  optionAll.textContent = "Afficher tous les tests web";
  select.appendChild(optionAll);

  if (keepFournisseurCrowd)
    select.value = fournisseurCrowd;
  else
    fournisseurCrowd = select.value;

  if (bounce && !select.disabled) {
    select.parentNode.classList.add("bounce");
    window.setTimeout(function(){select.parentNode.classList.remove("bounce")}, 1100)
  }
  
  //cas où on n'a ajouté aucun fournisseur de données de crowd
  if (select.disabled) {
    var option = document.createElement('option');
      option.textContent = "Pas de données de crowdsourcing disponibles";
    select.appendChild(option);
  }

  choisirFournisseurDonneesCrowd(false, keepFournisseurCrowd);
}

function choisirFournisseurDonnees(refresh, keepFournisseur) {
  var metropole = true;
  $("#infoTxt").css('display','table');
  if (refresh == undefined) refresh = true;
  if (keepFournisseur == undefined) keepFournisseur = false;
  var select = document.getElementById("autocompleteFournisseur");
  fournisseur = select.value;
  driveCrowd = "drive";

  if (territoireSelectionne.key == "metropole") {
    if (!keepFournisseur) {
      sousStrate = "tous";
      document.getElementById('autocompleteRouteData').selectedIndex = 0;
      document.getElementById('autocompleteRouteVoix').selectedIndex = 0;
      document.getElementById('typeMesuresAgglos').selectedIndex = 0;
    }
  } else {
    sousStrate = null;
    metropole = false;
  }
  if (select.value == "arcep") {
    document.getElementById('autocompleteRouteData').disabled = false;
    document.getElementById('autocompleteRouteVoix').disabled = false;
    document.getElementById('typeMesuresAgglos').disabled = false;
    document.getElementById('ZoneGraphiquesQoSTransportsData').style.opacity = 1;
    document.getElementById('ZoneGraphiquesQoSTransportsVoixSMS').style.opacity = 1;
    document.getElementById('ZoneGraphiquesQoSAgglosData').style.opacity = 1;
    document.getElementById('ZoneGraphiquesQoSAgglosVoixSMS').style.opacity = 1;
    document.getElementById('ZoneGraphiquesQoSTransports').getElementsByClassName('legendeCouv')[0].style.opacity = 1;
    document.getElementById('ZoneGraphiquesQoSAgglos').getElementsByClassName('legendeCouv')[0].style.opacity = 1;

    //ajout pour gérer la disparition du disclaimer sur les données tierces
    if (qosVoixData == "data") {
      setElVisible("ZoneGraphiquesQoSTransportsData");
      setElVisible("ZoneGraphiquesQoSAgglosData");
    } else {
      setElVisible("ZoneGraphiquesQoSTransportsVoixSMS");
      setElVisible("ZoneGraphiquesQoSAgglosVoixSMS");
    }
    
    setElInvisible("ZoneDisclaimerAgglos");
    setElInvisible("ZoneDisclaimerTransports");
    //fin de l'ajout

    // On demasque Voix/SMS
    $("#boutonQoSAgglosVoixSMS").css('visibility', 'visible');
  } 
  else {
    document.getElementById('autocompleteRouteData').disabled = true;
    document.getElementById('autocompleteRouteVoix').disabled = true;
    document.getElementById('typeMesuresAgglos').disabled = true;
    document.getElementById('ZoneGraphiquesQoSTransportsData').style.opacity = 0;
    document.getElementById('ZoneGraphiquesQoSTransportsVoixSMS').style.opacity = 0;
    document.getElementById('ZoneGraphiquesQoSAgglosData').style.opacity = 0;
    document.getElementById('ZoneGraphiquesQoSAgglosVoixSMS').style.opacity = 0;
    document.getElementById('ZoneGraphiquesQoSTransports').getElementsByClassName('legendeCouv')[0].style.opacity = 0;
    document.getElementById('ZoneGraphiquesQoSAgglos').getElementsByClassName('legendeCouv')[0].style.opacity = 0;

    //ajout pour gérer l'apparition du disclaimer sur les données tierces
    setElInvisible("ZoneGraphiquesQoSTransportsData");
    setElInvisible("ZoneGraphiquesQoSTransportsVoixSMS");
    setElInvisible("ZoneGraphiquesQoSAgglosData");
    setElInvisible("ZoneGraphiquesQoSAgglosVoixSMS");

    setElVisible("ZoneDisclaimerAgglos");
    setElVisible("ZoneDisclaimerTransports");
    //fin de l'ajout

    // On masque Voix/SMS
    $("#boutonQoSAgglosVoixSMS").css('visibility', 'hidden');
  }

  if (select.value == "allDriveDebit" && metropole == true) {
    driveCrowd = "allDriveDebit";
    afficherCouches();
    afficherLegendeCarteQoSData();
    refresh = false;
  }
  else if (select.value == "allDriveWeb" && metropole == true) {
    driveCrowd = "allDriveWeb";
    afficherCouches();  
    afficherLegendeCarteQoSVoix();
    refresh = false;
  }
  else if (metropole == false) {
    setElVisible("masquerMap");
    $("#infoTxt").css('display','table');
  }

  if (refresh) {
    resetAffichagePopupInfosLegende();
    afficherCouches();
    majLegendeCouverture();
    afficherLegendeCarte();
    afficherInfo();
  }
}

function choisirFournisseurDonneesCrowd(refresh, keepFournisseurCrowd) {
  $("#infoTxt").css('display','table');
  if (refresh == undefined) refresh = true;
  if (keepFournisseurCrowd == undefined) keepFournisseurCrowd = false;
  var select = document.getElementById("autocompleteFournisseurCrowd");
  fournisseurCrowd = select.value;
  driveCrowd = "crowd";

  //Affichage toutes les mesures de débit
  if (select.value == "allCrowdDebit") {
    driveCrowd = "allCrowdDebit";
    afficherCouches();
    afficherLegendeCarteQoSData();
    refresh = false;
  }
  else if (select.value == "allCrowdWeb") {
    driveCrowd = "allCrowdWeb";
    afficherCouches();  
    afficherLegendeCarteQoSVoix();
    refresh = false;
  }
  
  if (refresh) {
    resetAffichagePopupInfosLegende();
    afficherCouches();
    majLegendeCouverture();
    afficherLegendeCarte();
    afficherInfo();
  }
  //actualiserBoutonsTechnosCrowd(qosVoixData);
}

function hideBoutonsSelectionTerritoiresOnClickOut(e){
    if(["boutonSelectionTerritoire", "imgLogoTerritoire"].indexOf(e.target.id)<0){
        var tmp = document.getElementsByClassName("bouton-selection-territoires");
        for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.display = "none";}
    }
}

function toggleMenuTerritoires(){
    if(document.getElementById("boutonSelectionTerritoireMetropole").style.display !== "block"){
      var tmp = document.getElementsByClassName("bouton-selection-territoires");
      for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.display = "block";}
    } else {
      var tmp = document.getElementsByClassName("bouton-selection-territoires");
      for(var i = 0 ; i < tmp.length ; i++) {tmp[i].style.display = "none";}
    }
}


function devinerTerritoire() {
  user_time_zone = moment.tz.guess();

  if (user_time_zone == "Europe/Paris" || moment.tz("Europe/Paris").format("Z") ==  moment.tz(user_time_zone).format("Z"))
    return "metropole";

  if (user_time_zone == "America/Cayenne" || moment.tz("America/Cayenne").format("Z") ==  moment.tz(user_time_zone).format("Z"))
    return "guyane";

  if (user_time_zone == "America/Guadeloupe")
      return "guadeloupe";

  if (user_time_zone == "America/Martinique")
      return "martinique";

  if (user_time_zone == "America/St_Barthelemy")
      return "martinique";

  if (moment.tz("America/Guadeloupe").format("Z") ==  moment.tz(user_time_zone).format("Z"))
      return (Math.random() > 0.5)? "martinique" : "guadeloupe";

  if (user_time_zone == "Indian/Reunion" || moment.tz("Indian/Reunion").format("Z") ==  moment.tz(user_time_zone).format("Z"))
      return "la_reunion";

  if (user_time_zone == "Indian/Mayotte" || moment.tz("Indian/Mayotte").format("Z") ==  moment.tz(user_time_zone).format("Z"))
      return "mayotte";

  return "metropole";

}

function switchOperatorButtonLight () {
  $(".radioButtonForOperatorSelection").parent().removeClass("active");
  $(".radioButtonForOperatorSelection").prev(".selectLight").removeClass("active");

  $(".radioButtonForOperatorSelection:checked").parent().addClass("active");
  $(".radioButtonForOperatorSelection:checked").prev(".selectLight").addClass("active");
}

function showLegendeContainer() {
  $('#legendeContainer').children().css('transform','scale(1)');
  //$('#legendeContainer').fadeIn(500);
}

function hideLegendeContainer() {
  $('#legendeContainer').children().css('transform','scale(0)');
  //$('#legendeContainer').fadeOut(500);
}

function showInfoComplementaire () {
  $("#PopupInfosInfosComplementairesCouverture").css('transform','scale(1)');
}

function hideInfoComplementaire  () {
  $("#PopupInfosInfosComplementairesCouverture").css('transform','scale(0)');
}

function updateLegendeSMS () {
  $("#PopupInfosLegendeQoSSuccessRate .titleLegende").html("Voix et SMS");
  $("#PopupInfosLegendeQoSSuccessRate .underTitleLegende").html("Appels de 2 min et SMS reçus en < 10s");
  //$("#PopupInfosLegendeQoSSuccessRate .partialSuccess").hide();
}

function updateLegendeData () {
  $("#PopupInfosLegendeQoSSuccessRate .titleLegende").html("Navigation Web");
  $("#PopupInfosLegendeQoSSuccessRate .underTitleLegende").html("Chargement d’une page en moins de 10s");
  //$("#PopupInfosLegendeQoSSuccessRate .partialSuccess").show();
}

function displayMultipleLayer(typeOfTests) {

  var info = "Les mesures affichées sont issues de l'agrégation des données des fournisseurs : ";
  var listDebitFournisseur = document.createElement('ul');
  var nameListFournisseur = [];

  if (typeOfTests == "debit") {
    if (driveCrowd == "allDriveDebit") {

      listeFournisseurs.forEach(function(f) {
        // Browse all download metrics
        if (f.metric_type == "download") {
          
          var layerName = [territoireSelectionne.key, "QoS", agglosTransports, qosVoixData, f.key].join('_');
          setLayerVisible(layerName);
          setQoSFilter(layerName);

          if (!nameListFournisseur.includes(f.fournisseur)) {
            var elementList = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', f.fournisseur_link);
            link.setAttribute('target', '_blank');
            link.innerHTML = f.fournisseur;
            elementList.append(link);
            listDebitFournisseur.append(elementList);
  
            nameListFournisseur.push(f.fournisseur);
          }
        }
      });

      hideMapIfNoData(nameListFournisseur);
    }
    else if (driveCrowd == "allCrowdDebit") {

      listeFournisseursCrowd.forEach(function(f) {
        // Browse all download metrics
        if (f.metric_type == "download") {
          
          var layerName = [territoireSelectionne.key, "crowd", qosVoixData, f.key].join('_');
          setLayerVisible(layerName);
          setQoSFilter(layerName);
          
          if (!nameListFournisseur.includes(f.fournisseur) && isCrowdOnTerritory(f, territoireSelectionne) == true) {

            var elementList = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', f.fournisseur_link);
            link.setAttribute('target', '_blank');
            link.innerHTML = f.fournisseur;
            elementList.append(link);
            listDebitFournisseur.append(elementList);
  
            nameListFournisseur.push(f.fournisseur);
          }
        }
      });

      hideMapIfNoData(nameListFournisseur);
    }
  }
  else if (typeOfTests == "web") {
    if (driveCrowd == "allDriveWeb") {

      listeFournisseurs.forEach(function(f) {
        // Browse all download metrics
        if (f.metric_type == "web") {
          
          var layerName = [territoireSelectionne.key, "QoS", agglosTransports, qosVoixData, f.key].join('_');
          setLayerVisible(layerName);
          setQoSFilter(layerName);

          if (!nameListFournisseur.includes(f.fournisseur)) {
            var elementList = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', f.fournisseur_link);
            link.setAttribute('target', '_blank');
            link.innerHTML = f.fournisseur;
            elementList.append(link);
            listDebitFournisseur.append(elementList);
  
            nameListFournisseur.push(f.fournisseur);
          }
        }
      });

      hideMapIfNoData(nameListFournisseur);
    }
    else if (driveCrowd == "allCrowdWeb") {

      listeFournisseursCrowd.forEach(function(f) {
        // Browse all download metrics
        if (f.metric_type == "web") {
          
          var layerName = [territoireSelectionne.key, "crowd", qosVoixData, f.key].join('_');
          setLayerVisible(layerName);
          setQoSFilter(layerName);

          if (!nameListFournisseur.includes(f.fournisseur) && isCrowdOnTerritory(f, territoireSelectionne) == true) {
            var elementList = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', f.fournisseur_link);
            link.setAttribute('target', '_blank');
            link.innerHTML = f.fournisseur;
            elementList.append(link);
            listDebitFournisseur.append(elementList);
  
            nameListFournisseur.push(f.fournisseur);
          }
        }
      });

      hideMapIfNoData(nameListFournisseur);
    }

  }

  infoTxt.textContent = info;
  infoTxt.append(listDebitFournisseur);
  return true;
}

// Cette fonction vérifie si un fournisseur de donnees proposent des mesures sur un territoire
function isCrowdOnTerritory(graphCrowd, territoryToCheck) {
  var scope = graphCrowd.scope;
  var check = false;

  Object.keys(scope).forEach(function(el){

    if (el == territoryToCheck.key) {
      check = true;
      return check;
    }
  });

  return check;

}

function hideMapIfNoData(listOfCrowdFournisseur) {
  if (listOfCrowdFournisseur.length == 0) {
    $("#infoTxt").css('display','none');
    setElVisible("noCrowdData");
  }
  else {
    $("#infoTxt").css('display','table');
    setElInvisible("noCrowdData");
  }
}

// [22 - 04 - 2021] Redesign de la popup pour les sites

function createPopup(infoCarte) {

  // Lien vers la page d'information pour la couverture des zones peu denses
  var linkZonesBlanches = "https://www.arcep.fr/la-regulation/grands-dossiers-reseaux-mobiles/la-couverture-mobile-en-metropole/la-couverture-des-zones-peu-denses.html";
  var linkANFR = "https://www.cartoradio.fr/index.html#/cartographie/lonlat/";
  var linkDCC = "https://www.arcep.fr/cartes-et-donnees/tableau-de-bord-du-new-deal-mobile.html";

  var colorSpanOp = "other-emetteur";
  var gradient = 'other';
  if (infoCarte.Operateur == 20801 || infoCarte.Operateur == 34001 || infoCarte.Operateur == 64700) { colorSpanOp = "orange-emetteur", gradient = 'orange'}
  else if (infoCarte.Operateur == 20810 || infoCarte.Operateur == 34002 || infoCarte.Operateur == 34020 || infoCarte.Operateur == 64710) { colorSpanOp = "red-emetteur", gradient = 'red'}
  else if (infoCarte.Operateur == 20820 || infoCarte.Operateur == 34008 || infoCarte.Operateur == 34003) { colorSpanOp = "blue-emetteur", gradient = 'blue'}
  else if (infoCarte.Operateur == 20815 || infoCarte.Operateur == 64703) { colorSpanOp = "grey-emetteur", gradient = 'grey'}
  else if (infoCarte.Operateur == 64704) { colorSpanOp = "purple-emetteur", gradient = 'purple'}
  else if (infoCarte.Operateur == 64701) { colorSpanOp = "green-emetteur", gradient = 'green'}
  else if (infoCarte.Operateur == 64702) { colorSpanOp = "pink-emetteur", gradient = 'pink'}

  var techno = null;
  if (infoCarte.C2G == 1 || infoCarte.C2G3G == 1) { techno = "<tr><td>Technologie(s) </td><td>2G"}
  if (infoCarte.C3G == 1 && techno != null) { techno = techno + ' <span class="separator">|</span> ' + "3G"}
  else if (infoCarte.C3G == 1 && techno == null) {techno = "<tr><td>Technologie(s) </td><td>3G"}
  if (infoCarte.C4G == 1 && techno != null) { techno = techno + ' <span class="separator">|</span> ' + "4G"}
  else if (infoCarte.C4G == 1 && techno == null) {techno = "<tr><td>Technologie(s) </td><td>4G"}
  if (infoCarte.C5G == 1 && techno != null) { techno = techno + ' <span class="separator">|</span> ' + "5G"}
  else if (infoCarte.C5G == 1 && techno == null) {techno = "<tr><td>Technologie(s) </td><td>5G"}
  techno = techno + '</td></tr>';

  var ferq5G = null
  if (infoCarte.C5G == 1) {
    if (infoCarte.C5G700 == 1) { ferq5G = "<tr><td>Fréquence(s) 5G </td><td>700 MHz"}
    if (infoCarte.C5G2100 == 1 && ferq5G != null) { ferq5G = ferq5G + ' <span class="separator">|</span> ' + "2100 MHz"}
    else if (infoCarte.C5G2100 == 1 && ferq5G == null) {ferq5G = "<tr><td>Fréquence(s) 5G </td><td>2100 MHz"}
    if (infoCarte.C5G3500 == 1 && ferq5G != null) { ferq5G = ferq5G + ' <span class="separator">|</span> ' + "3500 MHz"}
    else if (infoCarte.C5G3500 == 1 && ferq5G == null) {ferq5G = "<tr><td>Fréquence(s) 5G </td><td>3500 MHz"}
    ferq5G = ferq5G + '</td></tr>';
  }
  else {ferq5G = ''}

  var programme = null
  if (infoCarte.site_DCC == 1) { programme = '<tr><td>Programme</td><td><a target="_blank" href="' + linkDCC + '">Dispositif de couverture ciblée</a>'}
  if (infoCarte.site_ZB == 1 && programme != null) { programme = programme + ' <span class="separator">|</span> ' + "Zones blanches"}
  else if (infoCarte.site_ZB == 1 && programme == null) {programme = '<tr><td>Programme</td><td><a target="_blank" href="' + linkZonesBlanches + '">Zones blanches</a>'}
  if (infoCarte.site_strategique == 1 && programme != null) { programme = programme + ' <span class="separator">|</span> ' + "Sites stratégiques"}
  else if (infoCarte.site_strategique == 1 && programme == null) {programme = '<tr><td>Programme</td><td><a target="_blank" href="' + linkZonesBlanches + '">Zones blanches</a>'}
  if (programme == null) {programme = ''}
  else {programme = programme + '</td></tr>'}

  var idAnfr = infoCarte.id_station_anfr;
  if (typeof(idAnfr) === 'undefined') {idAnfr = 'Non disponible'}

  var htmlPopup = '<table class="popup-table">'
  +'<tbody>'
  +  '<tr>'
  +      '<th>'
  +      '<div style="display:flex;">'
  +        '<div class="circle-pulse pulse"></div> Émetteurs'
  +     '</div>'
  +     '</th>'
  +      '<th class="emetteur-position">' + infoCarte.X + ', ' + infoCarte.Y + ' &nbsp;&nbsp;<i class="bi bi-geo"></i></th>'
  +   '</tr>'
  +   '<tr class="gradient-line ' + gradient + '">'
  +     '<td></td>'
  +     '<td></td>'
  +   '</tr>'
  +   '<tr>'
  +     '<td>Opérateur</td>'
  +     '<td><span class="container-op ' + colorSpanOp + '">' + operateurByMCCMNC(infoCarte.Operateur).nomCommercial + '</span></td>'
  +   '</tr>'
  + techno 
  + ferq5G
  + programme
  +   '<tr>'
  +     '<td>N° de station ANFR</td>'
  +     '<td><a target="_blank" href="' + linkANFR + infoCarte.X + '/' + infoCarte.Y + '">' + idAnfr + '</a></td>'
  +   '</tr>' 
  + '</tbody>'
  + '</table>'
  ;

  return htmlPopup;
}

/* global Highcharts */
/* global dataRaw */
/* global territoireSelectionne, operateurs */
/* global qosVoixData, sousStrate, agglosTransports, couvertureQoS, technoCarteCouverture, strateAgglos, strateTransports */

(function(H) {
    H.wrap(H.seriesTypes.column.prototype, 'drawTracker', function(proceed) {
      proceed.apply(this, Array.prototype.slice.call(arguments, 1));

      var dPoint = this.points;
      H.each(dPoint, function(point) {
        if(point.dataLabel) {
          point.dataLabel.element.point = null;
        }
      });
    });
  }(Highcharts));

var chartsCollection = [];

function createLinearGradientDefault(){
  return {
    x1: 1,
    x2: 1,
    y1: 0,
    y2: 1
  }
}

function removeAllCharts() {
  for (var i = (chartsCollection.length - 1); i >= 0; i--) {
    chartsCollection[i].destroy();
    chartsCollection.pop();
  }
}

function ajouterChartsQoSAgglosVoixSMS(zone){
  var graphQoSAgglos_Voix = graphiqueQoSAgglos_Voix(zone);
  var graphQoSAgglos_SMS = graphiqueQoSAgglos_SMS(zone);
  if(graphQoSAgglos_Voix) chartsCollection.push(new Highcharts.Chart(graphQoSAgglos_Voix));
  if(graphQoSAgglos_SMS) chartsCollection.push(new Highcharts.Chart(graphQoSAgglos_SMS));
}

function ajouterChartsQoSAgglosData(zone){
  var graphQoSAgglos_Web = graphiqueQoSAgglos_Web(zone, sousStrate);
  var graphQoSAgglos_DebitsDl = graphiqueQoSAgglos_DebitsDl(zone, sousStrate);
  var graphQoSAgglos_DebitsUl = graphiqueQoSAgglos_DebitsUl(zone, sousStrate);
  var graphQoSAgglos_Video = graphiqueQoSAgglos_Video(zone, sousStrate);
  if(graphQoSAgglos_Web) chartsCollection.push(new Highcharts.Chart(graphQoSAgglos_Web));
  if(graphQoSAgglos_DebitsDl) chartsCollection.push(new Highcharts.Chart(graphQoSAgglos_DebitsDl));
  if(graphQoSAgglos_DebitsUl) chartsCollection.push(new Highcharts.Chart(graphQoSAgglos_DebitsUl));
  if(graphQoSAgglos_Video) chartsCollection.push(new Highcharts.Chart(graphQoSAgglos_Video));
}

function ajouterChartsCouvCumul(techno){
  var graphCouvCumulPop = graphiqueCouvCumul("Population", "Couverture_en_population", techno);
  var graphCouvCumulSurface = graphiqueCouvCumul("Surface", "Couverture_en_territoire", techno);
  if(graphCouvCumulPop) chartsCollection.push(new Highcharts.Chart(graphCouvCumulPop));
  if(graphCouvCumulSurface) chartsCollection.push(new Highcharts.Chart(graphCouvCumulSurface));
}

function ajouterChartsCouvCumul_3G4G(techno){
  var graphCouvCumul3G4GPop = graphiqueCouvCumul("Population", "Couverture_en_population", techno);
  var graphCouvCumul3G4GSurface = graphiqueCouvCumul("Surface", "Couverture_en_territoire", techno);
  if (graphCouvCumul3G4GPop != null) chartsCollection.push(new Highcharts.Chart(graphCouvCumul3G4GPop));
  if (graphCouvCumul3G4GSurface != null) chartsCollection.push(new Highcharts.Chart(graphCouvCumul3G4GSurface));
}

//ajout sites 5G
function ajouterChartsSitesCumul_5G(techno){
  var graphSitesCumul3500only = graphiqueSitesCumul("3500only", "Sites3500only", techno);
  var graphSitesCumulTous5G = graphiqueSitesCumul("Tous5G", "SitesTous5G", techno);
  if (graphSitesCumul3500only != null) chartsCollection.push(new Highcharts.Chart(graphSitesCumul3500only));
  if (graphSitesCumulTous5G != null) chartsCollection.push(new Highcharts.Chart(graphSitesCumulTous5G));
}

function ajouterChartsQoSTransportVoixSMS(features){
  var graphQoSTransports_Voix = graphiqueQoSTransports_Voix(features, sousStrate);
  var graphQoSTransports_SMS = graphiqueQoSTransports_SMS(features, sousStrate);
  if(graphQoSTransports_Voix != null) chartsCollection.push(new Highcharts.Chart(graphQoSTransports_Voix));
  if(graphQoSTransports_SMS != null) chartsCollection.push(new Highcharts.Chart(graphQoSTransports_SMS));
}

function ajouterChartsQosTransportsData(features){
  var graphQoSTransports_Web = graphiqueQoSTransports_Web(features, sousStrate);
  if(graphQoSTransports_Web != null) chartsCollection.push(new Highcharts.Chart(graphQoSTransports_Web));
}

function chartsGenerator() {
  var features;
  if(couvertureQoS == "couverture") features = technoCarteCouverture;
  else if(couvertureQoS == "QoS"){
    features = strate;
  }

  removeAllCharts();

  if (["2G", "2G3G"].indexOf(features)>-1){
    ajouterChartsCouvCumul(features);
  } else if (["3G", "4G"].indexOf(features)>-1) {
    ajouterChartsCouvCumul_3G4G(features);
  } 
  //ajout sites 5G
  else if(["5G"].indexOf(features)>-1) {
    ajouterChartsSitesCumul_5G(features);
  } 
  //fin ajout sites 5G
  else if (["national", "rurale", "intermediaire", "dense", "touristique"].indexOf(features)>-1){
    if (qosVoixData == "voix") ajouterChartsQoSAgglosVoixSMS(features);
    else if (qosVoixData == "data") ajouterChartsQoSAgglosData(features);
  } else if (["tgv", "intercites_ter", "rer_transiliens", "metros", "routes", "transport"].indexOf(features)>-1) {
    if (qosVoixData == "voix") ajouterChartsQoSTransportVoixSMS(features);
    else if (qosVoixData == "data") ajouterChartsQosTransportsData(features);
  }
}

function createOptionsChart(type, renderToId){
  var chart = {};
  chart.type = type;
  chart.renderTo = renderToId;
  chart.margin = [25, 20, 16, 10];
  chart.backgroundColor = "rgba(255, 255, 255, 0)";
  return chart;
}

function createOptionsTitle(x, y, textTitle, widthAdjust){
  var title = {};
  title.align = "center";
  title.x = x;
  title.y = y;
  title.style = {"fontSize":"10px", "color":"white", "fontWeight": "bold"};
  title.text = '<span>' + textTitle + '</span>';
  if (widthAdjust != null) title.widthAdjust = widthAdjust;
  return title;
}

function createOptionsTooltip(texteLeg, formatterType){
  var tooltip = {};
  tooltip.enabled = true;
  tooltip.hideDelay = 0;

  tooltip.followPointer = true;
  tooltip.useHTML = true;
  tooltip.borderColor = 'gray';
  tooltip.borderWidth = 1;

  if(formatterType == 'couverture'){
    tooltip.formatter =  function(){
      var el = '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' ;
      el += getCouleurOperateur(this.x, this.y) + '">' + this.x + ' : ';
      if(this.y === undefined) el += "inconnu";
      else if(this.y < 1) el += "<1";
      else if(this.y > 99) el += ">99";
      else if (1 <= this.y && this.y <= 99) el += this.y;
      el += '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">' + texteLeg + ' sous ' + this.series.name + ' </div>';
      return el;
    };
  }

  //ajout sites 5G
  if(formatterType == 'sites'){
    tooltip.formatter =  function(){
      var el = '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' ;
      el += getCouleurOperateur(this.x, this.y) + '">' + this.x + ' : ';
      if(this.y === undefined) el += "inconnu";
      else if (0 <= this.y) el += this.y;
      el += '</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">' + 'sites 5G en bande ' + this.series.name + ' </div>';
      return el;
    };
  }
  //fin ajout sites 5G

  if(formatterType == 'qualité'){
    tooltip.formatter = function() {
      return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:'
      + getCouleurOperateur(this.x, this.y) + '">' + this.x + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">'+ (texteLeg=="series.name"?this.series.name:texteLeg) +'</div>';
    };
  }

  if(formatterType == 'qualité cumulative'){
    tooltip.formatter = function() {

      var result = 0;
      for (var i = this.series.index; i < this.series.chart.series.length; i++) {
        result += this.series.chart.series[i].data[this.point.index].y;
      }
      return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:'
      + getCouleurOperateur(this.x, this.y) + '">' + this.x + ' : ' + result + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">'+ (texteLeg=="series.name"?this.series.name:texteLeg) +'</div>';
    };
  }

  if(formatterType == 'qualité débits'){
    tooltip.formatter = function() {
      return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; color:'
      + getCouleurOperateur(this.x, this.y) + '">' + this.x + ' : ' + ((this.y > 0) ? Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s' : "Indisponible")
      + '</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">'+((this.y > 0) ? 'Débit moyen constaté lors de téléchargements de fichiers':"Donnée indisponible")+'</span></div>';
    }
  }

  return tooltip;

}

function createOptions_X_Axis(){
  var xAxis = {};
  xAxis.tickWidth = 0;
  xAxis.labels = { enabled : false };
  var categories = [];
  territoireSelectionne.operateurs.forEach(function(operateur){
    categories.push(operateur.label);
  });
  xAxis.categories = categories;
  return xAxis;
}

function createOptions_Y_Axis(){
  var yAxis = {};
  yAxis.min = 0;
  yAxis.max = 100;
  yAxis.minorTickInterval = 25;
  yAxis.minorGridLineColor = '#666666';
  yAxis.gridLineWidth = 0;
  yAxis.labels = { enabled : false};
  yAxis.title = { enabled : false };
  return yAxis;
}

//ajout sites 5G
function createOptions_Y_Axis_max(maxY){
  var yAxis = {};
  yAxis.min = 0;
  yAxis.max = 1.05*maxY;
  yAxis.minorTickInterval = maxY/4;
  yAxis.minorGridLineColor = '#666666';
  yAxis.gridLineWidth = 0;
  yAxis.labels = { enabled : false};
  yAxis.title = { enabled : false };
  return yAxis;
}
//fin aout sites 5G

function createOptionsPlotOptions(formatterType, techno){
  var plotOptions = {};
  plotOptions.column = {};

  plotOptions.column.borderWidth = 0;
  plotOptions.column.borderColor = '#AAAAAA';
  plotOptions.column.groupPadding = 0.05;

  plotOptions.series = {};
  plotOptions.series.dataLabels = {};
  plotOptions.series.dataLabels.enabled = true;
  plotOptions.series.dataLabels.color = '#FFFFFF';
  plotOptions.series.dataLabels.rotation = -90;
  plotOptions.series.dataLabels.inside = false;

  plotOptions.series.dataLabels.crop = false;
  plotOptions.series.dataLabels.overflow = 'allow';
  plotOptions.series.dataLabels.padding = 0;
  plotOptions.series.dataLabels.style = {};
  plotOptions.series.dataLabels.style.textShadow = '0px 0px 3px black'
  plotOptions.series.dataLabels.style.fontSize = '9px';
  plotOptions.series.dataLabels.y = -15;
  if (formatterType == 'couverture' || formatterType == 'couverture3G4G' || formatterType == 'sites'){
    plotOptions.column.stacking = 'normal'; // column
    if(formatterType == 'couverture'){
      plotOptions.series.dataLabels.formatter = function(){
        var seriesName = "couverture limitée";
        if(this.series.name == seriesName) return calculerDataLabelsFormatter(this.total);
      };
   } else if(formatterType == 'couverture3G4G') {
      plotOptions.series.dataLabels.formatter = function() {
        var seriesName =  "couverture " + techno ;
        if(territoireSelectionne.key == "metropole")  seriesName += " bridée à 384 kbit/s";
        if (this.series.name == seriesName) return calculerDataLabelsFormatter(this.total);
      };
    } //ajout sites 5G
    else if (formatterType == 'sites'){
      plotOptions.series.dataLabels.formatter = function(){
        var seriesName = "700 MHz";
        if(this.series.name == seriesName) return calculerDataLabelsFormatterSites(this.total);
      }
      //fin ajout sites 5G
    }
  } else if(formatterType == 'qualité' || formatterType == 'qualité web' || formatterType == "qualité bis" || formatterType == "qualité débits"){
    plotOptions.column.pointPadding = 0.1;
    if (formatterType == "qualité bis") {
      plotOptions.series.dataLabels.y = 20;
      plotOptions.column.stacking = 'normal'; // column
      plotOptions.series.dataLabels.formatter = function(){
        if (this.series.index == this.series.chart.series.length-1)  return this.y === undefined ? "" : this.y + ' %';
        else return this.total === undefined ? "" : this.total + ' %';
      };
    } 
    else if (formatterType=="qualité débits"){
      plotOptions.series.dataLabels.formatter = function() {return ((this.y > 0) ? Highcharts.numberFormat(this.y / 1000, 0) + '<span style="font-size:11px; font-weight:normal ; text-shadow : 0px 0px 1px black"> Mb/s</span>' : "Indisp."); };
      plotOptions.series.dataLabels.align = 'left';
      plotOptions.series.dataLabels.y = -5;
    }
    else {
      plotOptions.series.dataLabels.formatter = function(){ return this.y === undefined ? "" : this.y + ' %'; };
    }
  }

  return plotOptions;
}

function calculerDataLabelsFormatter(total){
  if(total === undefined) return '';
  else if(total < 1) return '<1%';
  else if (total > 99) return '>99%';
  else if (1 <= total && total <= 99) return total + ' %';
 }

//ajout sites 5G
function calculerDataLabelsFormatterSites(total){
  if(total === undefined) return '';
  else if (0 <= total) return total;
 }
//fin ajout sites 5G

function createOptionsSeriesCouverture(type,params){
  var series = [];
  var niveauxCouverture = params.niveauxCouverture;
  var inTechno = params.inTechno;
  var inUnite = params.inUnite;

  for(var niveauxCouvertureIndex = 0; niveauxCouvertureIndex < niveauxCouverture.length; niveauxCouvertureIndex++){
    var niveauCouverture = niveauxCouverture[niveauxCouvertureIndex];

    var colName = niveauCouverture.colName;
    var serie = {};
    serie.name = niveauCouverture.name;
    serie.data = [];

    for(var operateursIndex = 0; operateursIndex < territoireSelectionne.operateurs.length; operateursIndex++){
      var operateur = territoireSelectionne.operateurs[operateursIndex];

      var data = {};
      var yTmp = dataRaw;
      var stops = [];
      data.color = {};
      data.color.linearGradient = createLinearGradientDefault();
      if(territoireSelectionne != null) yTmp = yTmp[territoireSelectionne.key];
      if(yTmp == null) {
        console.error("Pas de données pour le territoire " + territoireSelectionne.key + " dans data-graph.js");
        return null;
      }
      if(type != null) yTmp = yTmp[type]; // couverture
      if(inTechno != null) yTmp = yTmp[inTechno]; // 2G / 2G3G
      if(colName != null) yTmp = yTmp[colName]; // TBC / BC / CL
      if(inUnite != null) yTmp = yTmp[inUnite]; // Couverture_en_territoire / Couverture_en_population
      if(operateur.dataGraphKey != null) yTmp = yTmp[operateur.dataGraphKey]; // clé de l'opérateur, définie dans data-operateur.js
      data.y = yTmp;

      stops.push([0, operateur.couleurs[colName]]);
      stops.push([1, operateur.couleurs[colName]]);
      data.color.stops = stops;
      serie.data.push(data);
    }

    serie.legendItemClick = false;
    serie.animation = false;
    series.push(serie);
  }

  return series;
}

function createOptionsSeriesCouverture_3G4G(type,params){
  var series = [];
  var niveauxCouverture = params.niveauxCouverture;
  var inTechno = params.inTechno;
  var inUnite = params.inUnite;

  for(var niveauxCouvertureIndex = 0; niveauxCouvertureIndex < niveauxCouverture.length; niveauxCouvertureIndex++){
    var niveauCouverture = niveauxCouverture[niveauxCouvertureIndex];

    var serie = {};
    var sousUnite = niveauCouverture.su.name;
    serie.name = niveauCouverture.name;
    serie.data = [];

    for(var operateursIndex = 0; operateursIndex < territoireSelectionne.operateurs.length; operateursIndex++){
      var operateur = territoireSelectionne.operateurs[operateursIndex];

      var data = {};
      var yTmp = dataRaw;
      var stops = [];
      data.color = {};
      data.color.linearGradient = createLinearGradientDefault();
      if(territoireSelectionne != null) yTmp = yTmp[territoireSelectionne.key];
      if(yTmp == null) {
        console.error("Pas de données pour le territoire " + territoireSelectionne.key + " dans data-graph.js");
        return null;
      }
      if(type != null) yTmp = yTmp[type]; // couverture
      if(inTechno != null) yTmp = yTmp[inTechno]; // 3G / 4G
      if(inUnite != null) yTmp = yTmp[inUnite]; // Couverture_en_territoire / Couverture_en_population
      if(yTmp == null) {
         console.error("Pas de données des opérateurs pour : "+ territoireSelectionne.key + "->" + type + "->" + inTechno + "->" + inUnite + " dans la variable dataRaw du fichier data-graph.js");
         return null;
      }
      if(sousUnite != null) yTmp = yTmp[sousUnite]; // ReseauPropre / Iti
      if(yTmp == null){
          console.error("Pas de données des opérateurs pour : "+ territoireSelectionne.key + "->" + type + "->" + inTechno + "->" + inUnite  + "->" + sousUnite + " dans la variable dataRaw du fichier data-graph.js");
          return null;
      }
      if(operateur.dataGraphKey != null)  yTmp = yTmp[operateur.dataGraphKey];
      data.y = yTmp;
      stops.push([0, operateur.couleurs[niveauCouverture.su.suOpCouleur]]);
      stops.push([1, operateur.couleurs[niveauCouverture.su.suOpCouleur]]);

      data.color.stops = stops;
      serie.data.push(data);
    }
    serie.legendItemClick = false;
    serie.animation = false;
    series.push(serie);
  }
  return series;
}

//ajout sites 5G
function createOptionsSeriesSites_5G(type,params){
  var series = [];
  var bandesFrequences = params.bandesFrequences;
  var inTechno = params.inTechno;
  var inUnite = params.inUnite;

  for(var bandesFrequencesIndex = 0; bandesFrequencesIndex < bandesFrequences.length; bandesFrequencesIndex++){
    var bandeFrequences = bandesFrequences[bandesFrequencesIndex];

    var colName = bandeFrequences.colName;
    var serie = {};
    serie.name = bandeFrequences.name;
    serie.data = [];

    for(var operateursIndex = 0; operateursIndex < territoireSelectionne.operateurs.length; operateursIndex++){
      var operateur = territoireSelectionne.operateurs[operateursIndex];
      
      var data = {};
      var yTmp = dataRaw;
      var stops = [];
      data.color = {};
      data.color.linearGradient = createLinearGradientDefault();
      if(territoireSelectionne != null) yTmp = yTmp[territoireSelectionne.key];
      if(yTmp == null) {
        console.error("Pas de données pour le territoire " + territoireSelectionne.key + " dans data-graph.js");
        return null;
      }
      if(type != null) yTmp = yTmp[type]; // sites
      if(inTechno != null) yTmp = yTmp[inTechno]; // 5G
      if(inUnite != null) yTmp = yTmp[inUnite]; // Sites 3500 ou tous sites
      if(colName != null) yTmp = yTmp[colName]; // 3500 / 2100 / 700
      if(operateur.dataGraphKey != null) yTmp = yTmp[operateur.dataGraphKey]; // clé de l'opérateur, définie dans data-operateur.js
      data.y = yTmp;

      stops.push([0, operateur.couleurs[colName]]);
      stops.push([1, operateur.couleurs[colName]]);
      data.color.stops = stops;
      serie.data.push(data);
    }

    serie.legendItemClick = false;
    serie.animation = false;
    series.push(serie);
  }

  return series;
}
//fin ajout sites 5G

function createOptionsSeriesQualite(type,params){
  var series = [];
  var colName = params.colName;
  var inStrate = params.inStrate;
  var sousStrate = params.sousStrate;
  var niveauxCouverture = params.niveauxCouverture;
  if (niveauxCouverture == undefined)
    niveauxCouverture = [null];

  for(var niveauxCouvertureIndex = 0; niveauxCouvertureIndex < niveauxCouverture.length; niveauxCouvertureIndex++){
    var niveauCouverture = niveauxCouverture[niveauxCouvertureIndex];

    var serie = {};
    var sousUnite = null;
    if (niveauCouverture != null) {
      sousUnite = niveauCouverture.su.name;
      serie.name = niveauCouverture.name;
    }
    serie.data = [];

    for(var operateursIndex = 0; operateursIndex < territoireSelectionne.operateurs.length; operateursIndex++){
      var operateur = territoireSelectionne.operateurs[operateursIndex];

      var data = {};
      var yTmp = dataRaw;
      var stops = [];
      data.color = {};
      data.color.linearGradient = createLinearGradientDefault();
      if(territoireSelectionne != null) yTmp = yTmp[territoireSelectionne.key];
      if(colName != null && yTmp != null) yTmp = yTmp[colName];
      if(inStrate != null && yTmp != null) yTmp = yTmp[inStrate];
      if(sousStrate != null && yTmp != null) yTmp = yTmp[sousStrate];
      if(sousUnite != null && yTmp != null) yTmp = yTmp[sousUnite];
      if(yTmp == null) {
        return null;
      }

        yTmp = yTmp[operateur.dataGraphKey];
        data.y = yTmp;

        if (niveauCouverture == null)
          serie.name = operateur.label;

        if (niveauCouverture == null) {
          stops.push([0, operateur.couleurs.defaut]);
          stops.push([1, operateur.couleurs.TBC]);
        } else {
          stops.push([0, operateur.couleurs[niveauCouverture.su.suOpCouleur]]);
          stops.push([1, operateur.couleurs[niveauCouverture.su.suOpCouleur]]);
        }

        data.color.stops = stops;
        serie.data.push(data);
    }
    serie.legendItemClick = false;
    serie.animation = false;
    series.push(serie);
  }

  return series;
}

function createOptionsSeries(type,params){
  if(type == 'couverture'){
    var inTechno = params.inTechno;
    if(["2G", "2G3G"].indexOf(inTechno) != -1) {
      var optionSeriesCouverture = createOptionsSeriesCouverture(type, params);
      return optionSeriesCouverture;
    } else if (["3G", "4G"].indexOf(inTechno) != -1) {
      var optionSeriesCouverture_3G4G = createOptionsSeriesCouverture_3G4G(type, params);
      return optionSeriesCouverture_3G4G;
    }
  }
    
  //ajout sites 5G
  else if (type =='sites') {
    var inTechno = params.inTechno;
    if (["5G"].indexOf(inTechno) != -1) {
      var optionSeriesSites_5G = createOptionsSeriesSites_5G(type, params);
    return optionSeriesSites_5G;
    }
  }
  //fin ajout sites 5G
  else if(type == 'qualité'){
    var optionSeriesQualite = createOptionsSeriesQualite(type,params);
    return optionSeriesQualite;
  }
}

function graphiqueCouvCumul(texteLeg, inUnite, inTechno) {
  var type = 'couverture';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueCouv"+texteLeg);
  options.title = createOptionsTitle(-7, 97, texteLeg, 140);
  options.tooltip = createOptionsTooltip(texteLeg, 'couverture');
  options.legend = { enabled : false } ;
  options.xAxis = createOptions_X_Axis();
  options.yAxis = createOptions_Y_Axis();
  var niveauxCouverture = [];

  /* Maintenir l'ordre des niveaux de couverture */
  if (inTechno == "2G" || inTechno == "2G3G") {
    options.plotOptions = createOptionsPlotOptions('couverture', inTechno);
    niveauxCouverture = [
      {name : 'couverture limitée', colName : 'CL'},
      {name : 'bonne couverture', colName : 'BC'},
      {name : 'très bonne couverture',colName : 'TBC'}
    ];
  }
  else {
    options.plotOptions = createOptionsPlotOptions('couverture3G4G', inTechno);
    if (dataRaw[territoireSelectionne.key]["couverture"][inTechno]["Couverture_en_territoire"].Iti != undefined)
      niveauxCouverture.push({name : 'couverture ' + inTechno + ' bridée à 384 kbit/s' , su : {name :'Iti' , suOpCouleur : 'ITI'}});
    niveauxCouverture.push({name : 'couverture '+inTechno, su : {name :'ReseauPropre' , suOpCouleur : 'RP'}});
  }

  var params = {inTechno : inTechno, niveauxCouverture : niveauxCouverture, inUnite : inUnite};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueCouv"+texteLeg, texteLeg, -7, 56);;
  options.series = series;
  options.credits = { enabled : false };
  return options;
}

//ajout sites 5G
function graphiqueSitesCumul(texteLeg, inUnite, inTechno) {
  var type = 'sites';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueSites"+texteLeg);
  if (texteLeg == "3500only") options.title = createOptionsTitle(-7, 97, "Sites 3500 MHz", 140);
  else if (texteLeg == "Tous5G") options.title = createOptionsTitle(-0, 97, "Sites 700/2100/3500", 220);
  options.tooltip = createOptionsTooltip(texteLeg, 'sites');
  options.legend = { enabled : false } ;
  options.xAxis = createOptions_X_Axis();
  //valeurs à ajuster selon le nb de sites à représenter
  if (texteLeg == "3500only") options.yAxis = createOptions_Y_Axis_max(3000);
  else if (texteLeg == "Tous5G") options.yAxis = createOptions_Y_Axis_max(14000);
  var bandesFrequences = [];

  /* Maintenir l'ordre des bandes de fréquences */
  if (inTechno == "5G") {
    options.plotOptions = createOptionsPlotOptions('sites', inTechno);
    bandesFrequences = [
      {name : '700 MHz', colName : 'Sites700'},
      {name : '2100 MHz', colName : 'Sites2100'},
      {name : '3500 MHz', colName : 'Sites3500'}
    ];
  }
  
  var params = {inTechno : inTechno, bandesFrequences : bandesFrequences, inUnite : inUnite};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueSites"+texteLeg, texteLeg, -7, 56);;
  options.series = series;
  options.credits = { enabled : false };
  return options;
}
/* Version avec un seul KPI voix sur les axes (fonctionne bien)
function graphiqueQoSTransports_Voix(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'appelsVocaux';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSTransports_Voix");
  options.title = createOptionsTitle(-7, 95, 'Voix', null);
  options.tooltip = createOptionsTooltip('Appels maintenus 2 minutes','qualité');
  options.legend = { enabled : false } ;
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité', inStrate);
  options.yAxis = createOptions_Y_Axis();

  var params = {colName:colName, inStrate:inStrate, sousStrate:sousStrate};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSTransports_Voix", "Voix", -7, 56);;
  options.series = series;
  options.credits = { enabled: false };
  return options;
}
*/
// [GD 18/11/2021] version avec deux KPI voix sur les axes en métropole
function graphiqueQoSTransports_Voix(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'appelsVocaux';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSTransports_Voix");
  options.title = createOptionsTitle(-7, 95, 'Voix', null);
  if (territoireSelectionne.key == "metropole") {options.tooltip = createOptionsTooltip("series.name",'qualité cumulative');}
  else {createOptionsTooltip('Appels maintenus 2 minutes','qualité');}
  options.legend = { enabled : false } ;
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité', inStrate);
  options.yAxis = createOptions_Y_Axis();

  var params = {colName:colName, inStrate:inStrate, sousStrate:sousStrate};
  if (territoireSelectionne.key == "metropole"){
    var niveauxCouverture = [];
    options.plotOptions = createOptionsPlotOptions('qualité bis', inStrate);
    niveauxCouverture.push({name : 'Appels maintenus pendant 2 minutes' , su : {name :'ok' , suOpCouleur : 'BC'}});
    niveauxCouverture.push({name : 'Appels maintenus pendant 2 minutes et sans perturbations', su : {name :'parfait' , suOpCouleur : 'TBC'}});
    params.niveauxCouverture = niveauxCouverture;
  }
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSTransports_Voix", "Voix", -7, 56);;
  options.series = series;
  if (territoireSelectionne.key == "metropole") {
    options.series[0].dataLabels = {y:-15};
  }
  options.credits = { enabled: false };
  return options;
}

function graphiqueQoSTransports_SMS(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'SMS';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSTransports_SMS");
  options.title = createOptionsTitle(0, 95, 'SMS', null);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].SMS.titre,'qualité');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité', inStrate);
  options.yAxis = createOptions_Y_Axis();

  var params = {colName:colName, inStrate:inStrate, sousStrate:sousStrate};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSTransports_Voix", "SMS", 0, 56);;
  options.series = series;
  options.credits = { enabled: false };
  return options;
}

function graphiqueQoSTransports_Web(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'web';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSTransports_Web");
  options.title = createOptionsTitle(0, 87, 'Navigation Web', 140);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].web.titre,'qualité');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité web', inStrate);
  options.yAxis = createOptions_Y_Axis();

  var params = {colName:colName, inStrate:inStrate, sousStrate:sousStrate };
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSTransports_Web", "Navigation Web", 0, 56);
  options.series = series;
  options.credits = { enabled: false };

  return options;
}

function graphiqueQoSAgglos_Voix(inStrate) {
  var type = 'qualité';
  var colName = 'appelsVocaux';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSAgglos_Voix");
  options.title = createOptionsTitle(-7, 95, 'Voix', null);
  options.tooltip = createOptionsTooltip("series.name",'qualité cumulative');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.yAxis = createOptions_Y_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité', inStrate);

  var params = {colName:colName, inStrate:inStrate, sousStrate : sousStrate};
  //if (territoireSelectionne.key == "metropole") {
    var niveauxCouverture = [];
      options.plotOptions = createOptionsPlotOptions('qualité bis', inStrate);
    niveauxCouverture.push({name : 'Appels maintenus pendant 2 minutes' , su : {name :'ok' , suOpCouleur : 'BC'}});
    niveauxCouverture.push({name : 'Appels maintenus pendant 2 minutes et sans perturbations', su : {name :'parfait' , suOpCouleur : 'TBC'}});
    params.niveauxCouverture = niveauxCouverture;
  //}
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSAgglos_Voix", "Voix", -7, 56);
  options.series = series;
  options.series[0].dataLabels = {y:-15};
  options.credits = { enabled: false };
 return options;
}

function graphiqueQoSAgglos_SMS(inStrate) {
  var type = 'qualité';
  var colName = 'SMS';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSAgglos_SMS");
  options.title = createOptionsTitle(0, 95, 'SMS', null);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].SMS.titre,'qualité');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité', inStrate);
  options.yAxis = createOptions_Y_Axis();

  var params = {colName:colName, inStrate:inStrate, sousStrate : sousStrate };
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSAgglos_SMS", "SMS", 0, 56);
  options.series = series;
  options.credits = { enabled: false };
  return options;
}

function graphiqueQoSAgglos_Web(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'web';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSAgglos_Web");
  options.title = createOptionsTitle(-7, 95, 'Navigation Web', 200);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].web.titre,'qualité');
  options.legend = { enabled: false };
  options.plotOptions = createOptionsPlotOptions('qualité web', inStrate);
  options.xAxis = createOptions_X_Axis();
  options.yAxis = createOptions_Y_Axis();

  var params = { colName:colName, inStrate:inStrate, sousStrate : sousStrate};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSAgglos_Web", "Navigation Web", -7, 56);
  options.series = series;
  options.credits = { enabled: false };
  return options;
}

function graphiqueQoSAgglos_Video(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'video';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSAgglos_Video");
  options.title = createOptionsTitle(0, 95, 'Vidéo en ligne', 140);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].video.titre,'qualité');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité web', inStrate);
  options.yAxis = createOptions_Y_Axis();

  var params = {colName:colName, inStrate:inStrate, sousStrate : sousStrate};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSAgglos_Video", "Vidéo en ligne", 0, 56);
  options.series = series;
  options.credits = { enabled: false };
  return options;
}

function graphiqueQoSAgglos_DebitsDl(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'debitsDl';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSAgglos_DebitsDl");
  options.title = createOptionsTitle(0, 95, 'Débit descendant', 140);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].debitsDl.titre,'qualité débits');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité débits', inStrate);
  options.yAxis = createOptions_Y_Axis_max(180000);

  var params = {colName:colName, inStrate:inStrate, sousStrate : sousStrate};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSAgglos_DebitsDl", "Débit descendant", 0, 56);
  options.series = series;
  options.credits = { enabled: false };
  return options;
}

function graphiqueQoSAgglos_DebitsUl(inStrate, sousStrate) {
  var type = 'qualité';
  var colName = 'debitsUl';
  var options = {};
  options.chart = createOptionsChart("column", "GraphiqueQoSAgglos_DebitsUl");
  options.title = createOptionsTitle(0, 95, 'Débit montant', 140);
  options.tooltip = createOptionsTooltip(dataRaw[territoireSelectionne.key].debitsUl.titre,'qualité débits');
  options.legend = { enabled: false };
  options.xAxis = createOptions_X_Axis();
  options.plotOptions = createOptionsPlotOptions('qualité débits', inStrate);
  options.yAxis = createOptions_Y_Axis_max(40000);

  var params = {colName:colName, inStrate:inStrate, sousStrate : sousStrate};
  var series = createOptionsSeries(type,params);
  if(series == null) return graphiqueIndisponible("GraphiqueQoSAgglos_DebitsUl", "Débit montant", 0, 56);
  options.series = series;
  options.credits = { enabled: false };
  return options;
}
/*
function graphiqueQoSAgglos_DebitsUl(inStrate, sousStrate) {
  var radiusTmp = 100;
  var options = {};
  options.chart = {
    type: 'solidgauge',
    renderTo: 'GraphiqueQoSAgglos_DebitsDl',
    margin: [0, 10, 5, 0],
    backgroundColor: 'rgba(255, 255, 255, 0)',
  };
  options.title = createOptionsTitle(-7, 95, "Débit descendant", 140);
  options.tooltip = {
    enabled: true,
    hideDelay: 0,
    useHTML: true,
    formatter: function() {
      return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:'
      + getCouleurOperateur(this.series.name, this.y) + '">' + this.series.name + ' : '
      + ((this.y > 0) ? Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s' : "Indisponible")
      + '</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">'+((this.y > 0) ? 'Débit moyen constaté lors de téléchargements de fichiers':"Voir communiqué de presse")+'</span></div>';
    },
    followPointer: true,
    borderColor: 'gray',
    borderWidth: 1
  };
  options.legend = { enabled: false };
  options.xAxis = { tickWidth: 0, labels: { enabled: false }};
  options.pane = {
    center: ['50%', '85%'],
    size: '85%',
    startAngle: -90,
    endAngle: 90,
    background: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      innerRadius: '40%',
      shape: 'arc'
    }
  };

  options.plotOptions = { solidgauge: { dataLabels: { enabled: false }}};
  options.yAxis = {
    min: 0,
    max: 110000,
    tickWidth: 1,
	tickAmount: 11,
    minorGridLineColor: '#666666',
    GridLineWidth : 0,
    labels:{ enabled: false },
    title: { enabled: false }
  };
  options.series = [];
  var nbOperateur = 0;
  var seriesPositions = [
    {x:-50, y:-75},
    {x:-50, y:-62},
    {x:50, y:-75},
    {x:50, y:-62}
  ];

  var yTmp = dataRaw[territoireSelectionne.key].debitsDl[inStrate];
  if(sousStrate != null) yTmp = yTmp[sousStrate];
  if (yTmp == undefined)
    return graphiqueIndisponible("GraphiqueQoSAgglos_DebitsDl", "Débit descendant", -7, 56);

  territoireSelectionne.operateurs.forEach(function(operateur){
    var serie = {};
    serie.name = operateur.label;
    var data = {};
    data.y = yTmp[operateur.dataGraphKey];
    data.color = {};
    data.color.linearGradient = createLinearGradientDefault();
    data.color.stops = [];
    data.color.stops.push([0, operateur.couleurs.defaut]);
    data.color.stops.push([1, operateur.couleurs.TBC]);
    serie.data = [data];
    serie.legendItemClick = false;
    serie.animation = false;
    serie.innerRadius = radiusTmp + "%";
    radiusTmp -= 15;
    serie.radius = radiusTmp + "%";
    serie.dataLabels = {};
    serie.dataLabels.align = "left";
    serie.dataLabels.style = {
      color: operateur.couleurs.defaut,
      //textShadow: '0px 0px 2px #BDBDBD',
      textOutline: '0px 0px #000000',
      fontSize: '10px',
    };
    serie.dataLabels.allowOverlap = true;
    serie.dataLabels.borderWidth = 0;
    serie.dataLabels.padding = 0;
    serie.dataLabels.enabled = true;
    serie.dataLabels.formatter = function() {return ((this.y > 0) ? Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s' : "Indisp."); };
    serie.dataLabels.x = seriesPositions[nbOperateur].x;
    serie.dataLabels.y = seriesPositions[nbOperateur].y;

    options.series.push(serie);
    nbOperateur++;
  });
  options.credits = { enabled: false };
  return options;
}


function graphiqueQoSAgglos_DebitsUl(inStrate, sousStrate) {
  var radiusTmp = 100;
  var options = {};
  options.chart = {
    type: 'solidgauge',
    renderTo: 'GraphiqueQoSAgglos_DebitsUl',
    margin: [0, 0, 5, 10],
    backgroundColor: 'rgba(255, 255, 255, 0)',
  };
  options.title = createOptionsTitle(5, 95, "Débit montant", 140);
  options.tooltip = {
    enabled: true,
    hideDelay: 0,
    useHTML: true,
    formatter: function() {
      return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:'
      + getCouleurOperateur(this.series.name, this.y) + '">' + this.series.name + ' : '
      + ((this.y > 0) ? Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s' : "Indisponible")
      + '</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">'+((this.y > 0) ? 'Débit moyen constaté lors de téléchargements de fichiers':"Voir communiqué de presse")+'</span></div>';
    },
    followPointer: true,
    borderColor: 'gray',
    borderWidth: 1
  };
  options.legend = { enabled: false };
  options.xAxis = { tickWidth: 0, labels: { enabled: false }};
  options.pane = {
    center: ['50%', '85%'],
    size: '85%',
    startAngle: -90,
    endAngle: 90,
    background: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      innerRadius: '40%',
      shape: 'arc'
    }
  };

  options.plotOptions = { solidgauge: { dataLabels: { enabled: false }}};
  options.yAxis = {
    min: 0,
    max: 50000,
    tickWidth: 0,
    minorGridLineColor: '#666666',
    gridLineWidth: 0,
    labels: { enabled: false },
    title: { enabled: false }
  };
  options.series = [];
  var nbOperateur = 0;
  var seriesPositions = [
    {x:-50, y:-75},
    {x:-50, y:-62},
    {x:50, y:-75},
    {x:50, y:-62}
  ];

  var yTmp = dataRaw[territoireSelectionne.key].debitsUl[inStrate];
    if(sousStrate != null) yTmp = yTmp[sousStrate];
  if (yTmp == undefined)
    return graphiqueIndisponible("GraphiqueQoSAgglos_DebitsUl", "Débit montant", 5, 56);

  territoireSelectionne.operateurs.forEach(function(operateur){
    var serie = {};
    serie.name = operateur.label;
    var data = {};
    data.y = yTmp[operateur.dataGraphKey];
    data.color = {};
    data.color.linearGradient = createLinearGradientDefault();
    data.color.stops = [];
    data.color.stops.push([0, operateur.couleurs.defaut]);
    data.color.stops.push([1, operateur.couleurs.TBC]);
    serie.data = [data];
    serie.legendItemClick = false;
    serie.animation = false;
    serie.innerRadius = radiusTmp + "%";
    radiusTmp -= 15;
    serie.radius = radiusTmp + "%";
    serie.dataLabels = {};
    serie.dataLabels.align = "left";
    serie.dataLabels.style = {
      color: operateur.couleurs.defaut,
      //textShadow: '0px 0px 2px #BDBDBD',
      textOutline: '0px 0px #000000',
      fontSize: '10px',
    };
    serie.dataLabels.allowOverlap = true;
    serie.dataLabels.borderWidth = 0;
    serie.dataLabels.padding = 0;
    serie.dataLabels.enabled = true;
    serie.dataLabels.formatter = function() {return ((this.y > 0) ? Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s' : "Indisp."); };
    serie.dataLabels.x = seriesPositions[nbOperateur].x;
    serie.dataLabels.y = seriesPositions[nbOperateur].y;

    options.series.push(serie);
    nbOperateur++;
  });
  options.credits = { enabled: false };
  return options;
}
*/

function graphiqueIndisponible(id, titre, x, y) {
  var type = 'qualité';
  var options = {};
  options.chart = createOptionsChart("column", id);
  options.title = createOptionsTitle(x, y, "Indicateur<br>non mesuré<br> _<br>"+titre, 200);
  options.legend = { enabled: false };
  options.credits = { enabled: false };
  return options;
}

function getCouleurOperateur(codeOperateurCourant) {
  var couleur = "black"; // default
  Object.keys(operateurs).forEach(function(cleOperateur){
    var operateur = operateurs[cleOperateur];
    if (codeOperateurCourant == operateur.label) couleur = operateur.couleurs.defaut;
  });
  return couleur;
}

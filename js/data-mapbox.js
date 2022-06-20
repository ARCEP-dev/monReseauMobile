var mapBoxToken = ""; // Le token MapBox n'est pas rendu public 

var vectorStr = "vector";
var fillOutlineColorDefault = "rgba(255, 255, 255, 0)";
var fillStr = "fill";
var qualitesColDefault = "NIVEAU";
var qualitesDefault = ['CL', 'BC', 'TBC'];
var itineranceColDefault = "OPERATEUR";
var itineranceDefault = [20801, 20815];
var monoColorDefault = "#e36565";
var multipleColorsDefault = ['#efa7a7', '#e36565', '#d82424'];
var opacityMonoColorDefault = 0.5;
var opactiyMultipleColorsDefault = 0.7;

// Variable pylône
var pyloneSourceOutremerId = "mapbox://stephanedeboysson.1utw0i0h";
var pyloneLayerOutremerId = "ALL2_sites_T4_2021-dfd0pf";
//variable QoS agglo data 
var QoSaggloDataSourceOutremerId = "mapbox://stephanedeboysson.dzu1czep";
var QoSaggloDataLayerOutremerId = "ALL5_DATA_LDV-9lc0h7";
//variable QoS agglo voix/SMS
var QoSaggloVoixSourceOutremerId = "mapbox://stephanedeboysson.4ho56dum";
var QoSaggloVoixLayerOutremerId = "All2_voix_ldv-btc63x";
//variable QoS transport data 
var QoStransportsDataSourceOutremerId = "mapbox://stephanedeboysson.am0eryni";
var QoStransportsDataLayerOutremerId = "ALL5_DATA_AXE-8i9xjy";
//variable QoS transport voix/SMS 
var QoStransportsVoixSourceOutremerId = "mapbox://stephanedeboysson.98ignwok";
var QoStransportsVoixLayerOutremerId = "ALL_voixsms_AXE-bajpmn";


function creerSource(id, type, url){
    var source = {};
    source.id = id;
    source.type = type;
    source.url = url;
    return source;
}

function creerCompositeSources(id, sources) {
  var source = {};
  source.id = id;
  source.type = "composite";
  source.sources = sources;
  return source;
}

function creerLayerCouverture(id, type, source, sourceLayer, fillColor, qualitesCol, qualites, fillOpacity, fillOutlineColor){
    if(qualitesCol === undefined) qualitesCol = qualitesColDefault;
    if(qualites === undefined) qualites = qualitesDefault;
    if(fillOpacity === undefined) fillOpacity = (fillColor.constructor === Array)?opactiyMultipleColorsDefault:opacityMonoColorDefault;
    if(fillOutlineColor === undefined) fillOutlineColor = fillOutlineColorDefault;
    var layer = {};
    layer.id = id;
    layer.type = type;
    layer.source = source;
    layer.sourceLayer = sourceLayer;
    layer.paint = {};
    if (fillColor.constructor === Array){
        layer.paint.fillColor = ['match',['get', qualitesCol]];
        for(var i=0;i<3;i++){
             layer.paint.fillColor.push(qualites[i]);
             layer.paint.fillColor.push(fillColor[i]);
        }
        layer.paint.fillColor.push('white');
    } else {
        layer.paint.fillColor = fillColor;
    }
    layer.paint.fillOpacity = fillOpacity;
    layer.paint.fillOutlineColor = fillOutlineColor;
    return layer;
}

function creerLayerCouvertureItinerance(id, type, source, sourceLayer, fillColor, itineranceCol, itinerance, fillOpacity, fillOutlineColor){
    if(fillOutlineColor === undefined) fillOutlineColor = fillOutlineColorDefault;
    var layer = {};
    layer.id = id;
    layer.type = type;
    layer.source = source;
    layer.sourceLayer = sourceLayer;
    layer.paint = {};
    if(fillColor.constructor === Array){
        layer.paint.fillColor = ['match',['get', itineranceCol]];
        for(var i=0;i<2;i++){
             layer.paint.fillColor.push(itinerance[i]);
             layer.paint.fillColor.push(fillColor[i]);
        }
        layer.paint.fillColor.push('white');
    } else {
        layer.paint.fillColor = fillColor;
    }
    layer.paint.fillOpacity = fillOpacity;
    layer.paint.fillOutlineColor = fillOutlineColor;
    return layer;
}

function creerLayer(id, source, sourceLayer, typeBilan){
    var layer = {};
    layer.id = id;
    layer.source = source;
    layer.sourceLayer = sourceLayer;
    layer.typeBilan = typeBilan;
	  layer.layout = {"icon-allow-overlap": false}
    return layer;
}

function buildHashTable(map, obj, index) {
    map[obj.id] = index;
    return map;
}

var mbData = {
    "sources": [
        //STB
        /*creerSource("2G_Orange_stb", vectorStr, "mapbox://stephanedeboysson.44l3bowe"),
        creerCompositeSources("2G_stb", ["2G_Orange_stb"]),*/

        creerSource("stb_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("stb_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        creerSource("stb_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("stb_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
        creerSource("stb_sites", vectorStr, pyloneSourceOutremerId),
        creerSource("2G_Digicel_stb", vectorStr, "mapbox://stephanedeboysson.7jychydx"),// MAJ le 11 mars. 2022
        creerSource("2G3G_Digicel_stb",vectorStr,"mapbox://stephanedeboysson.2k6ccqyd"),// MAJ le 11 mars. 2022
        creerSource("3G_Digicel_stb", vectorStr, "mapbox://stephanedeboysson.cvbjyhn4"),// MAJ le 11 mars. 2022
		creerSource("4G_Digicel_stb", vectorStr, "mapbox://stephanedeboysson.2xg8pfui"), // MAJ le 11 mars. 2022
        creerSource("2G_Orange_stb", vectorStr, "mapbox://stephanedeboysson.8lklnj9c"),// MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_stb",vectorStr,"mapbox://stephanedeboysson.aipljni5"),// MAJ le 11 mars. 2022
        creerSource("3G_Orange_stb", vectorStr, "mapbox://stephanedeboysson.366clxni"),// MAJ le 11 mars. 2022
        creerSource("4G_Orange_stb", vectorStr, "mapbox://stephanedeboysson.806hrlqs"), // MAJ le 11 mars. 2022
        //creerSource("2G_DT_stb", vectorStr, "mapbox://stephanedeboysson.0c0sz6z9"), **pas de carte 2G au T4 2020
        creerSource("2G3G_DT_stb", vectorStr, "mapbox://stephanedeboysson.2ja2tcnz"),// MAJ le 11 mars. 2022
        creerSource("3G_DT_stb", vectorStr, "mapbox://stephanedeboysson.2kkr1ymc"),// MAJ le 11 mars. 2022
        creerSource("4G_DT_stb", vectorStr, "mapbox://stephanedeboysson.45qshqp4"), // MAJ le 11 mars. 2022
        creerCompositeSources("2G_stb", ["2G_Digicel_stb", "2G_Orange_stb"/*, "2G_DT_stb"*/]),
        creerCompositeSources("2G3G_stb", ["2G3G_Digicel_stb", "2G3G_Orange_stb", "2G3G_DT_stb"]),
        creerCompositeSources("3G_stb", ["3G_Digicel_stb", "3G_Orange_stb", "3G_DT_stb"]),
        creerCompositeSources("4G_stb", ["4G_Digicel_stb", "4G_Orange_stb", "4G_DT_stb"]),
        //STM
        /*creerSource("4G_Digicel_stm", vectorStr, "mapbox://stephanedeboysson.02gaqqzx"),
        creerCompositeSources("4G_stm", ["4G_Digicel_stm"]),*/
        creerSource("stm_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("stm_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        creerSource("stm_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("stm_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
       //creerSource("stm_sites", vectorStr, "mapbox://stephanedeboysson.dtad9ota"), 
        creerSource("stm_sites", vectorStr, pyloneSourceOutremerId),
        creerSource("2G_Digicel_stm", vectorStr, "mapbox://stephanedeboysson.495a3ffk"),// MAJ le 11 mars. 2022
        creerSource("2G3G_Digicel_stm", vectorStr, "mapbox://stephanedeboysson.2gn8anvk"),// MAJ le 11 mars. 2022
        creerSource("3G_Digicel_stm", vectorStr, "mapbox://stephanedeboysson.cz8yblcf"),// MAJ le 11 mars. 2022
		creerSource("4G_Digicel_stm", vectorStr, "mapbox://stephanedeboysson.6wtgjtsc"), // MAJ le 10 mars. 2022
        creerSource("2G_Orange_stm", vectorStr, "mapbox://stephanedeboysson.7gm3zdrf"),// MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_stm", vectorStr, "mapbox://stephanedeboysson.5gjwyett"),// MAJ le 11 mars. 2022
        creerSource("3G_Orange_stm", vectorStr, "mapbox://stephanedeboysson.cayynk2f"),// MAJ le 11 mars. 2022
        creerSource("4G_Orange_stm", vectorStr, "mapbox://stephanedeboysson.0p9g01r5"), // MAJ le 11 mars. 2022
        //creerSource("2G_DT_stm", vectorStr, "mapbox://stephanedeboysson.3i8ok0aq"), **Dauphin a éteint la 2G au T3 2020
        //en théorie, il faudrait ici la carte 2G3G voix de Dauphin (qui correspondrait à une carte 3G voix en pratique)
        creerSource("2G3G_DT_stm", vectorStr, "mapbox://stephanedeboysson.0nj17ut1"),// MAJ le 11 mars. 2022
        creerSource("3G_DT_stm", vectorStr, "mapbox://stephanedeboysson.30owhtz0"),// MAJ le 11 mars. 2022
        creerSource("4G_DT_stm", vectorStr, "mapbox://stephanedeboysson.cmb63hzt"), // MAJ le 11 mars. 2022
        creerSource("2G3G_UTS_stm", vectorStr, "mapbox://stephanedeboysson.2etimwp4"),// MAJ le 12 mars. 2022
        creerSource("3G_UTS_stm", vectorStr, "mapbox://stephanedeboysson.8mes5pnx"), // MAJ le 11 mars. 2022
        creerCompositeSources("2G_stm", ["2G_Digicel_stm", "2G_Orange_stm"]),
        creerCompositeSources("2G3G_stm", ["2G3G_Digicel_stm", "2G3G_Orange_stm", "2G3G_DT_stm", "2G3G_UTS_stm"]),
        creerCompositeSources("3G_stm", ["3G_Digicel_stm", "3G_Orange_stm", "3G_DT_stm", "3G_UTS_stm"]),
        //creerCompositeSources("3G_stm", ["3G_Digicel_stm", "3G_Orange_stm", "3G_DT_stm"]),
        creerCompositeSources("4G_stm", ["4G_Digicel_stm", "4G_Orange_stm", "4G_DT_stm"]),
        
        
        // Guadeloupe
        creerSource("guadeloupe_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("guadeloupe_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        
        //version en ligne
        //creerSource("guadeloupe_QoS_agglos_data_arcep", vectorStr, "mapbox://stephanedeboysson.1icvyotu"),
        //creerSource("guadeloupe_QoS_agglos_voix_arcep", vectorStr, "mapbox://stephanedeboysson.3dusii74"),
        
        // version OK NOK succes 3G succès 4G
        //creerSource("guadeloupe_QoS_agglos_data_arcep", vectorStr, "mapbox://stephanedeboysson.bqhk67ml"),
        
        //version 0 et 1 "numeric"
        creerSource("guadeloupe_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("guadeloupe_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
        creerSource("guadeloupe_sites", vectorStr, pyloneSourceOutremerId),//MAJ le 11 mars. 2022
        creerSource("2G_Digicel_guadeloupe", vectorStr, "mapbox://stephanedeboysson.dwj3pv83"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Digicel_guadeloupe", vectorStr,"mapbox://stephanedeboysson.4miux7nd"),//MAJ le 11 mars. 2022
        creerSource("3G_Digicel_guadeloupe", vectorStr, "mapbox://stephanedeboysson.2tvjtf5f"),//MAJ le 11 mars. 2022
		creerSource("4G_Digicel_guadeloupe", vectorStr, "mapbox://stephanedeboysson.7qqiadpi"), //MAJ le 11 mars. 2022
        creerSource("2G_Orange_guadeloupe", vectorStr, "mapbox://stephanedeboysson.5j1bh2ul"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_guadeloupe", vectorStr, "mapbox://stephanedeboysson.cyu0jbax"),//MAJ le 11 mars. 2022
        creerSource("3G_Orange_guadeloupe", vectorStr, "mapbox://stephanedeboysson.8a4ny2ea"),//MAJ le 11 mars. 2022
        creerSource("4G_Orange_guadeloupe", vectorStr, "mapbox://stephanedeboysson.61ybe6lm"), //MAJ le 11 mars. 2022
        creerSource("2G_OMT_guadeloupe", vectorStr, "mapbox://stephanedeboysson.75jp84lr"),//MAJ le 11 mars. 2022
        creerSource("2G3G_OMT_guadeloupe", vectorStr, "mapbox://stephanedeboysson.ay1hl9ph"),//MAJ le 11 mars. 2022
        creerSource("3G_OMT_guadeloupe", vectorStr, "mapbox://stephanedeboysson.6d5vab6e"),//MAJ le 11 mars. 2022
        creerSource("4G_OMT_guadeloupe", vectorStr, "mapbox://stephanedeboysson.c0flwneb"), //MAJ le 11 mars. 2022
        creerCompositeSources("2G_guadeloupe", ["2G_Digicel_guadeloupe", "2G_Orange_guadeloupe", "2G_OMT_guadeloupe"]),
        creerCompositeSources("2G3G_guadeloupe", ["2G3G_Digicel_guadeloupe", "2G3G_Orange_guadeloupe", "2G3G_OMT_guadeloupe"]),
        creerCompositeSources("3G_guadeloupe", ["3G_Digicel_guadeloupe", "3G_Orange_guadeloupe", "3G_OMT_guadeloupe"]),
        creerCompositeSources("4G_guadeloupe", ["4G_Digicel_guadeloupe", "4G_Orange_guadeloupe", "4G_OMT_guadeloupe"]),
        
        
        // Guyane
        creerSource("guyane_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("guyane_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        creerSource("guyane_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("guyane_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
        //creerSource("guyane_sites", vectorStr, "mapbox://stephanedeboysson.01lnbevc"),
        creerSource("guyane_sites", vectorStr, pyloneSourceOutremerId),
        creerSource("2G_Digicel_guyane", vectorStr, "mapbox://stephanedeboysson.a9qp7odr"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Digicel_guyane", vectorStr, "mapbox://stephanedeboysson.59iv22jc"),//MAJ le 11 mars. 2022
        creerSource("3G_Digicel_guyane", vectorStr, "mapbox://stephanedeboysson.1uhrvgfj"),//MAJ le 11 mars. 2022
		creerSource("4G_Digicel_guyane", vectorStr, "mapbox://stephanedeboysson.6vp2lgaq"), //MAJ le 11 mars. 2022
        creerSource("2G_Orange_guyane", vectorStr, "mapbox://stephanedeboysson.aubq044r"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_guyane", vectorStr, "mapbox://stephanedeboysson.96ndjild"),//MAJ le 11 mars. 2022
        creerSource("3G_Orange_guyane", vectorStr, "mapbox://stephanedeboysson.afro299f"),//MAJ le 11 mars. 2022
        creerSource("4G_Orange_guyane", vectorStr, "mapbox://stephanedeboysson.9w5px187"), //MAJ le 11 mars. 2022
        creerSource("2G_OMT_guyane", vectorStr, "mapbox://stephanedeboysson.b8r93v4z"),//MAJ le 11 mars. 2022
        creerSource("2G3G_OMT_guyane", vectorStr, "mapbox://stephanedeboysson.8hnpgfvk"),//MAJ le 11 mars. 2022
        creerSource("3G_OMT_guyane", vectorStr, "mapbox://stephanedeboysson.0m6rj2py"),//MAJ le 11 mars. 2022
        creerSource("4G_OMT_guyane", vectorStr, "mapbox://stephanedeboysson.alg5ohv2"), //MAJ le 11 mars. 2022
        creerCompositeSources("2G_guyane", ["2G_Digicel_guyane", "2G_Orange_guyane", "2G_OMT_guyane"]),
        creerCompositeSources("2G3G_guyane", ["2G3G_Digicel_guyane", "2G3G_Orange_guyane", "2G3G_OMT_guyane"]),
        creerCompositeSources("3G_guyane", ["3G_Digicel_guyane", "3G_Orange_guyane", "3G_OMT_guyane"]),
        creerCompositeSources("4G_guyane", ["4G_Digicel_guyane", "4G_Orange_guyane", "4G_OMT_guyane"]),
        
        
        // Martinique
        creerSource("martinique_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("martinique_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        creerSource("martinique_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("martinique_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
        //creerSource("martinique_sites", vectorStr, "mapbox://stephanedeboysson.17xy1l63"),
        creerSource("martinique_sites", vectorStr, pyloneSourceOutremerId), 
        creerSource("2G_Orange_martinique", vectorStr, "mapbox://stephanedeboysson.4vmfbcfb"), //MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_martinique", vectorStr, "mapbox://stephanedeboysson.9oq45hbh"),//MAJ le 11 mars. 2022
        creerSource("3G_Orange_martinique", vectorStr, "mapbox://stephanedeboysson.1csnbwzn"),//MAJ le 11 mars. 2022
        creerSource("4G_Orange_martinique", vectorStr, "mapbox://stephanedeboysson.d1pyz09d"), //MAJ le 11 mars. 2022
        creerSource("2G_Digicel_martinique", vectorStr, "mapbox://stephanedeboysson.domj25s6"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Digicel_martinique", vectorStr, "mapbox://stephanedeboysson.awcermct"),//MAJ le 11 mars. 2022
        creerSource("3G_Digicel_martinique", vectorStr, "mapbox://stephanedeboysson.db9q5zx3"),//MAJ le 11 mars. 2022
		creerSource("4G_Digicel_martinique", vectorStr, "mapbox://stephanedeboysson.2v7zncpo"), //MAJ le 11 mars. 2022
        creerSource("2G_OMT_martinique", vectorStr, "mapbox://stephanedeboysson.9vwuhpey"),//MAJ le 11 mars. 2022
        creerSource("2G3G_OMT_martinique", vectorStr, "mapbox://stephanedeboysson.cnew651d"),//MAJ le 11 mars. 2022
        creerSource("3G_OMT_martinique", vectorStr, "mapbox://stephanedeboysson.1ybcpy6j"),//MAJ le 11 mars. 2022
        creerSource("4G_OMT_martinique", vectorStr, "mapbox://stephanedeboysson.cwiiqex8"), //MAJ le 11 mars. 2022
        creerCompositeSources("2G_martinique", ["2G_Orange_martinique", "2G_Digicel_martinique", "2G_OMT_martinique"]),
        creerCompositeSources("2G3G_martinique", ["2G3G_Orange_martinique", "2G3G_Digicel_martinique", "2G3G_OMT_martinique"]),
        creerCompositeSources("3G_martinique", ["3G_Orange_martinique", "3G_Digicel_martinique", "3G_OMT_martinique"]),
        creerCompositeSources("4G_martinique", ["4G_Orange_martinique", "4G_Digicel_martinique", "4G_OMT_martinique"]),
        
        
        // Mayotte
        creerSource("mayotte_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("mayotte_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        creerSource("mayotte_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("mayotte_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
        creerSource("mayotte_sites", vectorStr, pyloneSourceOutremerId),
        creerSource("2G_SRR_mayotte", vectorStr, "mapbox://stephanedeboysson.a76igx6n"),//MAJ le 11 mars. 2022
        creerSource("2G3G_SRR_mayotte", vectorStr, "mapbox://stephanedeboysson.dgxhdkcx"),//MAJ le 11 mars. 2022
        creerSource("3G_SRR_mayotte", vectorStr, "mapbox://stephanedeboysson.2an1lg66"),//MAJ le 11 mars. 2022
        creerSource("4G_SRR_mayotte", vectorStr, "mapbox://stephanedeboysson.5e46sv71"), //MAJ le 11 mars. 2022
        creerSource("2G_BJT_mayotte", vectorStr, "mapbox://stephanedeboysson.1div0ciy"),//MAJ le 11 mars. 2022
        creerSource("2G3G_BJT_mayotte", vectorStr, "mapbox://stephanedeboysson.bgwz5pyl"), //MAJ le 11 mars. 2022  
    	creerSource("4G_BJT_mayotte", vectorStr, "mapbox://stephanedeboysson.5so04c8j"), //MAJ le 11 mars. 2022  
        creerSource("2G_FM_mayotte", vectorStr, "mapbox://stephanedeboysson.8x3tnicn"),//MAJ le 11 mars. 2022
        creerSource("2G3G_FM_mayotte", vectorStr, "mapbox://stephanedeboysson.27r019qi"),//MAJ le 11 mars. 2022
        creerSource("3G_FM_mayotte", vectorStr, "mapbox://stephanedeboysson.4zy5migv"),//MAJ le 11 mars. 2022
        creerSource("4G_FM_mayotte", vectorStr, "mapbox://stephanedeboysson.dzdql4fd"), //MAJ le 11 mars. 2022
        creerSource("2G_Orange_mayotte", vectorStr, "mapbox://stephanedeboysson.57gzaera"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_mayotte", vectorStr, "mapbox://stephanedeboysson.c71f9okc"),//MAJ le 11 mars. 2022
        creerSource("3G_Orange_mayotte", vectorStr, "mapbox://stephanedeboysson.64gcuts8"),//MAJ le 11 mars. 2022
        creerSource("4G_Orange_mayotte", vectorStr, "mapbox://stephanedeboysson.0ozu2kyy"), //MAJ le 11 mars. 2022
        creerCompositeSources("2G_mayotte", ["2G_SRR_mayotte", "2G_BJT_mayotte", "2G_FM_mayotte", "2G_Orange_mayotte"]),
        creerCompositeSources("2G3G_mayotte", ["2G3G_SRR_mayotte", "2G3G_BJT_mayotte", "2G3G_FM_mayotte", "2G3G_Orange_mayotte"]),
        creerCompositeSources("3G_mayotte", ["3G_SRR_mayotte", "3G_FM_mayotte", "3G_Orange_mayotte"]), // Attention aujourd'hui il n'y a pas de couverture de Maore, qui n'a pas de 3G
        creerCompositeSources("4G_mayotte", ["4G_BJT_mayotte", "4G_SRR_mayotte","4G_FM_mayotte", "4G_Orange_mayotte"]),
        
        
        // La Réunion
        creerSource("la_reunion_QoS_transports_data_arcep", vectorStr, QoStransportsDataSourceOutremerId),
        creerSource("la_reunion_QoS_transports_voix_arcep", vectorStr, QoStransportsVoixSourceOutremerId),
        creerSource("la_reunion_QoS_agglos_data_arcep", vectorStr, QoSaggloDataSourceOutremerId),
        creerSource("la_reunion_QoS_agglos_voix_arcep", vectorStr, QoSaggloVoixSourceOutremerId),
        creerSource("la_reunion_sites", vectorStr, pyloneSourceOutremerId),
        creerSource("2G_SRR_la_reunion", vectorStr, "mapbox://stephanedeboysson.0vmnwnzg"),//MAJ le 11 mars. 2022
        creerSource("2G3G_SRR_la_reunion", vectorStr, "mapbox://stephanedeboysson.8m7eyqsu"),//MAJ le 11 mars. 2022
        creerSource("3G_SRR_la_reunion", vectorStr, "mapbox://stephanedeboysson.5urkcmre"),//MAJ le 11 mars. 2022
        creerSource("4G_SRR_la_reunion", vectorStr, "mapbox://stephanedeboysson.11wc96ro"), //MAJ le 11 mars. 2022
        creerSource("2G_Orange_la_reunion", vectorStr, "mapbox://stephanedeboysson.6bmtlzui"),//MAJ le 11 mars. 2022
        creerSource("2G3G_Orange_la_reunion", vectorStr, "mapbox://stephanedeboysson.79tjson8"),//MAJ le 11 mars. 2022
        creerSource("3G_Orange_la_reunion", vectorStr, "mapbox://stephanedeboysson.3snw4upp"),//MAJ le 11 mars. 2022
        creerSource("4G_Orange_la_reunion", vectorStr, "mapbox://stephanedeboysson.14tm1w04"), //MAJ le 11 mars. 2022
        creerSource("2G_FM_la_reunion", vectorStr, "mapbox://stephanedeboysson.82nw5kks"),//MAJ le 11 mars. 2022
        creerSource("2G3G_FM_la_reunion", vectorStr, "mapbox://stephanedeboysson.awiv94kc"),//MAJ le 11 mars. 2022
        creerSource("3G_FM_la_reunion", vectorStr, "mapbox://stephanedeboysson.7dmg1hbq"),//MAJ le 11 mars. 2022
        creerSource("4G_FM_la_reunion", vectorStr, "mapbox://stephanedeboysson.8yceklag"), //MAJ le 11 mars. 2022
        creerSource("2G_Zeop_la_reunion", vectorStr, "mapbox://stephanedeboysson.4g9ab4kc"),//MAJ le 12 mars. 2022
        creerSource("2G3G_Zeop_la_reunion", vectorStr, "mapbox://stephanedeboysson.32udsvfy"),//MAJ le 11 mars. 2022
        creerSource("3G_Zeop_la_reunion", vectorStr, "mapbox://stephanedeboysson.d7xokgts"),//MAJ le 11 mars. 2022
        creerSource("4G_Zeop_la_reunion", vectorStr, "mapbox://stephanedeboysson.4wcndbsp"), //MAJ le 11 mars. 2022
        creerCompositeSources("2G_la_reunion", ["2G_SRR_la_reunion", "2G_Orange_la_reunion", "2G_FM_la_reunion", "2G_Zeop_la_reunion"]),
        creerCompositeSources("2G3G_la_reunion", ["2G3G_SRR_la_reunion", "2G3G_Orange_la_reunion", "2G3G_FM_la_reunion", "2G3G_Zeop_la_reunion"]),
        creerCompositeSources("3G_la_reunion", ["3G_SRR_la_reunion", "3G_Orange_la_reunion", "3G_FM_la_reunion", "3G_Zeop_la_reunion"]),
        creerCompositeSources("4G_la_reunion", ["4G_SRR_la_reunion", "4G_Orange_la_reunion", "4G_FM_la_reunion", "4G_Zeop_la_reunion"]),
        
        
        // Métropole
        creerSource("metropole_QoS_transports_data_arcep", vectorStr, "mapbox://stephanedeboysson.077kv91f"), // prev : stephanedeboysson.dzdc3oby
        creerSource("metropole_QoS_transports_voix_arcep", vectorStr, "mapbox://stephanedeboysson.1v8xuruj"), // prev : stephanedeboysson.80dyards
        creerSource("metropole_QoS_transports_data_sncf", vectorStr, "mapbox://stephanedeboysson.52uub4b1"),
        //creerSource("metropole_QoS_agglos_data_aura", vectorStr, "mapbox://stephanedeboysson.3xci447m"),
        creerSource("metropole_QoS_agglos_data_aura_2", vectorStr, "mapbox://stephanedeboysson.8tohk1tz"),
        //creerSource("metropole_QoS_agglos_data_cher", vectorStr, "mapbox://stephanedeboysson.d0ze8w92"),
        //creerSource("metropole_QoS_agglos_data_hdfDebits", vectorStr, "mapbox://stephanedeboysson.chjmjma0"),
        //creerSource("metropole_QoS_agglos_data_pdl2019", vectorStr, "mapbox://stephanedeboysson.07un1e4p"),
        //creerSource("metropole_QoS_agglos_data_pdl2020", vectorStr, "mapbox://stephanedeboysson.2ctyo9fy"),
        creerSource("metropole_QoS_agglos_data_pdl2020_2", vectorStr, "mapbox://stephanedeboysson.9ubsga50"),
        creerSource("metropole_QoS_agglos_data_arcep", vectorStr, "mapbox://stephanedeboysson.42ac4kba"), // prev : stephanedeboysson.c1vgnu3p
        creerSource("metropole_QoS_agglos_voix_arcep", vectorStr, "mapbox://stephanedeboysson.7ygvm214"), // prev : stephanedeboysson.c59doz6x
        //creerSource("metropole_QoS_agglos_data_lieusaint", vectorStr, "mapbox://stephanedeboysson.29cyraao"),
        creerSource("metropole_QoS_agglos_data_cd43", vectorStr, "mapbox://stephanedeboysson.bspc5lhw"),
        creerSource("metropole_QoS_agglos_data_qosi", vectorStr, "mapbox://stephanedeboysson.879e36sg"),
        creerSource("metropole_QoS_agglos_data_bfc", vectorStr, "mapbox://stephanedeboysson.48pfkxge"), // prev : stephanedeboysson.6af4i9pt
        creerSource("metropole_QoS_agglos_data_bfc2", vectorStr, "mapbox://stephanedeboysson.dm6zahio"),

        //test intégration crowd
        //creerSource("metropole_crowd_data_crowd1", vectorStr, "mapbox://stephanedeboysson.6af4i9pt"),

        // -- Mozark
        // - DL
        creerSource("metropole_crowd_data_crowd2", vectorStr, "mapbox://stephanedeboysson.7juxe614"),
        creerSource("guyane_crowd_data_crowd2", vectorStr, "mapbox://stephanedeboysson.6c28oxjl"),
        creerSource("guadeloupe_crowd_data_crowd2", vectorStr, "mapbox://stephanedeboysson.94mlq3dh"),
        creerSource("martinique_crowd_data_crowd2", vectorStr, "mapbox://stephanedeboysson.7ywt7er2"),
        creerSource("la_reunion_crowd_data_crowd2", vectorStr, "mapbox://stephanedeboysson.5zf4evc9"),
        // - WEB
        creerSource("metropole_crowd_data_crowd3", vectorStr, "mapbox://stephanedeboysson.2r13lu0x"),
        creerSource("guyane_crowd_data_crowd3", vectorStr, "mapbox://stephanedeboysson.7a2hh1tm"),
        creerSource("guadeloupe_crowd_data_crowd3", vectorStr, "mapbox://stephanedeboysson.dc63j03a"),
        creerSource("martinique_crowd_data_crowd3", vectorStr, "mapbox://stephanedeboysson.30uc6khb"),
        creerSource("la_reunion_crowd_data_crowd3", vectorStr, "mapbox://stephanedeboysson.7kyaevd2"),

        // -- Tadurezo
        // - DL
        creerSource("metropole_crowd_data_crowd4", vectorStr, "mapbox://stephanedeboysson.303l54yp"),
        // - WEB
        creerSource("metropole_crowd_data_crowd5", vectorStr, "mapbox://stephanedeboysson.3klmy7ce"),

        // -- SpeedChecker
        creerSource("metropole_crowd_data_crowd1", vectorStr, "mapbox://stephanedeboysson.8uus3s3p"),
        //fin test intégration crowd

        //creerSource("metropole_sites", vectorStr, "mapbox://stephanedeboysson.117k2wdv"),
        creerSource("metropole_sites", vectorStr, "mapbox://stephanedeboysson.47eilztu"),
        //creerSource("metropole_sites", vectorStr, "mapbox://stephanedeboysson.74uy0p7u"),
        //creerSource("metropole_sites", vectorStr, "mapbox://stephanedeboysson.3juwz2fk"),
        //creerSource("metropole_sites", vectorStr, "mapbox://stephanedeboysson.4q0f89q7"),
        creerSource("metropole_touristique_text", vectorStr, "mapbox://stephanedeboysson.72t84b62"),
        creerSource("2G_Bouygues", vectorStr, "mapbox://stephanedeboysson.1c2c3s2t"),
        creerSource("2G_Free", vectorStr, "mapbox://stephanedeboysson.2d9g748l"),
        creerSource("2G_Orange", vectorStr, "mapbox://stephanedeboysson.9zwv00js"),
        creerSource("2G_SFR", vectorStr, "mapbox://stephanedeboysson.44k24xob"),
        // AJOUT 2G3G TEST
        creerSource("2G3G_Bouygues", vectorStr, "mapbox://stephanedeboysson.5p85bnd1"),
        creerSource("2G3G_Free", vectorStr, "mapbox://stephanedeboysson.2lz6mbyo"),
        creerSource("2G3G_Orange", vectorStr, "mapbox://stephanedeboysson.1sipvdvd"),
        creerSource("2G3G_SFR", vectorStr, "mapbox://stephanedeboysson.1ukl1p4t"),
        // FIN TEST
        creerSource("3G_Bouygues", vectorStr, "mapbox://stephanedeboysson.dlb740qp"),
        creerSource("3G_Free", vectorStr, "mapbox://stephanedeboysson.8qjoc82j"),
        creerSource("3G_Orange", vectorStr, "mapbox://stephanedeboysson.1494f46l"),
        creerSource("3G_SFR", vectorStr, "mapbox://stephanedeboysson.8fanlu9a"),
        creerSource("4G_Bouygues", vectorStr, "mapbox://stephanedeboysson.dvbjeo9s"), // 13 dec. 2021
        creerSource("4G_Free", vectorStr, "mapbox://stephanedeboysson.7thrd0rh"), // 13 dec. 2021
        creerSource("4G_Orange", vectorStr, "mapbox://stephanedeboysson.1v7tevu3"), // 13 dec. 2021
        creerSource("4G_SFR", vectorStr, "mapbox://stephanedeboysson.aznxdplb"), // 13 dec. 2021
        //creerSource("4G_Bouygues", vectorStr, "mapbox://stephanedeboysson.985b2pe5"),
        //creerSource("4G_Free", vectorStr, "mapbox://stephanedeboysson.aznh2stg"),
        //creerSource("4G_Orange", vectorStr, "mapbox://stephanedeboysson.7zcpjt0f"),
		//creerSource("4G_Orange_diff", vectorStr, "mapbox://stephanedeboysson.429nd7t3"),
        //creerSource("4G_SFR", vectorStr, "mapbox://stephanedeboysson.4akvz8qj"),
        creerCompositeSources("2G_metropole", ["2G_Bouygues", "2G_Free", "2G_Orange", "2G_SFR"]),
        // AJOUT 2G3G TEST
        creerCompositeSources("2G3G_metropole", ["2G3G_Bouygues", "2G3G_Free", "2G3G_Orange", "2G3G_SFR"]),
        //FIN TEST
        creerCompositeSources("3G_metropole", ["3G_Bouygues", "3G_Free", "3G_Orange", "3G_SFR"]),
        creerCompositeSources("4G_metropole", ["4G_Bouygues" ,"4G_Free", "4G_Orange", "4G_SFR"]),
    ],
    "layers": [
        // saint-barth
        creerLayer("stb_QoS_transports_voix_arcep", "stb_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("stb_QoS_transports_data_arcep", "stb_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        creerLayer("stb_QoS_agglos_voix_arcep", "stb_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("stb_QoS_agglos_data_arcep", "stb_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),
        creerLayer("stb_sites", "stb_sites", pyloneLayerOutremerId),
        creerLayerCouverture("2G_Digicel_stb", fillStr, "2G_stb", "STB_DIGIC_couv_2G_voix_2021_T4", multipleColorsDefault),// 11 mars. 2022
        creerLayerCouverture("2G3G_Digicel_stb",fillStr,"2G3G_stb","STB_DIGIC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// 11 mars. 2022
        creerLayerCouverture("3G_Digicel_stb", fillStr, "3G_stb", "STB_DIGIC_couv_3G_data_2021_T4", monoColorDefault),// 11 mars. 2022
		creerLayerCouverture("4G_Digicel_stb", fillStr, "4G_stb", "STB_DIGIC_couv_4G_data_2021_T4", monoColorDefault), // 11 mars. 2022
        creerLayerCouverture("2G_Orange_stb", fillStr, "2G_stb", "STB_ORCA_couv_2G_voix_2021_T4", multipleColorsDefault),// 11 mars. 2022
        creerLayerCouverture("2G3G_Orange_stb", fillStr,"2G3G_stb", "STB_ORCA_couv_2G3G_voix_2021_T4", multipleColorsDefault),// 11 mars. 2022
        creerLayerCouverture("3G_Orange_stb", fillStr, "3G_stb", "STB_ORCA_couv_3G_data_2021_T4", monoColorDefault),// 11 mars. 2022
        creerLayerCouverture("4G_Orange_stb", fillStr, "4G_stb", "STB_ORCA_couv_4G_data_2021_T4", monoColorDefault), // 11 mars. 2022
        //creerLayerCouverture("2G_DT_stb", fillStr, "2G_stb", "STB_DAUPH_couv_2G_voix_2020_T2", multipleColorsDefault), **pas de données au T42 020
        creerLayerCouverture("2G3G_DT_stb",fillStr,"2G3G_stb", "STB_DAUPH_couv_2G3G_voix_2021_T4", multipleColorsDefault),// 11 mars. 2022
        creerLayerCouverture("3G_DT_stb", fillStr, "3G_stb", "STB_DAUPH_couv_3G_data_2021_T4", monoColorDefault),// 11 mars. 2022
        creerLayerCouverture("4G_DT_stb", fillStr, "4G_stb", "STB_DAUPH_couv_4G_data_2021_T4", monoColorDefault), // 11 mars. 2022
        //creerLayerCouverture("3G_UTS_stb", fillStr, "3G_stb", "STB_UTS_couv_3G_data_2019_T2", monoColorDefault), **UTS a rendu les fréquences donc normalement plus à afficher
       
       
        //STM
        creerLayer("stm_QoS_transports_voix_arcep", "stm_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("stm_QoS_transports_data_arcep", "stm_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        creerLayer("stm_QoS_agglos_voix_arcep", "stm_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("stm_QoS_agglos_data_arcep", "stm_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),
        //creerLayer("stm_sites", "STM_sites", "sites_STM-3iilnf"),
        creerLayer("stm_sites", "stm_sites", pyloneLayerOutremerId),
        creerLayerCouverture("2G_Digicel_stm", fillStr, "2G_stm", "STM_DIGIC_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Digicel_stm", fillStr, "2G3G_stm", "STM_DIGIC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Digicel_stm", fillStr, "3G_stm", "STM_DIGIC_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
		creerLayerCouverture("4G_Digicel_stm", fillStr, "4G_stm", "STM_DIGIC_couv_4G_data_2021_T4", monoColorDefault), // maj le 10/03/2022
        creerLayerCouverture("2G_Orange_stm", fillStr, "2G_stm", "STM_ORCA_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 10/03/2022
        creerLayerCouverture("2G3G_Orange_stm", fillStr, "2G3G_stm","STM_ORCA_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 10/03/2022
        creerLayerCouverture("3G_Orange_stm", fillStr, "3G_stm", "STM_ORCA_couv_3G_data_2021_T4", monoColorDefault),// maj le 10/03/2022
        creerLayerCouverture("4G_Orange_stm", fillStr, "4G_stm", "STM_ORCA_couv_4G_data_2021_T4", monoColorDefault), // maj le 10/03/2022
        //creerLayerCouverture("2G_DT_stm", fillStr, "2G_stm", "STM_DAUPH_couv_2G_voix_2020_T2", multipleColorsDefault), **eteint la 2G au T3 2020
        creerLayerCouverture("2G3G_DT_stm", fillStr, "2G3G_stm", "STM_DAUPH_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_DT_stm", fillStr, "3G_stm", "STM_DAUPH_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_DT_stm", fillStr, "4G_stm", "STM_DAUPH_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G3G_UTS_stm", fillStr, "2G3G_stm", "STM_UTS_couv_2G3G_voix_2021_T4", monoColorDefault),// maj le 12/03/2022
        creerLayerCouverture("3G_UTS_stm", fillStr, "3G_stm", "STM_UTS_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        
        
        // Guadeloupe
        creerLayer("guadeloupe_QoS_transports_voix_arcep", "guadeloupe_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("guadeloupe_QoS_transports_data_arcep", "guadeloupe_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        
        //version en ligne
        //creerLayer("guadeloupe_QoS_agglos_voix_arcep", "guadeloupe_QoS_agglos_voix_arcep", "QoS_Guadeloupe_Agglos_voix-b5ez5h"),
        //creerLayer("guadeloupe_QoS_agglos_data_arcep", "guadeloupe_QoS_agglos_data_arcep", "QoS_Guadeloupe_Agglos_data-8weccw"),
        
        // version OK NOK succès 3G et 4G
        //creerLayer("guadeloupe_QoS_agglos_voix_arcep", "guadeloupe_QoS_agglos_voix_arcep", "QoS_Guadeloupe_Agglos_voix-b5ez5h"),
        //creerLayer("guadeloupe_QoS_agglos_data_arcep", "guadeloupe_QoS_agglos_data_arcep", "QoS_GUA_Agglos_data_4"),
        
        
        // version 0 et 1 numeric
        creerLayer("guadeloupe_QoS_agglos_voix_arcep", "guadeloupe_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("guadeloupe_QoS_agglos_data_arcep", "guadeloupe_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),

        //creerLayer("guadeloupe_sites", "guadeloupe_sites", "sites_Guadeloupe-3iilnf"),
        creerLayer("guadeloupe_sites", "guadeloupe_sites", pyloneLayerOutremerId),
        creerLayerCouverture("2G_Digicel_guadeloupe", fillStr, "2G_guadeloupe", "GUA_DIGIC_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Digicel_guadeloupe",fillStr,"2G3G_guadeloupe", "GUA_DIGIC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Digicel_guadeloupe", fillStr, "3G_guadeloupe", "GUA_DIGIC_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
		creerLayerCouverture("4G_Digicel_guadeloupe", fillStr, "4G_guadeloupe", "GUA_DIGIC_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_Orange_guadeloupe", fillStr, "2G_guadeloupe", "GUA_ORCA_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Orange_guadeloupe", fillStr, "2G3G_guadeloupe", "GUA_ORCA_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Orange_guadeloupe", fillStr, "3G_guadeloupe", "GUA_ORCA_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_Orange_guadeloupe", fillStr, "4G_guadeloupe", "GUA_ORCA_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_OMT_guadeloupe", fillStr, "2G_guadeloupe", "GUA_OMT_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_OMT_guadeloupe", fillStr, "2G3G_guadeloupe", "GUA_OMT_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_OMT_guadeloupe", fillStr, "3G_guadeloupe", "GUA_OMT_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_OMT_guadeloupe", fillStr, "4G_guadeloupe", "GUA_OMT_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        
        
        // Guyane
        creerLayer("guyane_QoS_transports_voix_arcep", "guyane_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("guyane_QoS_transports_data_arcep", "guyane_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        creerLayer("guyane_QoS_agglos_voix_arcep", "guyane_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("guyane_QoS_agglos_data_arcep", "guyane_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),
        //creerLayer("guyane_sites", "guyane_sites", "sites_Guyane-ad8epo"),
        creerLayer("guyane_sites", "guyane_sites", pyloneLayerOutremerId),
        creerLayerCouverture("2G_Digicel_guyane", fillStr, "2G_guyane", "GUY_DIGIC_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Digicel_guyane", fillStr, "2G3G_guyane", "GUY_DIGIC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Digicel_guyane", fillStr, "3G_guyane", "GUY_DIGIC_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
		creerLayerCouverture("4G_Digicel_guyane", fillStr, "4G_guyane", "GUY_DIGIC_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_Orange_guyane", fillStr, "2G_guyane", "GUY_ORCA_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Orange_guyane", fillStr, "2G3G_guyane", "GUY_ORCA_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Orange_guyane", fillStr, "3G_guyane", "GUY_ORCA_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_Orange_guyane", fillStr, "4G_guyane", "GUY_ORCA_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_OMT_guyane", fillStr, "2G_guyane", "GUY_OMT_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_OMT_guyane", fillStr, "2G3G_guyane", "GUY_OMT_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_OMT_guyane", fillStr, "3G_guyane", "GUY_OMT_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_OMT_guyane", fillStr, "4G_guyane", "GUY_OMT_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
       
       
        // Martinique
        creerLayer("martinique_QoS_transports_voix_arcep", "martinique_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("martinique_QoS_transports_data_arcep", "martinique_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        creerLayer("martinique_QoS_agglos_voix_arcep", "martinique_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("martinique_QoS_agglos_data_arcep", "martinique_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),
        //creerLayer("martinique_sites", "martinique_sites", "sites_Martinique-2psska"),
        creerLayer("martinique_sites", "martinique_sites", pyloneLayerOutremerId),
        creerLayerCouverture("2G_Digicel_martinique", fillStr, "2G_martinique", "MAR_DIGIC_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Digicel_martinique", fillStr, "2G3G_martinique", "MAR_DIGIC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Digicel_martinique", fillStr, "3G_martinique", "MAR_DIGIC_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
		creerLayerCouverture("4G_Digicel_martinique", fillStr, "4G_martinique", "MAR_DIGIC_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_Orange_martinique", fillStr, "2G_martinique", "MAR_ORCA_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Orange_martinique", fillStr, "2G3G_martinique", "MAR_ORCA_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Orange_martinique", fillStr, "3G_martinique", "MAR_ORCA_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_Orange_martinique", fillStr, "4G_martinique", "MAR_ORCA_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_OMT_martinique", fillStr, "2G_martinique", "MAR_OMT_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_OMT_martinique", fillStr, "2G3G_martinique", "MAR_OMT_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_OMT_martinique", fillStr, "3G_martinique", "MAR_OMT_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_OMT_martinique", fillStr, "4G_martinique", "MAR_OMT_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
       
       
        // Mayotte
        creerLayer("mayotte_QoS_transports_voix_arcep", "mayotte_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("mayotte_QoS_transports_data_arcep", "mayotte_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        creerLayer("mayotte_QoS_agglos_voix_arcep", "mayotte_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("mayotte_QoS_agglos_data_arcep", "mayotte_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),
        creerLayer("mayotte_sites", "mayotte_sites", pyloneLayerOutremerId),
        //creerLayerCouverture("2G_BJT_mayotte", fillStr, "2G_mayotte", "MAY_BJTP_couv_2G_voix_2019_T4", multipleColorsDefault), **Maore Mobile n'a pas envoyé de carte T2 2020
        creerLayerCouverture("2G_BJT_mayotte", fillStr, "2G_mayotte", "MAY_MAOR_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_BJT_mayotte", fillStr, "2G3G_mayotte", "MAY_MAOR_couv_2G3G_voix_2021_T4", multipleColorsDefault), // maj le 11/03/2022
        creerLayerCouverture("4G_BJT_mayotte", fillStr, "4G_mayotte", "MAY_MAOR_couv_4G_data_2021_T3", monoColorDefault), // maj le 12/03/2022
        creerLayerCouverture("2G_SRR_mayotte", fillStr, "2G_mayotte", "MAY_SRR_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_SRR_mayotte", fillStr, "2G3G_mayotte", "MAY_SRR_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_SRR_mayotte", fillStr, "3G_mayotte", "MAY_SRR_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_SRR_mayotte", fillStr, "4G_mayotte", "MAY_SRR_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_FM_mayotte", fillStr, "2G_mayotte", "MAY_TELC_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_FM_mayotte", fillStr, "2G3G_mayotte", "MAY_TELC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_FM_mayotte", fillStr, "3G_mayotte", "MAY_TELC_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_FM_mayotte", fillStr, "4G_mayotte", "MAY_TELC_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_Orange_mayotte", fillStr, "2G_mayotte", "MAY_OF_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Orange_mayotte", fillStr, "2G3G_mayotte", "MAY_OF_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Orange_mayotte", fillStr, "3G_mayotte", "MAY_OF_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_Orange_mayotte", fillStr, "4G_mayotte", "MAY_OF_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        
        
        // La Réunion
        creerLayer("la_reunion_QoS_transports_voix_arcep", "la_reunion_QoS_transports_voix_arcep", QoStransportsVoixLayerOutremerId, "numeric"),
        creerLayer("la_reunion_QoS_transports_data_arcep", "la_reunion_QoS_transports_data_arcep", QoStransportsDataLayerOutremerId, "numeric"),
        creerLayer("la_reunion_QoS_agglos_voix_arcep", "la_reunion_QoS_agglos_voix_arcep", QoSaggloVoixLayerOutremerId, "numeric"),
        creerLayer("la_reunion_QoS_agglos_data_arcep", "la_reunion_QoS_agglos_data_arcep", QoSaggloDataLayerOutremerId, "numeric"),
        creerLayer("la_reunion_sites", "la_reunion_sites", pyloneLayerOutremerId),
        //creerLayer("la_reunion_sites", "la_reunion_sites", "REU_sites_T4_2020"),
        creerLayerCouverture("2G_SRR_la_reunion", fillStr, "2G_la_reunion", "REU_SRR_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_SRR_la_reunion", fillStr, "2G3G_la_reunion", "REU_SRR_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_SRR_la_reunion", fillStr, "3G_la_reunion", "REU_SRR_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_SRR_la_reunion", fillStr, "4G_la_reunion", "REU_SRR_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_Orange_la_reunion", fillStr, "2G_la_reunion", "REU_OF_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Orange_la_reunion", fillStr, "2G3G_la_reunion", "REU_OF_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Orange_la_reunion", fillStr, "3G_la_reunion", "REU_OF_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_Orange_la_reunion", fillStr, "4G_la_reunion", "REU_OF_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_FM_la_reunion", fillStr, "2G_la_reunion", "REU_TELC_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_FM_la_reunion", fillStr, "2G3G_la_reunion", "REU_TELC_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_FM_la_reunion", fillStr, "3G_la_reunion", "REU_TELC_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_FM_la_reunion", fillStr, "4G_la_reunion", "REU_TELC_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
        creerLayerCouverture("2G_Zeop_la_reunion", fillStr, "2G_la_reunion", "REU_ZEOP_couv_2G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("2G3G_Zeop_la_reunion", fillStr, "2G3G_la_reunion", "REU_ZEOP_couv_2G3G_voix_2021_T4", multipleColorsDefault),// maj le 11/03/2022
        creerLayerCouverture("3G_Zeop_la_reunion", fillStr, "3G_la_reunion", "REU_ZEOP_couv_3G_data_2021_T4", monoColorDefault),// maj le 11/03/2022
        creerLayerCouverture("4G_Zeop_la_reunion", fillStr, "4G_la_reunion", "REU_ZEOP_couv_4G_data_2021_T4", monoColorDefault), // maj le 11/03/2022
       
       
        // Métropole
        creerLayer("metropole_QoS_transports_voix_arcep", "metropole_QoS_transports_voix_arcep", "CAMPAGNE_VOIX_TRANSPORTS_T3_2021", "numeric"), // prev : QoS_Arcep_transports_voix_sms_2020
        creerLayer("metropole_QoS_transports_data_arcep", "metropole_QoS_transports_data_arcep", "CAMPAGNE_DATA_TRANSPORTS", "numeric"), // prev : MRMTransports_data_2020_OK
        creerLayer("metropole_QoS_agglos_data_arcep", "metropole_QoS_agglos_data_arcep", "CAMPAGNE_DATA_L2V_T3_2021", "numeric"), // prev : QoS_Arcep_habitations_data_2020
		creerLayer("metropole_QoS_agglos_voix_arcep", "metropole_QoS_agglos_voix_arcep", "CAMPAGNE_L2V_VOIX_T3_2021", "numeric"), // prev : QoS_Arcep_habitations_voixsms_2020

        creerLayer("metropole_QoS_transports_data_sncf", "metropole_QoS_transports_data_sncf", "MRM_web_sncf_QoSi_T2_2020"),
        //creerLayer("metropole_QoS_agglos_data_aura", "metropole_QoS_agglos_data_aura", "MRM_Aura_data_final", "continuous"),
        creerLayer("metropole_QoS_agglos_data_aura_2", "metropole_QoS_agglos_data_aura_2", "MRM_Aura_2020_10_debits", "continuous"),
        //creerLayer("metropole_QoS_agglos_data_cher", "metropole_QoS_agglos_data_cher", "MRM_WEB_Cher_data_routes", "numeric"),
        //creerLayer("metropole_QoS_agglos_data_hdfDebits", "metropole_QoS_agglos_data_hdfDebits", "HDF_donnees_MRM", "continuous"),
        //creerLayer("metropole_QoS_agglos_data_pdl2019", "metropole_QoS_agglos_data_pdl2019", "MRM_PDlL_WEB_janvier2019"),
        //creerLayer("metropole_QoS_agglos_data_pdl2020", "metropole_QoS_agglos_data_pdl2020", "MRM_PDlL_debit_2020T1", "continuous"),
        creerLayer("metropole_QoS_agglos_data_pdl2020_2", "metropole_QoS_agglos_data_pdl2020_2", "PDlL_mai_septembre2020_all_DL", "continuous"),
        //creerLayer("metropole_QoS_agglos_data_lieusaint", "metropole_QoS_agglos_data_lieusaint", "MRM_Lieusaint_T2_2020", "numeric"),
        creerLayer("metropole_QoS_agglos_data_cd43", "metropole_QoS_agglos_data_cd43", "MRM_Haute_Loire_T1_2020", "continuous"),
        creerLayer("metropole_QoS_agglos_data_qosi", "metropole_QoS_agglos_data_qosi", "MRM_5Gmark_juillet_decembre_2020_debits", "continuous"),
        creerLayer("metropole_QoS_agglos_data_bfc", "metropole_QoS_agglos_data_bfc", "BFC_drivetests_DL", "continuous"), // prev : MRM_BFC_debits_T3_2020_juin2021
        creerLayer("metropole_QoS_agglos_data_bfc2", "metropole_QoS_agglos_data_bfc2", "BFC_drivetests_WEB", "numeric"),
        
        //test intégration crowd
        //creerLayer("metropole_crowd_data_crowd1", "metropole_crowd_data_crowd1", "MRM_BFC_debits_T3_2020_juin2021", "continuous"),

        // -- Mozark
        // - DL
        creerLayer("metropole_crowd_data_crowd2", "metropole_crowd_data_crowd2", "Mozark_DL_FR_T3_2021", "continuous"),
        creerLayer("guyane_crowd_data_crowd2", "guyane_crowd_data_crowd2", "Mozark_DL_GF_T3_2021", "continuous"),
        creerLayer("guadeloupe_crowd_data_crowd2", "guadeloupe_crowd_data_crowd2", "Mozark_DL_GP_T3_2021", "continuous"),
        creerLayer("martinique_crowd_data_crowd2", "martinique_crowd_data_crowd2", "Mozark_DL_MQ_T3_2021", "continuous"),
        creerLayer("la_reunion_crowd_data_crowd2", "la_reunion_crowd_data_crowd2", "Mozark_DL_RE_T3_2021", "continuous"),
        // - WEB
        creerLayer("metropole_crowd_data_crowd3", "metropole_crowd_data_crowd3", "Mozark_WEB_FR_T3_2021", "numeric"),
        creerLayer("guyane_crowd_data_crowd3", "guyane_crowd_data_crowd3", "Mozark_WEB_GF_T3_2021", "numeric"),
        creerLayer("guadeloupe_crowd_data_crowd3", "guadeloupe_crowd_data_crowd3", "Mozark_WEB_GP_T3_2021", "numeric"),
        creerLayer("martinique_crowd_data_crowd3", "martinique_crowd_data_crowd3", "Mozark_WEB_MQ_T3_2021", "numeric"),
        creerLayer("la_reunion_crowd_data_crowd3", "la_reunion_crowd_data_crowd3", "Mozark_WEB_RE_T3_2021", "numeric"),

        // -- Tadurezo
        // - DL
        creerLayer("metropole_crowd_data_crowd4", "metropole_crowd_data_crowd4", "Tadurezo_DL_14_04_2022-a6um69", "continuous"),
        // - WEB
        creerLayer("metropole_crowd_data_crowd5", "metropole_crowd_data_crowd5", "Tadurezo_WEB_15_04_2022-az4q3f", "numeric"),

        // -- Speedchecker
        creerLayer("metropole_crowd_data_crowd1", "metropole_crowd_data_crowd1", "Speed_Checker_order_test", "continuous"),
        //fin test intégration crowd

        //creerLayer("metropole_sites", "metropole_sites", "METRO_Sites_2020_T2-8tsomw"),
        creerLayer("metropole_sites", "metropole_sites", "ReprojectionCSV-c4upvs"),
        //creerLayer("metropole_sites", "metropole_sites", "METRO_Sites_2020_T1-cz8tqr"),
        //creerLayer("metropole_sites", "metropole_sites", "2019_T4_Liste_sites_operateur-10jko0"),
        //creerLayer("metropole_sites", "metropole_sites", "2019_T3_Liste_sites_operateur-ddy13n"),
        creerLayer("metropole_touristique_text", "metropole_touristique_text", "Points_touristiques-acokra", "text"),
        creerLayerCouverture("2G_Bouygues_metropole", fillStr, "2G_metropole", "METRO_BOUY_couv_2G_voix_2021_T4", multipleColorsDefault),
        creerLayerCouverture("2G_Free_metropole", fillStr, "2G_metropole", "METRO_FREE_couv_2G_voix_2021_T4", multipleColorsDefault),
        creerLayerCouverture("2G_Orange_metropole", fillStr, "2G_metropole", "METRO_OF_couv_2G_voix_2021_T4", multipleColorsDefault),
        creerLayerCouverture("2G_SFR_metropole", fillStr, "2G_metropole", "METRO_SFR0_couv_2G_voix_2021_T4", multipleColorsDefault),
        // AJOUT 2G3G TEST
        creerLayerCouverture("2G3G_Bouygues_metropole", fillStr, "2G3G_metropole", "METRO_BOUY_couv_2G3G_voix_2021_T4", multipleColorsDefault),
        creerLayerCouverture("2G3G_Free_metropole", fillStr, "2G3G_metropole", "METRO_FREE_couv_2G3G_voix_2021_T4", multipleColorsDefault),
        creerLayerCouverture("2G3G_Orange_metropole", fillStr, "2G3G_metropole", "METRO_OF_couv_2G3G_voix_2021_T4", multipleColorsDefault),
        creerLayerCouverture("2G3G_SFR_metropole", fillStr, "2G3G_metropole", "METRO_SFR0_couv_2G3G_voix_2021_T4", multipleColorsDefault),
        // FIN TEST
        creerLayerCouverture("3G_Bouygues_metropole", fillStr, "3G_metropole", "METRO_BOUY_couv_3G_data_2021_T4", monoColorDefault),
        creerLayerCouvertureItinerance("3G_Free_metropole", fillStr, "3G_metropole", "METRO_FREE_couv_3G_data_2021_T4", ['#efa7a7', '#e36565'], itineranceColDefault, itineranceDefault, 0.5),
        creerLayerCouverture("3G_Orange_metropole", fillStr, "3G_metropole", "METRO_OF_couv_3G_data_2021_T4", monoColorDefault),
        creerLayerCouverture("3G_SFR_metropole", fillStr, "3G_metropole", "METRO_SFR0_couv_3G_data_2021_T4", monoColorDefault),
        creerLayerCouverture("4G_Bouygues_metropole", fillStr, "4G_metropole", "METRO_BOUY_couv_4G_data_2021_T4", monoColorDefault), // 13 dec. 2021
        creerLayerCouverture("4G_Free_metropole", fillStr, "4G_metropole", "METRO_FREE_couv_4G_data_2021_T4", monoColorDefault), // 13 dec. 2021
        creerLayerCouverture("4G_Orange_metropole", fillStr, "4G_metropole", "METRO_OF_couv_4G_data_2021_T4", monoColorDefault), // 13 dec. 2021
        creerLayerCouverture("4G_SFR_metropole", fillStr, "4G_metropole", "METRO_SFR0_couv_4G_data_2021_T4", monoColorDefault), // 13 dec. 2021
    ],
    "sourcesHashTable": {},
    "layersHashTable" : {}
};

mbData.sourcesHashTable = mbData.sources.reduce(buildHashTable, {});
mbData.layersHashTable = mbData.layers.reduce(buildHashTable, {});

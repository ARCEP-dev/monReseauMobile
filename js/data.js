var listeVoies = '{"autoroutes":[{"key":"toutesAutoroutes","value":"Tout le réseau autoroutier"},{"key":"A1","value":"A1 Paris - Lille"},{"key":"A4","value":"A4 Paris - Strasbourg"},{"key":"A6","value":"A6 Paris - Lyon"},{"key":"A7","value":"A7 Lyon - Marseille"},{"key":"A8","value":"A8 Aix en Provence - Menton"},{"key":"A9","value":"A9 Orange - Perpignan"},{"key":"A10","value":"A10 Paris - Bordeaux"},{"key":"A11","value":"A13 Paris - Caen"},{"key":"A31","value":"A31 Luxembourg - Beaune"},{"key":"A61","value":"A61 Toulouse - Narbonne"},{"key":"A62","value":"A62 Bordeaux - Toulouse"}],"metros":[{"key":"tousMetros","value":"Tous les métros"},{"key":"M1","value":"Ligne 1"},{"key":"M2","value":"Ligne 2"},{"key":"M3","value":"Lignes 3 et 3 bis"},{"key":"M4","value":"Ligne 4"},{"key":"M5","value":"Ligne 5"},{"key":"M6","value":"Ligne 6"},{"key":"M7","value":"Lignes 7 et 7 bis"},{"key":"M8","value":"Ligne 8"},{"key":"M9","value":"Ligne 9"},{"key":"M10","value":"Ligne 10"},{"key":"M11","value":"Ligne 11"},{"key":"M12","value":"Ligne 12"},{"key":"M13","value":"Ligne 13"},{"key":"M14","value":"Ligne 14"}],"trainsQuotidien":[{"key":"tousTDQ","value":"Tous les trains du quotidien"},{"key":"TDQ-RERA","value":"RER A"},{"key":"TDQ-RERB","value":"RER B"},{"key":"TDQ-RERC","value":"RER C"},{"key":"TDQ-RERD","value":"RER D"},{"key":"TDQ-RERE","value":"RER E"},{"key":"TDQ-LigneH","value":"Ligne H - Gare du Nord Ouest"},{"key":"TDQ-LigneJ","value":"Ligne J - Gare Saint Lazare Nord"},{"key":"TDQ-LigneL","value":"Ligne L - Gare Saint Lazare Sud"},{"key":"TDQ-LigneN","value":"Ligne N - Gare Montparnasse"},{"key":"TDQ-LigneP","value":"Ligne P - Gare de l’Est"},{"key":"TDQ-LigneR","value":"Ligne R - Gare de Lyon"},{"key":"TDQ-LigneU","value":"Ligne U - Tangentielle"},{"key":"TDQ-Paris-Chartres","value":"Paris - Chartres"},{"key":"TDQ-Lille-Bethune","value":"Lille - Bethune"},{"key":"TDQ-Lille-Valenciennes","value":"Lille - Valenciennes"},{"key":"TDQ-Lille-Amiens","value":"Lille - Amiens"},{"key":"TDQ-Rennes-StMalo","value":"Rennes - St Malo"},{"key":"TDQ-Rennes-StBrieuc","value":"Rennes - St Brieuc"},{"key":"TDQ-Rennes-Redon","value":"Rennes - Redon"},{"key":"TDQ-Brest-Morlaix","value":"Brest - Morlaix"},{"key":"TDQ-Nantes-Vannes","value":"Nantes-Vannes"},{"key":"TDQ-Nantes-StNazaire","value":"Nantes-St Nazaire"},{"key":"TDQ-Bordeaux-Arcachon","value":"Bordeaux - Arcachon"},{"key":"TDQ-Toulouse-Albi","value":"Toulouse - Albi"},{"key":"TDQ-Narbonne-Cerbere","value":"Narbonne - Cerbère"},{"key":"TDQ-Aix-Marseille","value":"Aix - Marseille"},{"key":"TDQ-Marseille-Toulon","value":"Marseille - Toulon"},{"key":"TDQ-Toulon-Nice","value":"Toulon - Nice"},{"key":"TDQ-Nice-Menton","value":"Nice-Menton"},{"key":"TDQ-Ajaccio-Bastia","value":"Ajaccio - Bastia"},{"key":"TDQ-Lyon-Grenoble","value":"Lyon - Grenoble"},{"key":"TDQ-Lyon-StEtienne","value":"Lyon - St Etienne"},{"key":"TDQ-Lyon-AmbrieuenBugey","value":"Lyon - Ambérieu en Bugey"},{"key":"TDQ-Lyon-Macon","value":"Lyon - Macon"},{"key":"TDQ-Annecy-Chambery","value":"Annecy - Chambery"},{"key":"TDQ-Dijon-ChalonsurSaone","value":"Dijon - Chalon sur Saône"},{"key":"TDQ-Strasbourg-Nancy","value":"Strasbourg - Nancy"},{"key":"TDQ-Strasbourg-Mulhouse-SaintLouis","value":"Strasbourg - Mulhouse - Saint Louis"},{"key":"TDQ-Nancy-Metz-Luxembourg","value":"Nancy - Metz - Luxembourg"}],"trainsET":[{"key":"tousTET","value":"Tous les trains grandes lignes"},{"key":"TET-BORDEAUXMARSEILLE","value":"Bordeaux - Marseille"},{"key":"TET-NANTESBORDEAUX","value":"Nantes - Bordeaux"},{"key":"TET-NANTESBOURGESLYON","value":"Nantes - Bourges - Lyon"},{"key":"TET-PARISAMIENSBOULOGNE","value":"Paris - Amiens - Boulogne"},{"key":"TET-PARISROUENLEHAVRE","value":"Paris - Rouen - Le Havre"},{"key":"TET-PARISCAENCHERBOURG","value":"Paris - Caen - Cherbourg"},{"key":"TET-PARISORLEANSTOURS","value":"Paris - Orléans - Tours"},{"key":"TET-PARISLIMOGESTOULOUSE","value":"Paris - Limoges - Toulouse"},{"key":"TET-PARISCLERMONTFERRAND","value":"Paris - Clermont Ferrand"},{"key":"TET-PARISTROYESBELFORT","value":"Paris - Troyes - Belfort"}],"tgv":[{"key":"tousTGV","value":"Tout le réseau TGV"},{"key":"TGV-PARISLILLE","value":"Paris - Lille"},{"key":"TGV-PARISCALAIS","value":"Paris - Calais"},{"key":"TGV-PARISRENNES","value":"Paris - Rennes"},{"key":"TGV-PARISNANTES","value":"Paris - Nantes"},{"key":"TGV-PARISBORDEAUX","value":"Paris - Bordeaux"},{"key":"TGV-PARISMARSEILLE","value":"Paris - Marseille"},{"key":"TGV-PARISLYON","value":"Paris - Lyon"},{"key":"TGV-PARISMULHOUSE","value":"Paris - Mulhouse"},{"key":"TGV-PARISSTRASBOURG","value":"Paris - Strasbourg"},{"key":"TGV-LILLEMONTPELLIER","value":"Lille - Montpellier"}]}';

var mbData = '{"sources":[{"id":"3d-buildings","type":"vector","url":"mapbox://mapbox.mapbox-streets-v7"},{"id":"transports","type":"vector","url":"mapbox://stephanedeboysson.bqq8lchg"},{"id":"Sites","type":"vector","url":"mapbox://stephanedeboysson.2oma6qi3"},{"id":"BC_Orange","type":"vector","url":"mapbox://stephanedeboysson.1itlprfq"},{"id":"CL_Orange","type":"vector","url":"mapbox://stephanedeboysson.ayv1e9ma"},{"id":"TBC_Orange","type":"vector","url":"mapbox://stephanedeboysson.byh030uw"},{"id":"BC_Bouygues","type":"vector","url":"mapbox://stephanedeboysson.d2cg6m3r"},{"id":"CL_Bouygues","type":"vector","url":"mapbox://stephanedeboysson.bja9et4r"},{"id":"TBC_Bouygues","type":"vector","url":"mapbox://stephanedeboysson.2ojpr35i"},{"id":"BC_SFR","type":"vector","url":"mapbox://stephanedeboysson.3ugfuhda"},{"id":"CL_SFR","type":"vector","url":"mapbox://stephanedeboysson.8qr2go6r"},{"id":"TBC_SFR","type":"vector","url":"mapbox://stephanedeboysson.55trxcxo"},{"id":"BC_Free","type":"vector","url":"mapbox://stephanedeboysson.2k878f8z"},{"id":"CL_Free","type":"vector","url":"mapbox://stephanedeboysson.871i0ezg"},{"id":"TBC_Free","type":"vector","url":"mapbox://stephanedeboysson.9f327gzv"},{"id":"3G_Orange","type":"vector","url":"mapbox://stephanedeboysson.5y8y2hfk"},{"id":"4G_Orange","type":"vector","url":"mapbox://stephanedeboysson.du0x0q43"},{"id":"3G_Bouygues","type":"vector","url":"mapbox://stephanedeboysson.dslt35a9"},{"id":"4G_Bouygues","type":"vector","url":"mapbox://stephanedeboysson.dz19onm7"},{"id":"3G_SFR","type":"vector","url":"mapbox://stephanedeboysson.678g6zc3"},{"id":"4G_SFR","type":"vector","url":"mapbox://stephanedeboysson.38ppw3l4"},{"id":"3G_Free","type":"vector","url":"mapbox://stephanedeboysson.4aq76l46"},{"id":"3G_Free_bridee","type":"vector","url":"mapbox://stephanedeboysson.9wlkaxfh"},{"id":"4G_Free","type":"vector","url":"mapbox://stephanedeboysson.77oejp8f"}],"layers":[{"id":"TBC_Orange","type":"fill","source":"TBC_Orange","sourceLayer":"ORA_TBCgeojson","paint":{"fillColor":"#d82424","fillOpacity":0.7,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"BC_Orange","type":"fill","source":"BC_Orange","sourceLayer":"ORA_BCgeojson","paint":{"fillColor":"#e36565","fillOpacity":0.6,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"CL_Orange","type":"fill","source":"CL_Orange","sourceLayer":"ORA_CLgeojson","paint":{"fillColor":"#efa7a7","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"TBC_Bouygues","type":"fill","source":"TBC_Bouygues","sourceLayer":"BYT_TBCgeojson","paint":{"fillColor":"#d82424","fillOpacity":0.7,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"BC_Bouygues","type":"fill","source":"BC_Bouygues","sourceLayer":"BYT_BCgeojson","paint":{"fillColor":"#e36565","fillOpacity":0.6,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"CL_Bouygues","type":"fill","source":"CL_Bouygues","sourceLayer":"BYT_CLgeojson","paint":{"fillColor":"#efa7a7","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"TBC_SFR","type":"fill","source":"TBC_SFR","sourceLayer":"SFR_TBCgeojson","paint":{"fillColor":"#d82424","fillOpacity":0.7,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"BC_SFR","type":"fill","source":"BC_SFR","sourceLayer":"SFR_BCgeojson","paint":{"fillColor":"#e36565","fillOpacity":0.6,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"CL_SFR","type":"fill","source":"CL_SFR","sourceLayer":"SFR_CLgeojson","paint":{"fillColor":"#efa7a7","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"TBC_Free","type":"fill","source":"TBC_Free","sourceLayer":"Free_TBCgeojson","paint":{"fillColor":"#d82424","fillOpacity":0.7,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"BC_Free","type":"fill","source":"BC_Free","sourceLayer":"Free_BCgeojson","paint":{"fillColor":"#e36565","fillOpacity":0.6,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"CL_Free","type":"fill","source":"CL_Free","sourceLayer":"Free_CLgeojson","paint":{"fillColor":"#efa7a7","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"3G_Orange","type":"fill","source":"3G_Orange","sourceLayer":"ORA_3Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"4G_Orange","type":"fill","source":"4G_Orange","sourceLayer":"ORA_4Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"3G_Bouygues","type":"fill","source":"3G_Bouygues","sourceLayer":"BYT_3Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"4G_Bouygues","type":"fill","source":"4G_Bouygues","sourceLayer":"BYT_4Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"3G_SFR","type":"fill","source":"3G_SFR","sourceLayer":"SFR_3Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"4G_SFR","type":"fill","source":"4G_SFR","sourceLayer":"SFR_4Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"3G_Free","type":"fill","source":"3G_Free","sourceLayer":"Free_3Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"3G_Free_bridee","type":"fill","source":"3G_Free_bridee","sourceLayer":"Free_3G_bridegeojson","paint":{"fillColor":"#efa7a7","fillOpacity":0.4,"fillOutlineColor":"rgba(255, 255, 255, 0)"}},{"id":"4G_Free","type":"fill","source":"4G_Free","sourceLayer":"Free_4Ggeojson","paint":{"fillColor":"#e36565","fillOpacity":0.5,"fillOutlineColor":"rgba(255, 255, 255, 0)"}}]}';

var operateurs = '{"frte":{"id":20801,"name":"Orange","url":"https://www.orange.fr","logo":{"url":"./img/logoOrange.png","size":{"width":"18px","height":"18px"}},"colors":["#ff6600","#ff8432","#ffdac1"]},"sfr0":{"id":20810,"name":"SFR","url":"https://www.sfr.fr","logo":{"url":"./img/logoSFR.png","size":{"width":"18px","height":"18px"}},"colors":["#af0000","#cf3232","#ebc1c1"]},"bouy":{"id":20820,"name":"Bouygues Telecom","url":"https://www.bouyguestelecom.fr/","logo":{"url":"./url/logoBouygues.png","size":{"width":"21px","height":"18px"}},"colors":["#2e898d","#3baeb3","#cce2e3"]},"frmo":{"id":20815,"name":"Free Mobile","url":"http://mobile.free.fr/","logo":{"url":"./img/logoFree.png","size":{"width":"30px","height":"17px"}},"colors":["#00A200","#32b432","#c1e8c1"]}}';

var mapBoxToken = "pk.eyJ1Ijoic3RlcGhhbmVkZWJveXNzb24iLCJhIjoiY2lvN3A1eGQ4MDA3M3Z5a3AzNzQzMmJsZCJ9.u_6ia9oYkGwdRpjQ1R8_qg";

var dataRaw = {
  'couvertureTechno': {
    'CL': {
      'Couverture_en_territoire': {
        'Bouygues_Telecom': 16,
        'Free_Mobile': 8,
        'Orange': 5,
        'SFR': 18
      },
      'Couverture_en_population': {
        'Bouygues_Telecom': 4,
        'Free_Mobile': 1,
        'Orange': 1,
        'SFR': 4
      }
    },
    'BC': {
      'Couverture_en_territoire': {
        'Bouygues_Telecom': 24,
        'Free_Mobile': 38,
        'Orange': 38,
        'SFR': 32
      },
      'Couverture_en_population': {
        'Bouygues_Telecom': 12,
        'Free_Mobile': 14,
        'Orange': 14,
        'SFR': 19,
      }
    },
    'TBC': {
      'Couverture_en_territoire': {
        'Bouygues_Telecom': 49,
        'Free_Mobile': 52,
        'Orange': 55,
        'SFR': 45,
      },
      'Couverture_en_population': {
        'Bouygues_Telecom': 82,
        'Free_Mobile': 83,
        'Orange': 84,
        'SFR': 75,
      }
    }
  },
  'couverture3G4G': {
    '3G': {
      'Couverture_en_territoire': {
        'ReseauPropre': {
          'Bouygues_Telecom': 85,
          'Free_Mobile': 54,
          'Orange': 96,
          'SFR': 93,
        },
        'Iti': {
          'Bouygues_Telecom': 0,
          'Free_Mobile': 29,
          'Orange': 0,
          'SFR': 0,
        },
      },

      'Couverture_en_population': {
        'ReseauPropre': {
          'Bouygues_Telecom': 98,
          'Free_Mobile': 89,
          'Orange': 99,
          'SFR': 99,
        },
        'Iti': {
          'Bouygues_Telecom': 0,
          'Free_Mobile': 10,
          'Orange': 0,
          'SFR': 0,
        },
      },
    },


    '4G': {
      'Couverture_en_territoire': {
        'ReseauPropre': {
          'Bouygues_Telecom': 51,
          'Free_Mobile': 38,
          'Orange': 50,
          'SFR': 44,
        },
        'Iti': {
          'Bouygues_Telecom': 0,
          'Free_Mobile': 0,
          'Orange': 0,
          'SFR': 0,
        },
      },

      'Couverture_en_population': {
        'ReseauPropre': {
          'Bouygues_Telecom': 85,
          'Free_Mobile': 78,
          'Orange': 88,
          'SFR': 81,
        },
        'Iti': {
          'Bouygues_Telecom': 0,
          'Free_Mobile': 0,
          'Orange': 0,
          'SFR': 0,
        },
      },
    },
  },
  'appelsVocaux': {
    'titre': 'Appels maintenus pendant 2 minutes et de qualité parfaite',
    'national': {
      'Bouygues_Telecom': 92,
      'Free_Mobile': 91,
      'Orange': 96,
      'SFR': 93,
    },
    'dense': {
      'Bouygues_Telecom': 96,
      'Free_Mobile': 95,
      'Orange': 99,
      'SFR': 98,
    },
    'intermediaire': {
      'Bouygues_Telecom': 95,
      'Free_Mobile': 96,
      'Orange': 98,
      'SFR': 96,
    },
    'rural': {
      'Bouygues_Telecom': 85,
      'Free_Mobile': 84,
      'Orange': 91,
      'SFR': 85,
    },
    'tgv': {
      'Bouygues_Telecom': 70,
      'Free_Mobile': 77,
      'Orange': 87,
      'SFR': 78,
    },
    'tet': {
      'Bouygues_Telecom': 76,
      'Free_Mobile': 72,
      'Orange': 81,
      'SFR': 76,
    },
    'autoroutes': {
      'Bouygues_Telecom': 89,
      'Free_Mobile': 81,
      'Orange': 93,
      'SFR': 89,
    },
    'tdq': {
      'Bouygues_Telecom': 77,
      'Free_Mobile': 77,
      'Orange': 83,
      'SFR': 78,
    },
    'metro': {
      'Bouygues_Telecom': 63,
      'Free_Mobile': 66,
      'Orange': 70,
      'SFR': 74,
    },
  },
  'SMS': {
    'titre': 'SMS recus en moins de 10 secondes',
    'national': {
      'Bouygues_Telecom': 90,
      'Free_Mobile': 92,
      'Orange': 94,
      'SFR': 90,
    },
    'dense': {
      'Bouygues_Telecom': 96,
      'Free_Mobile': 95,
      'Orange': 97,
      'SFR': 97,
    },
    'intermediaire': {
      'Bouygues_Telecom': 93,
      'Free_Mobile': 92,
      'Orange': 96,
      'SFR': 93,
    },
    'rural': {
      'Bouygues_Telecom': 80,
      'Free_Mobile': 88,
      'Orange': 88,
      'SFR': 81,
    },
    'tgv': {
      'Bouygues_Telecom': 64,
      'Free_Mobile': 62,
      'Orange': 82,
      'SFR': 72,
    },
    'tet': {
      'Bouygues_Telecom': 69,
      'Free_Mobile': 67,
      'Orange': 76,
      'SFR': 77,
    },
    'autoroutes': {
      'Bouygues_Telecom': 79,
      'Free_Mobile': 75,
      'Orange': 89,
      'SFR': 88,
    },
    'tdq': {
      'Bouygues_Telecom': 82,
      'Free_Mobile': 74,
      'Orange': 87,
      'SFR': 83,
    },
    'metro': {
      'Bouygues_Telecom': 79,
      'Free_Mobile': 85,
      'Orange': 86,
      'SFR': 71,
    },
  },
  'video': {
    'titre': 'Vidéos visionnées pendant 2 minutes et de qualité parfaite',
    'national': {
      'Bouygues_Telecom': 67,
      'Free_Mobile': 45,
      'Orange': 81,
      'SFR': 67,
    },
    'dense': {
      'Bouygues_Telecom': 91,
      'Free_Mobile': 61,
      'Orange': 96,
      'SFR': 85,
    },
    'intermediaire': {
      'Bouygues_Telecom': 73,
      'Free_Mobile': 51,
      'Orange': 92,
      'SFR': 70,
    },
    'rural': {
      'Bouygues_Telecom': 39,
      'Free_Mobile': 24,
      'Orange': 58,
      'SFR': 45,
    },
  },
  'debitsDl': {
    'titre': 'Débit moyen téléchargement',
    'national': {
      'Bouygues_Telecom': 18272,
      'Free_Mobile': 12045,
      'Orange': 28497,
      'SFR': 12195,
    },
    'dense': {
      'Bouygues_Telecom': 32110,
      'Free_Mobile': 18761,
      'Orange': 47669,
      'SFR': 21060,
    },
    'intermediaire': {
      'Bouygues_Telecom': 17434,
      'Free_Mobile': 14248,
      'Orange': 28870,
      'SFR': 10736,
    },
    'rural': {
      'Bouygues_Telecom': 5534,
      'Free_Mobile': 3544,
      'Orange': 9489,
      'SFR': 4844,
    },
  },
  'debitsUl': {
    'titre': 'Débit moyen envoi',
    'national': {
      'Bouygues_Telecom': 5856,
      'Free_Mobile': 3722,
      'Orange': 7861,
      'SFR': 4572,
    },
    'dense': {
      'Bouygues_Telecom': 9782,
      'Free_Mobile': 6243,
      'Orange': 12987,
      'SFR': 7221,
    },
    'intermediaire': {
      'Bouygues_Telecom': 6092,
      'Free_Mobile': 3941,
      'Orange': 8596,
      'SFR': 4824,
    },
    'rural': {
      'Bouygues_Telecom': 1821,
      'Free_Mobile': 1071,
      'Orange': 2215,
      'SFR': 1763,
    },
  },
  'web': {
    'titre': 'Pages web chargées en moins de 10 secondes',
    'national': {
      'Bouygues_Telecom': 79,
      'Free_Mobile': 69,
      'Orange': 87,
      'SFR': 82,
    },
    'dense': {
      'Bouygues_Telecom': 96,
      'Free_Mobile': 81,
      'Orange': 97,
      'SFR': 95,
    },
    'intermediaire': {
      'Bouygues_Telecom': 84,
      'Free_Mobile': 76,
      'Orange': 94,
      'SFR': 85,
    },
    'rural': {
      'Bouygues_Telecom': 59,
      'Free_Mobile': 51,
      'Orange': 71,
      'SFR': 66,
    },
    'tgv': {
      'tousTGV': {
        'Bouygues_Telecom': 45,
        'Free_Mobile': 34,
        'Orange': 67,
        'SFR': 48,
      },
      'TGV-PARISCALAIS': {
        'Bouygues_Telecom': 42,
        'Free_Mobile': 44,
        'Orange': 80,
        'SFR': 42,
      },
      'TGV-PARISNANTES': {
        'Bouygues_Telecom': 60,
        'Free_Mobile': 33,
        'Orange': 69,
        'SFR': 52,
      },
      'TGV-PARISMARSEILLE': {
        'Bouygues_Telecom': 34,
        'Free_Mobile': 40,
        'Orange': 70,
        'SFR': 51,
      },
      'TGV-PARISSTRASBOURG': {
        'Bouygues_Telecom': 48,
        'Free_Mobile': 32,
        'Orange': 50,
        'SFR': 46,
      },
      'TGV-PARISRENNES': {
        'Bouygues_Telecom': 55,
        'Free_Mobile': 42,
        'Orange': 54,
        'SFR': 54,
      },
      'TGV-PARISLILLE': {
        'Bouygues_Telecom': 43,
        'Free_Mobile': 29,
        'Orange': 80,
        'SFR': 46,
      },
      'TGV-PARISLYON': {
        'Bouygues_Telecom': 34,
        'Free_Mobile': 31,
        'Orange': 93,
        'SFR': 47,
      },
      'TGV-PARISMULHOUSE': {
        'Bouygues_Telecom': 39,
        'Free_Mobile': 29,
        'Orange': 55,
        'SFR': 46,
      },
      'TGV-PARISBORDEAUX': {
        'Bouygues_Telecom': 49,
        'Free_Mobile': 32,
        'Orange': 44,
        'SFR': 43,
      },
      'TGV-LILLEMONTPELLIER': {
        'Bouygues_Telecom': 47,
        'Free_Mobile': 35,
        'Orange': 79,
        'SFR': 57,
      },
    },
    'tet': {
      'tousTET': {
        'Bouygues_Telecom': 64,
        'Free_Mobile': 41,
        'Orange': 70,
        'SFR': 61,
      },
      'TET-BORDEAUXMARSEILLE': {
        'Bouygues_Telecom': 75,
        'Free_Mobile': 42,
        'Orange': 75,
        'SFR': 67,
      },
      'TET-PARISROUENLEHAVRE': {
        'Bouygues_Telecom': 78,
        'Free_Mobile': 44,
        'Orange': 79,
        'SFR': 73,
      },
      'TET-NANTESBORDEAUX': {
        'Bouygues_Telecom': 67,
        'Free_Mobile': 59,
        'Orange': 75,
        'SFR': 63,
      },
      'TET-NANTESBOURGESLYON': {
        'Bouygues_Telecom': 65,
        'Free_Mobile': 47,
        'Orange': 67,
        'SFR': 62,
      },
      'TET-PARISTROYESBELFORT': {
        'Bouygues_Telecom': 56,
        'Free_Mobile': 43,
        'Orange': 66,
        'SFR': 55,
      },
      'TET-PARISAMIENSBOULOGNE': {
        'Bouygues_Telecom': 78,
        'Free_Mobile': 51,
        'Orange': 85,
        'SFR': 64,
      },
      'TET-PARISCLERMONTFERRAND': {
        'Bouygues_Telecom': 56,
        'Free_Mobile': 32,
        'Orange': 59,
        'SFR': 50,
      },
      'TET-PARISCAENCHERBOURG': {
        'Bouygues_Telecom': 45,
        'Free_Mobile': 36,
        'Orange': 60,
        'SFR': 52,
      },
      'TET-PARISORLEANSTOURS': {
        'Bouygues_Telecom': 85,
        'Free_Mobile': 53,
        'Orange': 92,
        'SFR': 72,
      },
      'TET-PARISLIMOGESTOULOUSE': {
        'Bouygues_Telecom': 53,
        'Free_Mobile': 27,
        'Orange': 50,
        'SFR': 45,
      },
    },
    'autoroutes': {
      'toutesAutoroutes': {
        'Bouygues_Telecom': 78,
        'Free_Mobile': 44,
        'Orange': 83,
        'SFR': 77,
      },
      'A1': {
        'Bouygues_Telecom': 80,
        'Free_Mobile': 55,
        'Orange': 93,
        'SFR': 68,
      },
      'A4': {
        'Bouygues_Telecom': 73,
        'Free_Mobile': 46,
        'Orange': 84,
        'SFR': 61,
      },
      'A6': {
        'Bouygues_Telecom': 72,
        'Free_Mobile': 47,
        'Orange': 82,
        'SFR': 76,
      },
      'A7': {
        'Bouygues_Telecom': 81,
        'Free_Mobile': 46,
        'Orange': 84,
        'SFR': 82,
      },
      'A8': {
        'Bouygues_Telecom': 77,
        'Free_Mobile': 40,
        'Orange': 78,
        'SFR': 78,
      },
      'A9': {
        'Bouygues_Telecom': 89,
        'Free_Mobile': 38,
        'Orange': 89,
        'SFR': 82,
      },
      'A10': {
        'Bouygues_Telecom': 87,
        'Free_Mobile': 51,
        'Orange': 84,
        'SFR': 76,
      },
      'A11': {
        'Bouygues_Telecom': 58,
        'Free_Mobile': 35,
        'Orange': 77,
        'SFR': 66,
      },
      'A13': {
        'Bouygues_Telecom': 79,
        'Free_Mobile': 47,
        'Orange': 83,
        'SFR': 83,
      },
      'A31': {
        'Bouygues_Telecom': 70,
        'Free_Mobile': 34,
        'Orange': 69,
        'SFR': 69,
      },
      'A61': {
        'Bouygues_Telecom': 82,
        'Free_Mobile': 34,
        'Orange': 80,
        'SFR': 85,
      },
      'A62': {
        'Bouygues_Telecom': 79,
        'Free_Mobile': 61,
        'Orange': 87,
        'SFR': 78,
      },
    },
    'tdq': {
      'tousTDQ': {
        'Bouygues_Telecom': 73,
        'Free_Mobile': 46,
        'Orange': 80,
        'SFR': 71,
      },
      'TDQ-RERA': {
        'Bouygues_Telecom': 57,
        'Free_Mobile': 24,
        'Orange': 67,
        'SFR': 56,
      },
      'TDQ-RERB': {
        'Bouygues_Telecom': 75,
        'Free_Mobile': 52,
        'Orange': 82,
        'SFR': 72,
      },
      'TDQ-RERC': {
        'Bouygues_Telecom': 83,
        'Free_Mobile': 46,
        'Orange': 88,
        'SFR': 82,
      },
      'TDQ-RERD': {
        'Bouygues_Telecom': 81,
        'Free_Mobile': 54,
        'Orange': 92,
        'SFR': 78,
      },
      'TDQ-RERE': {
        'Bouygues_Telecom': 83,
        'Free_Mobile': 50,
        'Orange': 89,
        'SFR': 80,
      },
      'TDQ-LigneH': {
        'Bouygues_Telecom': 84,
        'Free_Mobile': 62,
        'Orange': 96,
        'SFR': 82,
      },
      'TDQ-LigneJ': {
        'Bouygues_Telecom': 94,
        'Free_Mobile': 61,
        'Orange': 97,
        'SFR': 90,
      },
      'TDQ-LigneL': {
        'Bouygues_Telecom': 75,
        'Free_Mobile': 60,
        'Orange': 91,
        'SFR': 84,
      },
      'TDQ-LigneN': {
        'Bouygues_Telecom': 85,
        'Free_Mobile': 52,
        'Orange': 96,
        'SFR': 81,
      },
      'TDQ-LigneP': {
        'Bouygues_Telecom': 71,
        'Free_Mobile': 48,
        'Orange': 87,
        'SFR': 76,
      },
      'TDQ-LigneR': {
        'Bouygues_Telecom': 71,
        'Free_Mobile': 32,
        'Orange': 91,
        'SFR': 72,
      },
      'TDQ-LigneU': {
        'Bouygues_Telecom': 92,
        'Free_Mobile': 70,
        'Orange': 94,
        'SFR': 92,
      },
      'TDQ-Paris-Chartres': {
        'Bouygues_Telecom': 64,
        'Free_Mobile': 34,
        'Orange': 74,
        'SFR': 64,
      },
      'TDQ-Ajaccio-Bastia': {
        'Bouygues_Telecom': 55,
        'Free_Mobile': 31,
        'Orange': 47,
        'SFR': 59,
      },
      'TDQ-Bordeaux-Arcachon': {
        'Bouygues_Telecom': 78,
        'Free_Mobile': 47,
        'Orange': 81,
        'SFR': 75,
      },
      'TDQ-Brest-Morlaix': {
        'Bouygues_Telecom': 55,
        'Free_Mobile': 44,
        'Orange': 67,
        'SFR': 57,
      },
      'TDQ-Dijon-ChalonsurSaone': {
        'Bouygues_Telecom': 69,
        'Free_Mobile': 75,
        'Orange': 93,
        'SFR': 64,
      },
      'TDQ-Annecy-Chambery': {
        'Bouygues_Telecom': 61,
        'Free_Mobile': 63,
        'Orange': 67,
        'SFR': 64,
      },
      'TDQ-Lille-Amiens': {
        'Bouygues_Telecom': 68,
        'Free_Mobile': 34,
        'Orange': 73,
        'SFR': 69,
      },
      'TDQ-Lille-Bethune': {
        'Bouygues_Telecom': 58,
        'Free_Mobile': 47,
        'Orange': 98,
        'SFR': 81,
      },
      'TDQ-Lille-Valenciennes': {
        'Bouygues_Telecom': 73,
        'Free_Mobile': 58,
        'Orange': 98,
        'SFR': 69,
      },
      'TDQ-Lyon-AmbrieuenBugey': {
        'Bouygues_Telecom': 93,
        'Free_Mobile': 54,
        'Orange': 97,
        'SFR': 86,
      },
      'TDQ-Lyon-Grenoble': {
        'Bouygues_Telecom': 68,
        'Free_Mobile': 46,
        'Orange': 79,
        'SFR': 68,
      },
      'TDQ-Lyon-Macon': {
        'Bouygues_Telecom': 84,
        'Free_Mobile': 63,
        'Orange': 93,
        'SFR': 80,
      },
      'TDQ-Lyon-StEtienne': {
        'Bouygues_Telecom': 86,
        'Free_Mobile': 46,
        'Orange': 84,
        'SFR': 74,
      },
      'TDQ-Aix-Marseille': {
        'Bouygues_Telecom': 90,
        'Free_Mobile': 36,
        'Orange': 86,
        'SFR': 79,
      },
      'TDQ-Marseille-Toulon': {
        'Bouygues_Telecom': 87,
        'Free_Mobile': 60,
        'Orange': 85,
        'SFR': 81,
      },
      'TDQ-Nancy-Metz-Luxembourg': {
        'Bouygues_Telecom': 85,
        'Free_Mobile': 51,
        'Orange': 92,
        'SFR': 68,
      },
      'TDQ-Nantes-StNazaire': {
        'Bouygues_Telecom': 75,
        'Free_Mobile': 67,
        'Orange': 85,
        'SFR': 79,
      },
      'TDQ-Nantes-Vannes': {
        'Bouygues_Telecom': 80,
        'Free_Mobile': 54,
        'Orange': 80,
        'SFR': 69,
      },
      'TDQ-Narbonne-Cerbere': {
        'Bouygues_Telecom': 89,
        'Free_Mobile': 34,
        'Orange': 87,
        'SFR': 63,
      },
      'TDQ-Nice-Menton': {
        'Bouygues_Telecom': 53,
        'Free_Mobile': 31,
        'Orange': 68,
        'SFR': 54,
      },
      'TDQ-Rennes-Redon': {
        'Bouygues_Telecom': 55,
        'Free_Mobile': 42,
        'Orange': 57,
        'SFR': 59,
      },
      'TDQ-Rennes-StBrieuc': {
        'Bouygues_Telecom': 74,
        'Free_Mobile': 40,
        'Orange': 74,
        'SFR': 75,
      },
      'TDQ-Rennes-StMalo': {
        'Bouygues_Telecom': 64,
        'Free_Mobile': 56,
        'Orange': 72,
        'SFR': 77,
      },
      'TDQ-Strasbourg-Mulhouse-SaintLouis': {
        'Bouygues_Telecom': 73,
        'Free_Mobile': 48,
        'Orange': 92,
        'SFR': 78,
      },
      'TDQ-Strasbourg-Nancy': {
        'Bouygues_Telecom': 68,
        'Free_Mobile': 47,
        'Orange': 72,
        'SFR': 54,
      },
      'TDQ-Toulon-Nice': {
        'Bouygues_Telecom': 85,
        'Free_Mobile': 50,
        'Orange': 74,
        'SFR': 70,
      },
      'TDQ-Toulouse-Albi': {
        'Bouygues_Telecom': 74,
        'Free_Mobile': 56,
        'Orange': 77,
        'SFR': 73,
      },
    },
    'metro': {
      'tousMetros': {
        'tous': 16,
      },
      'M1': {
        'tous': 59,
      },
      'M2': {
        'tous': 23,
      },
      'M3': {
        'tous': 1,
      },
      'M4': {
        'tous': 4,
      },
      'M5': {
        'tous': 16,
      },
      'M6': {
        'tous': 43,
      },
      'M7': {
        'tous': 1,
      },
      'M8': {
        'tous': 9,
      },
      'M9': {
        'tous': 2,
      },
      'M10': {
        'tous': 3,
      },
      'M11': {
        'tous': 1,
      },
      'M12': {
        'tous': 7,
      },
      'M13': {
        'tous': 12,
      },
      'M14': {
        'tous': 1,
      },
    },
  },
};

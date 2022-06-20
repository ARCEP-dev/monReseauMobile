/* global operateurs */

var territoires = [
    {
        "key" : "metropole",
        "value" : "Métropole",
        "dep": 'RAS',
        "code": 'fr',
        "operateurs" : [operateurs.bouygues_metropole, operateurs.free_metropole, operateurs.orange_metropole, operateurs.sfr_metropole],
        "territoire" : "metropole",
        "logo" : "./img/logo-metropole-alpha.png",
        "map" : {
            "center" : [2.4, 46.39],
            "zoom" : 4.29,
            "maxZoom" : 15,
            "minZoom" : 4,
            "maxBounds" : [-12, 39, 18, 53]
        }
    },
    {
        "key" : "guyane",
        "value" : "Guyane",
        "dep" : 973,
        "code" : 'gf',
        "operateurs" : [operateurs.digicel, operateurs.orange_caraibe, operateurs.sfr_caraibe /* operateurs.free_caraibe */],
        "territoire" : "drom-com",
        "logo" : "./img/logo-guyane-alpha.png",
        "map" : {
            "center" : [-53.02730090442361, 3.94],
            "zoom" : [7.4, 6.5],
            "maxZoom" : 15,
            "minZoom" : 4,
            "maxBounds" : [-59, 1, -46, 7] //[-55.333,1.933,-51,6]
        }
    }, {
        "key" : "guadeloupe",
        "value" : "Guadeloupe",
        "dep" : 971,
        "code" : 'gp',
        "operateurs" : [operateurs.digicel, operateurs.orange_caraibe, operateurs.sfr_caraibe  /* operateurs.free_caraibe */],
        "territoire" : "drom-com",
        "logo" : "./img/logo-guadeloupe-alpha.png",
        "map" : {
            "center" : [-61.52461567460335, 16.176021024448076],
            "zoom" : [9.17, 8.8],
            "maxZoom" : 15,
            "minZoom" : 4,
            "maxBounds" : [-62.5,15.2,-60.5,17.2]
        }
    }, {
        "key" : "la_reunion",
        "value" : "La Réunion",
        "dep" : 974,
        "code" : 're',
        "operateurs" : [operateurs.free_ocean_indien, operateurs.orange_ocean_indien, operateurs.sfr_ocean_indien , operateurs.zeop],
        "territoire" : "drom-com",
        "logo" : "./img/logo-la-reunion-alpha.png",
        "map" : {
            "center" : [55.53913649067738, -21.153674695744257],
            "zoom" : 8.88,
            "maxZoom" : 15,
            "minZoom" : 4,
            "maxBounds" : [54,-21.6,57,-20.706]
        }
    }, {
        "key" : "martinique",
        "value" : "Martinique",
        "dep" : 972,
        "code" : 'mq',
        "operateurs" : [operateurs.digicel, operateurs.orange_caraibe, operateurs.sfr_caraibe /* operateurs.free_caraibe */],
        "territoire" : "drom-com",
        "logo" : "./img/logo-martinique-alpha.png",
        "map" : {
            "center" : [-60.97336870145841, 14.632175285699219],
            "zoom" : 9.32274538390329,
            "maxZoom" : 15,
            "minZoom" : 4,
            "maxBounds" : [-62.073,13.608,-60.073,15.608]
        }
    }, {
        "key" : "mayotte",
        "value" : "Mayotte",
        "dep" : 976,
        "code" : 'yt',
        "operateurs" : [operateurs.bjt, operateurs.only, operateurs.orange_ocean_indien, operateurs.sfr_ocean_indien ],
        "territoire" : "drom-com",
        "logo" : "./img/logo-mayotte-alpha.png",
         "map" : {
            "center" : [45.16242028163606, -12.831199048651683],
            "zoom" : 9.762712949631927,
            "maxZoom" : 15,
            "minZoom" : 4,
            "maxBounds" : [44.736736, -13.0737867, 45.58810437955239, -12.58837720418444]//[43.228,-14.782,47.288,-10.782]
        }
      }, {
            "key" : "stb",
            "value" : "Saint-Barthélemy",
            "dep" : 977,
            "code" : 'bl',
            "operateurs" : [operateurs.dauphin, operateurs.digicel, operateurs.orange_caraibe, /* operateurs.uts , operateurs.free_caraibe,   */],
            "territoire" : "drom-com",
            "logo" : "./img/logo-saint-barth-alpha.png",
             "map" : {
                "center" : [-62.8745425, 17.9064569],
                "zoom" : 9.762712949631927,
                "maxZoom" : 15,
                "minZoom" : 4,
                "maxBounds" : [-62.928739, 17.844207, -62.739440, 17.973674]
              }
          }, {
                "key" : "stm",
                "value" : "Saint-Martin",
                "dep" : 978,
                "code" : 'mf',
                "operateurs" : [operateurs.dauphin, operateurs.digicel, operateurs.orange_caraibe, operateurs.uts /* operateurs.free_caraibe,   */],
                "territoire" : "drom-com",
                "logo" : "./img/logo-saint-martin-alpha.png",
                 "map" : {
                    "center" : [-63.0100688, 18.0705647],
                    "zoom" : 9,
                    "maxZoom" : 15,
                    "minZoom" : 4,
                    "maxBounds" : [-63.2000688, 17.9505647, -62.9000688, 18.1705647]
                  }
         }
    // Saint-Pierre-et-Miquelon"(pm, 975) n'est pas intégré pour l'instant
];

territoires.findByProperty = function(propertyKey, propertyValue){
    var territoireTrouve = null;
     this.forEach(function(territoire){
        if (territoire[propertyKey] == propertyValue) territoireTrouve = territoire;
    });
    return territoireTrouve;
};

listeFournisseursCrowd = [
  
  //l'ordre dans lequel ils sont renseignés est celui dans lequel ils apparaitront dans le menu déroulant 
  {
    nom: "SpeedChecker - Débits",
    fournisseur: "SpeedChecker",
    fournisseur_link: "https://www.speedchecker.com/products/speed-test-datasets.html",
    metric_type: "download",
    key: "crowd1",
    scope: {
      metropole : ["data"],
    },
    info: "Mesures fournies par SpeedChecker pour le 3e trimestre 2021.",
    date_start: "juillet 2021",
    date_end: "septembre 2021"
  },
  
  {
    nom: "Mozark - Débits",
    fournisseur: "Mozark",
    fournisseur_link: "https://www.5gmark.com/la-societe",
    metric_type: "download",
    key: "crowd2",
    scope: {
      metropole : ["data"],
      guyane : ["data"],
      guadeloupe : ["data"],
      martinique : ["data"],
      la_reunion : ["data"],
    },
    info: "Données Mozark de mars à septembre 2021.",
    date_start: "mars 2021",
    date_end: "septembre 2021"
  },

  {
    nom: "Mozark - Tests Web",
    fournisseur: "Mozark",
    fournisseur_link: "https://www.5gmark.com/la-societe",
    metric_type: "web",
    key: "crowd3",
    scope: {
      metropole : ["data"],
      guyane : ["data"],
      guadeloupe : ["data"],
      martinique : ["data"],
      la_reunion : ["data"],
    },
    info: "Données Mozark de mars à septembre 2021.",
    date_start: "mars 2021",
    date_end: "septembre 2021"
  },

  {
    nom: "Tadurezo - Débits",
    fournisseur: "Bourgogne-Franche-Comté",
    fournisseur_link: "https://www.bourgognefranchecomte.fr/",
    metric_type: "download",
    key: "crowd4",
    scope: {
      metropole : ["data"],
    },
    info: "Données mesurées par la région Bourgogne-Franche-Comté en 2021.",
    date_start: "janvier 2021",
    date_end: "décembre 2021"
  },

  {
    nom: "Tadurezo - Tests Web",
    fournisseur: "Bourgogne-Franche-Comté",
    fournisseur_link: "https://www.bourgognefranchecomte.fr/",
    metric_type: "web",
    key: "crowd5",
    scope: {
      metropole : ["data"],
    },
    info: "Données mesurées par la région Bourgogne-Franche-Comté en 2021.",
    date_start: "janvier 2021",
    date_end: "décembre 2021"
  },
]

listeFournisseursCrowd.findByProperty = function(propertyKey, propertyValue){
    var fournisseurCrowdTrouve = null;
     this.forEach(function(fournisseurCrowd){
        if (fournisseurCrowd[propertyKey] == propertyValue) fournisseurCrowdTrouve = fournisseurCrowd;
    });
    return fournisseurCrowdTrouve;
};

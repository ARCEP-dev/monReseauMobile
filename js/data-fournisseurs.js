listeFournisseurs = [
  
  //l'ordre dans lequel ils sont renseignés est celui dans lequel ils apparaitront dans le menu déroulant 
  {
    nom: "SNCF-QOSI",
    fournisseur: "Mozark",
    fournisseur_link: "https://www.5gmark.com/the-company",
    metric_type: "download",
    key: "sncf",
    scope: {
      metropole_transports_tgv: ["data"],
      metropole_transports_intercites_ter: ["data"],
      //metropole_transports_rer_transiliens: ["data"]
    },
    info: "Mesures réalisées par QOSI pour SNCF entre août et septembre\u00a02020",
    date_start: "août 2020",
    date_end: "septembre 2020"
  },
  
  {
    nom: "de QoSi (Mozark Group) - Tests de débit",
    fournisseur: "Mozark",
    fournisseur_link: "https://www.5gmark.com/the-company",
    metric_type: "download",
    key: "qosi",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["voix", "data"]
    },
    info: "Mesures réalisées par QoSi - Mozark Group entre juillet\u00a02020 et décembre\u00a02020.",
    date_start: "juillet 2020",
    date_end: "décembre 2020"
  },

  {
    nom: "de la Bourgogne-Franche-Comté - Tests de débit",
    fournisseur: "Bourgogne-Franche-Compté",
    fournisseur_link: "https://www.bourgognefranchecomte.fr/",
    metric_type: "download",
    key: "bfc",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["voix", "data"]
    },
    info: "Mesures réalisées par la région Bourgogne-Franche-Comté.",
    date_start: "novembre 2020",
    date_end: "septembre 2021"
  },

  {
    nom: "de la Bourgogne-Franche-Comté - Tests Web",
    fournisseur: "Bourgogne-Franche-Compté",
    fournisseur_link: "https://www.bourgognefranchecomte.fr/",
    metric_type: "web",
    key: "bfc2",
    scope: {
      metropole_agglos_national: ["data"],
    },
    info: "Mesures réalisées par la région Bourgogne-Franche-Comté.",
    date_start: "novembre 2020",
    date_end: "septembre 2021"
  },

  /*{
    nom: "de l'Auvergne-Rhône-Alpes - fin 2019 / début 2020",
    fournisseur: "Auvergne-Rhône-Alpes",
    fournisseur_link: "https://www.auvergnerhonealpes.fr/",
    metric_type: "download",
    key: "aura",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["voix", "data"]
    },
    info: "Mesures réalisées par le conseil régional et la préfecture d’Auvergne-Rhône-Alpes entre août\u00a02019 et février\u00a02020.",
    date_start: "août 2019",
    date_end: "février 2020"
  },*/
  
  {
    nom: "de l'Auvergne-Rhône-Alpes - Tests de débit",
    fournisseur: "Auvergne-Rhône-Alpes",
    fournisseur_link: "https://www.auvergnerhonealpes.fr/",
    metric_type: "download",
    key: "aura_2",
    scope: {
      metropole_agglos_national: ["data"],
    },
    info: "Mesures réalisées par le conseil régional et la préfecture d’Auvergne-Rhône-Alpes en octobre\u00a02020.",
    date_start: "octobre 2020",
    date_end: "octobre 2020"
  },
  
  /*
  {
    nom: "du Département du Cher",
    key: "cher",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["data"]
    },
    info: "Mesures réalisées par le Département du Cher en septembre et octobre\u00a02019",
    date_start: "septembre 2019",
    date_end: "ocotbre 2019"
  },
  */

  {
    nom: "de la Haute-Loire - Tests de débit",
    fournisseur: "Haute-Loire",
    fournisseur_link: "https://www.hauteloire.fr/",
    metric_type: "download",
    key: "cd43",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["data"]
    },
    info: "Tests de débit réalisés par le département de la Haute-Loire en mai\u00a02020",
    date_start: "mai 2020",
    date_end: "mai 2020"
  },
  
  /*
  {
    nom: "des Hauts-de-France",
    key: "hdfDebits",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["data"]
    },
    info: "Tests de débit réalisés par la Région Hauts-de-France et les 5\u00a0Conseils Départementaux depuis avril\u00a02019.",
    date_start: "",
    date_end: ""
  },
  */
  
  /*{
    nom: "de Lieusaint",
    fournisseur: "Lieusaint",
    fournisseur_link: "https://www.ville-lieusaint.fr/",
    metric_type: "web",
    key: "lieusaint",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["voix", "data"]
    },
    info: "Mesures réalisées par le conseil régional et la préfecture de Grand Paris Sud en avril\u00a02020.",
    date_start: "avril 2020",
    date_end: "avril 2020"
  },*/

  /*
  {
    nom: "des Pays de la Loire - janvier\u00a02019",
    key: "pdl2019",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["data"]
    },
    info: "Tests de navigation web réalisés par le syndicat mixte Gigalis en janvier\u00a02019.",
    date_start: "janvier 2019",
    date_end: "janvier 2019"
  },
  */

  /*{
    nom: "des Pays de la Loire - T1\u00a02020",
    fournisseur: "Pays de la Loire",
    fournisseur_link: "https://www.paysdelaloire.fr/",
    metric_type: "download",
    key: "pdl2020",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["data"]
    },
    info: "Tests de débits réalisés par le syndicat mixte Gigalis au T1\u00a02020.",
    date_start: "janvier 2020",
    date_end: "mars 2020"
  },*/
  
  {
    nom: "des Pays de la Loire - Tests de débit",
    fournisseur: "Pays de la Loire",
    fournisseur_link: "https://www.paysdelaloire.fr/",
    metric_type: "download",
    key: "pdl2020_2",
    scope: {
      metropole_agglos_national: ["data"],
      //metropole_transports_routes: ["data"]
    },
    info: "Tests de débits réalisés par le syndicat mixte Gigalis de mai à septembre\u00a02020.",
    date_start: "mai 2020",
    date_end: "septembre 2020"
  },
]

listeFournisseurs.findByProperty = function(propertyKey, propertyValue){
    var fournisseurTrouve = null;
     this.forEach(function(fournisseur){
        if (fournisseur[propertyKey] == propertyValue) fournisseurTrouve = fournisseur;
    });
    return fournisseurTrouve;
};

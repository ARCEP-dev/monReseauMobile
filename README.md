# Mon Réseau Mobile

["Mon Réseau Mobile"](https://monreseaumobile.arcep.fr/) is an interactive mapping platform allowing to compare coverage maps and quality of service tests of mobile telecommunication networks on the French territory. The site is developed and maintained by the [Autorité de régulation des communications électroniques, des postes et de la distribution de la presse (Arcep)](https://www.arcep.fr/).
It is available at [monreseaumobile.arcep.fr](https://monreseaumobile.arcep.fr/).

## Libraries

We used :

- [MapBox](https://www.mapbox.com/) for the cartography,
- [highcharts](https://www.highcharts.com/) for charts,
- [jquery](https://jquery.com/).

## Navigators compatibility

The site uses HTML5, so clients navigators have to be compatible, but also with MapBox which is more restrictive.
The following is a list of browsers that are compatible with Mapbox :
[MapBox Browser support](https://www.mapbox.com/help/mapbox-browser-support/)

## Data formats

The site relies on
- the MBTiles format for coverage data
- the [GeoJSON](https://geojson.org/) format for Quality of Service measures.

## Open data

All the data used by this application are available in free access on the open data platform of the French State at this address : [https://www.data.gouv.fr/fr/datasets/mon-reseau-mobile/](https://www.data.gouv.fr/fr/datasets/mon-reseau-mobile/)


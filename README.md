# monReseauMobile

Here we have the code of the french telecommunication regulator for the mobile services observatory.

The site allows to view and compare the mobile coverage for 2G, 3G and 4G for the four french operators.

## Libraries

We used :

- MapBox for the cartography,
- highcharts for charts,
- jquery.

## Navigators compatibility

The site uses html5, so clients navigators have to be compatible, but also with MapBox which is more restrictive.
Here you have the list of browsers compatible with MapBox :
[MapBox Browser support](https://www.mapbox.com/help/mapbox-browser-support/)

## Data formats

The site uses mbtiles and GeoJSON data formats. Mbtiles for coverage data and GeoJSON for Quality of Service measures.

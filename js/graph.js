function MiseAjourIHM(features) {
  console.log("MiseAjourIHM : " + features);

  if (features == "2G" || features == "3G" || features == "4G") {
    new Highcharts.Chart(GraphiqueCouvCumul("Population", "Couverture_en_population"));
    new Highcharts.Chart(GraphiqueCouvCumul("Surface", "Couverture_en_territoire"));

    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Population", "Couverture_en_population", "3G"));
    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Surface", "Couverture_en_territoire", "3G"));

    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Population", "Couverture_en_population", "4G"));
    new Highcharts.Chart(GraphiqueCouvCumul_3G4G("Surface", "Couverture_en_territoire", "4G"));
    return 1;
  }

  if (features == "national" || features == "rural" || features == "intermediaire" || features == "dense") {

    new Highcharts.Chart(GraphiqueQoS_Voix(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_SMS(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_Web(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_DebitsDl(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_DebitsUl(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });
    new Highcharts.Chart(GraphiqueQoS_Video(features), function(chart) {
      for (var i = 0; i < 4; i++) {
        if (chart.series[i].data[0].y < 47) {
          chart.series[i].data[0].dataLabel.attr({
            y: 24
          });
        }
      }
    });

    return 1;
  }

  if (features == "tgv" || features == "tet" || features == "tdq" || features == "metro" || features == "autoroutes"){
    if (features != "metro") {
      new Highcharts.Chart(GraphiqueQoS_VoixTransports(features), function(chart) {
        for (var i = 0; i < 4; i++) {
          if (chart.series[i].data[0].y < 47) {
            chart.series[i].data[0].dataLabel.attr({
              y: 24
            });
          }
        }
      });
      new Highcharts.Chart(GraphiqueQoS_SMSTransports(features), function(chart) {
        for (var i = 0; i < 4; i++) {
          if (chart.series[i].data[0].y < 47) {
            chart.series[i].data[0].dataLabel.attr({
              y: 24
            });
          }
        }
      });
      new Highcharts.Chart(GraphiqueQoS_WebTransports(features, sousStrateTransports), function(chart) {
        for (var i = 0; i < 4; i++) {
          if (chart.series[i].data[0].y < 47) {
            chart.series[i].data[0].dataLabel.attr({
              y: 24
            });
          }
        }
      });
    } else {
      new Highcharts.Chart(GraphiqueQoS_VoixTransports(features));
      new Highcharts.Chart(GraphiqueQoS_SMSTransports(features));
      new Highcharts.Chart(GraphiqueQoS_WebTransports(features, sousStrateTransports));
    }

    return 1;
  }
};

function GraphiqueCouvCumul(texteLeg, inUnite) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueCouv' + texteLeg,
      margin: [25, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      widthAdjust: 140,
      x: -7,
      y: 97,
      text: '<span style="font-size:10px; color:white; font-weight: bold">' + texteLeg + '</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.x) + '">' + this.x + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">' + texteLeg + ' sous ' + this.series.name + ' </div>';
      },
      followPointer: true,
      useHTML: true,
      borderColor: 'gray',
      borderWidth: 1
    },
    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      categories: ['Orange', 'Bouygues', 'SFR', 'Free'],
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          inside: false,
          y: -15,
          crop: false,
          overflow: 'none',
          padding: 0,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.series.name == 'couverture limit�e') {
              if (this.total > 99)
                return '> 99 %';
              if (this.total > 0)
                return this.total + ' %';
            }
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'couverture limit�e',
        data: [{
          y: dataRaw.couvertureTechno.CL[inUnite].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffdac1'],
              [1, '#ffdac1']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.CL[inUnite].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cce2e3'],
              [1, '#cce2e3']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.CL[inUnite].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ebc1c1'],
              [1, '#ebc1c1']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.CL[inUnite].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#c1e8c1'],
              [1, '#c1e8c1']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'bonne couverture',
        data: [{
          y: dataRaw.couvertureTechno.BC[inUnite].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffa366'],
              [1, '#ffa366']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.BC[inUnite].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#81b8ba'],
              [1, '#81b8ba']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.BC[inUnite].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf6666'],
              [1, '#cf6666']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.BC[inUnite].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#66c766'],
              [1, '#66c766']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'très bonne couverture',
        data: [
          {
          y: dataRaw.couvertureTechno.TBC[inUnite].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#FF6600'],
              [1, '#FF6600']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.TBC[inUnite].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#2e898d'],
              [1, '#2e898d']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.TBC[inUnite].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#af0000'],
              [1, '#af0000']
            ],
          }
        }, {
          y: dataRaw.couvertureTechno.TBC[inUnite].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#00a200'],
              [1, '#00a200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueCouvCumul_3G4G(texteLeg, inUnite, inTechno) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueCouv' + texteLeg + inTechno,
      margin: [25, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      widthAdjust: 140,
      x: -7,
      y: 97,
      text: '<span style="font-size:10px; color:white; font-weight: bold">' + texteLeg + '</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.x) + '">' + this.x + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">' + texteLeg + ' sous ' + this.series.name + ' </div>';
      },
      followPointer: true,
      useHTML: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      categories: ['Orange', 'Bouygues', 'SFR', 'Free'],
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          inside: false,
          y: -15,
          crop: false,
          overflow: 'none',
          padding: 0,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.series.name == 'couverture ' + inTechno + ' brid�e � 1Mbit/s') {
              if (this.total > 99)
                return '> 99 %';
              if (this.total > 0)
                return this.total + ' %';
            }
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'couverture ' + inTechno + ' brid�e � 1Mbit/s',
        data: [{
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffdac1'],
              [1, '#ffdac1']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cce2e3'],
              [1, '#cce2e3']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ebc1c1'],
              [1, '#ebc1c1']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].Iti.Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#c1e8c1'],
              [1, '#c1e8c1']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'couverture ' + inTechno,
        data: [{
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ffa366'],
              [1, '#ffa366']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#81b8ba'],
              [1, '#81b8ba']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf6666'],
              [1, '#cf6666']
            ],
          }
        }, {
          y: dataRaw.couverture3G4G[inTechno][inUnite].ReseauPropre.Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#66c766'],
              [1, '#66c766']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
    ],
    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_Voix(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_Voix',
      margin: [18, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      x: -7,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Voix</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Appels maintenus 2 minutes avec une qualit� parfaite</div>';
      },
      followPointer: true,
      useHTML: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_VoixTransports(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_VoixTransports',
      margin: [18, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      y: 87,
      x: -7,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Voix</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 90px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Appels maintenus 2 minutes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.appelsVocaux[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_SMS(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_SMS',
      margin: [18, 10, 16, 20],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      x: 5,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">SMS</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 95px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">SMS reçus en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.SMS[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.SMS[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.SMS[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.SMS[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_SMSTransports(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_SMSTransports',
      margin: [18, 10, 16, 20],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      x: 5,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">SMS</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 95px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">SMS reçus en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.SMS[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.SMS[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.SMS[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.SMS[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_Web(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_Web',
      margin: [18, 20, 16, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      x: -7,
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Navigation Web</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Pages Web charg�es en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.web[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.web[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.web[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.web[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_WebTransports(inStrate, sousStrateTransports) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_WebTransports',
      margin: [18, 15, 16, 15],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Navigation Web</span>',
    },

    subtitle: {
      text: sousTitreVariableGraphMetro(),
      align: 'center',
      verticalAlign: 'middle',
      x: 0,
      y: -15,
      widthAdjust: -10,
      style: {
        fontSize: '11px',
        color: '#FFFFFF',
      },
      useHTML: true,
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Pages Web charg�es en moins de 10 secondes</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.web[inStrate][sousStrateTransports].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_DebitsDl(inStrate) {
  var options = {
    chart: {
      type: 'solidgauge',
      renderTo: 'GraphiqueQoS_DebitsDl',
      margin: [0, 10, 5, 0],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      x: -7,
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">D�bit descendant</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">D�bit moyen constat� lors de t�l�chargements de fichiers</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    pane: {
      center: ['50%', '85%'],
      size: '85%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        innerRadius: '40%',
        shape: 'arc'
      }
    },


    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
      },
    },

    yAxis: {
      min: 0,
      max: 50000,
      tickWidth: 0,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.debitsDl[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '100%',
        radius: '85%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#ff8432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -75,
        }
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.debitsDl[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '85%',
        radius: '70%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#3baeb3',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -62,
        }
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.debitsDl[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '70%',
        radius: '55%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#cf3232',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -75,
        }
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.debitsDl[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '55%',
        radius: '40%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#32b432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -62,
        }
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_DebitsUl(inStrate) {
  var options = {
    chart: {
      type: 'solidgauge',
      renderTo: 'GraphiqueQoS_DebitsUl',
      margin: [0, 0, 5, 10],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      widthAdjust: 140,
      x: 5,
      y: 87,
      text: '<span style="font-size:10px; color:white; font-weight: bold">D�bit montant</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + Highcharts.numberFormat(this.y / 1000, 0) + 'Mb/s</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">D�bit moyen constat� lors de l\'envoi de fichiers</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    pane: {
      center: ['50%', '85%'],
      size: '85%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        innerRadius: '40%',
        shape: 'arc'
      }
    },


    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
      },
    },

    yAxis: {
      min: 0,
      max: 50000,
      tickWidth: 0,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.debitsUl[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '100%',
        radius: '85%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#ff8432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -75,
        }
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.debitsUl[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '85%',
        radius: '70%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#3baeb3',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: -50,
          y: -62,
        }
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.debitsUl[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '70%',
        radius: '55%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#cf3232',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -75,
        }
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.debitsUl[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
        innerRadius: '55%',
        radius: '40%',
        dataLabels: {
          align: 'left',
          style: {
            color: '#32b432',
            //textShadow: '0px 0px 2px #BDBDBD',
            textOutline: '0px 0px #000000',
            fontSize: '10px',
          },
          allowOverlap: true,
          borderWidth: 0,
          padding: 0,
          formatter: function() {
            return Highcharts.numberFormat(this.y / 1000, 0) + ' Mb/s';
          },
          enabled: true,
          x: 50,
          y: -62,
        }
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

function GraphiqueQoS_Video(inStrate) {
  var options = {
    chart: {
      type: 'column',
      renderTo: 'GraphiqueQoS_Video',
      margin: [18, 10, 16, 20],
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    title: {
      align: 'center',
      x: 5,
      y: 87,
      widthAdjust: 140,
      text: '<span style="font-size:10px; color:white; font-weight: bold">Vid�o en ligne</span>',
    },

    tooltip: {
      enabled: true,
      hideDelay: 0,
      useHTML: true,
      formatter: function() {
        return '<div style="width: 115px; white-space:normal; line-height: 10px;"><span style="font-size:11px; font-family: Arial,sans-serif; font-weight: bold; color:' + getCouleurOperateur(this.series.name) + '">' + this.series.name + ' : ' + this.y + '%</span><br><span style="font-size:10px; font-family: Arial,sans-serif;">Vid�os de 2 minutes avec une qualit� parfaite</div>';
      },
      followPointer: true,
      borderColor: 'gray',
      borderWidth: 1
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },

    plotOptions: {
      column: {
        borderWidth: 0,
        borderColor: '#AAAAAA',
        groupPadding: 0.05,
        pointPadding: 0.1,
      },
      series: {
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          rotation: -90,
          y: 16,
          //crop:false,
          style: {
            textShadow: '0px 0px 3px black',
            fontSize: '9px',
          },
          formatter: function() {
            if (this.y > 99)
              return '> 99 %';
            if (this.y > 0)
              return this.y + ' %';
          }
        },
      }
    },

    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 25,
      minorGridLineColor: '#666666',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      title: {
        enabled: false,
      }
    },

    series: [{
        name: 'Orange',
        data: [{
          y: dataRaw.video[inStrate].Orange,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ff8432'],
              [1, '#FF6600']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Bouygues',
        data: [{
          y: dataRaw.video[inStrate].Bouygues_Telecom,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#3baeb3'],
              [1, '#2e898d']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'SFR',
        data: [{
          y: dataRaw.video[inStrate].SFR,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#cf3232'],
              [1, '#af0000']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      },
      {
        name: 'Free',
        data: [{
          y: dataRaw.video[inStrate].Free_Mobile,
          color: {
            linearGradient: {
              x1: 1,
              x2: 1,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#32b432'],
              [1, '#00A200']
            ],
          }
        }],
        legendItemClick: false,
        animation: false,
      }
    ],

    credits: {
      enabled: false,
    },
  }
  return options;
};

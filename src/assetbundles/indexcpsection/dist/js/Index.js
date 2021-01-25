/**
 * RSN Data plugin for Craft CMS
 *
 * Index Field JS
 *
 * @author    Percipio
 * @copyright Copyright (c) 2020 Percipio
 * @link      https://percipio.london
 * @package   RsnData
 * @since     1.0.0
 */


var rsnInit = function() {
    if ($('.chart-js').length) {
        chartBuilder();
    }
    if ($('.map-js').length) {
        initMap();
    }
}

var timeset = $('#time-btn').data('time');
$('[data-time-set]').text(timeset);

// reusable chart data options
function optionsEngaged($count) {
  return {
    data: [$count],
    label: 'Engaged (1 Day)',
    backgroundColor: 'rgb(220, 38, 38)',
    borderColor: 'rgb(220, 38, 38)'
  };
}
function optionsSustained($count) {
  return {
    data: [$count],
    label: 'Sustained (2 Days)',
    backgroundColor: 'rgb(249, 115, 22)',
    borderColor: 'rgb(249, 115, 22)',
  };
}
function optionsEmbedded($count) {
  return {
    data: [$count],
    label: 'Embedded (3+ Days)',
    backgroundColor: 'rgb(6, 182, 212)',
    borderColor: 'rgb(6, 182, 212)',
  };
}

var defaultLayout = {
    padding: {
      top: 0,
      bottom: 24
    },
}

var chartBuilder = function() {

  var ctx = document.getElementById('chart-engagementLevel').getContext('2d');
    var chart = new Chart(ctx, {

        type: 'horizontalBar',
        data: {
            labels: ['Engagement Level'],
            datasets: [
              optionsEngaged($(ctx.canvas).data('engaged')), 
              optionsSustained($(ctx.canvas).data('sustained')), 
              optionsEmbedded($(ctx.canvas).data('embedded')),
            ]
        },
        options: {
          layout: defaultLayout,
          responsive: true,
          maintainAspectRatio: false,
          legend:{ display: true },
          scales: {
              xAxes: [{
                  scaleLabel:{
                      display:false
                  },
                  stacked: true
              }],
              yAxes: [{
                  maxBarThickness: 64,
                  gridLines: {
                      display:false,
                      color: "#fff",
                      zeroLineColor: "#fff",
                      zeroLineWidth: 0
                  },
                  ticks: {
                    display: false
                  },
                  stacked: true
              }]
            },
          }
      });

    var ctx = document.getElementById('chart-followOnSupport').getContext('2d');
    var values = $(ctx.canvas).data('values').split('|');
    var labels = $(ctx.canvas).data('labels').split('|');
    console.log(labels);
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',
        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgb(251, 146, 60)',
                borderColor: 'rgb(251, 146, 60)',
                data: values,
                fill: false
            }]
        },

        // Configuration options go here
        options: {
          layout: defaultLayout,
          responsive: true,
          maintainAspectRatio: true,
          legend:{ display: false },
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
            }],
            xAxes: [{
              scaleLabel:{
                  display:false
              },
              ticks: {
                beginAtZero: true
            }
          }],
        }
        }
    });

};


// Initialize and add the map
function initMap() {

    // The location of RSN
    var mapContainer = $('#engagementMap'),
    schoolLat = parseFloat(mapContainer.attr('data-lat')),
    schoolLng = parseFloat(mapContainer.attr('data-lng')),
    school = mapContainer.attr('data-school');

    const rs = {
        lat: schoolLat,
        lng: schoolLng
    };

    var jsonData = {
  "data": [
    
  ]
}

        var locations = jsonData.data;
       // console.log(locations);

        var map = new google.maps.Map(document.getElementById('engagementMap'), {
            zoom: 9,
            center: rs,
            scrollwheel: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            mapTypeControl: false
        });

        var infowindow = new google.maps.InfoWindow();
        var geocoder = new google.maps.Geocoder();
        var bounds = new google.maps.LatLngBounds();
        var marker, i;


       // console.log(locations.length);
        var limit = 10;
        for (i = 0; i < locations.length; i++) {
            codeAddress(locations[i]);
        }

        function codeAddress(location) {

            geocoder.geocode({
                'address': location.postcode
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        title: location[2],
                        url: locations[3],
                        position: results[0].geometry.location
                    });

                  //  console.log( marker);
                    bounds.extend(marker.getPosition());
                    map.fitBounds(bounds);

                    google.maps.event.addListener(marker, 'click', (function (marker, location) {
                        return function () {
                            infowindow.setContent(location.school);
                            infowindow.open(map, marker);
                        };
                    })(marker, location));
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    setTimeout(function() {
                        codeAddress(location);
                    }, 200);
                }
                else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }
}

rsnInit();
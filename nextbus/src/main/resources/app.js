var Router = require("Router");
var _ = require("lodash");

var appRouter = new Router();

var nextBusClient = require('http')({
  socketTimeout: 5000,
  readTimeout: 5000
});

var XML = require('XML');

appRouter.get("/frequency/", function(req,res) {
  var result = getRoutes("ttc")
    .then(function(routeList) {
      return _.filter(routeList, function(route) {
        return route.id.substring(0,1) == "5" && route.id.length == 3;
      });
    })
    .then(function(streetcarRoutes) {
      return _.map(streetcarRoutes, function(route) {
        return getStops("ttc",route.id)
          .then(function(stops) {
            var middleStop = Math.floor(stops.length/2);
            return getPredictions("ttc", stops[middleStop].id)
              .then(function(predictions) {
                var frequency = _.max(predictions) / predictions.length ;
                return {route: route.title, minutes_per_vehicle: predictions} ;
              });
          });
      });
    }); 

  res.setBody(result)
});

function getRoutes(agency) {
  return nextBusClient
    .get("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc")
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.map(xml.route,function(route) {
        return {
          id : route['@tag'],
          title : route['@title'],
        };
      });
    });
}

function getStops(agency,route) {
  return nextBusClient.get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a="
        +agency+"&r="+route)
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.map(xml.route.stop,function(stop) {
        return {
          id : stop['@stopId'],
          title : stop['@title'],
        };
      });
    }); 
}

function getPredictions(agency,stop) {
  return nextBusClient.get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a="
        +agency+"&stopId="+stop)
    .then(function (response) {
      var xml = XML.parse(response.body);
      return _.chain(xml.predictions)
        .map(function(prediction) {
          return prediction.direction 
            && _.map(prediction.direction.prediction, function(vehicle) {
              return _.parseInt(vehicle['@seconds']);
            });
        })
        .flatten()
        .compact()
        .sortBy()
        .value();
    }); 
}

module.exports = appRouter;

var Router = require("Router");
var _ = require("lodash");

var appRouter = new Router();

var nextBusClient = require('http')();

var XML = require('XML');

appRouter.get("/agencies/", function(req,res) {
  var result = nextBusClient.get("http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList")
    .then(function(response) {
      var xml = XML.parse(response.body);
      return _.map(xml.agency,function(agency) {
        return {
          id : agency['@tag'],
          title : agency['@title'],
          shortTitle : agency['@shortTitle'],
          region : agency['@region']
        };
      });
    }); 
  res.setBody(result)
});

appRouter.get("/agencies/:id/routes/", function(req,res,id) {
  var result = nextBusClient.get("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a="+id)
    .then(function(response) {
      var xml = XML.parse(response.body);
      return _.map(xml.route,function(route) {
        return {
          id : route['@tag'],
          title : route['@title'],
        };
      });
    }); 
  res.setBody(result)
});

appRouter.get("/agencies/:agency/routes/:route/stops/", function(req,res,agency,route) {
  var result = nextBusClient.get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a="
        +agency+"&r="+route)
    .then(function(response) {
      var xml = XML.parse(response.body);
      return xml;
      return _.map(xml.route.stop,function(stop) {
        return {
          id : stop['@stopId'],
          title : stop['@title'],
        };
      });
    }); 
  res.setBody(result)
});


module.exports = appRouter;

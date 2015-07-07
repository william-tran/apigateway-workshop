# API Gateway Workshop

0. Install Java 8 and Maven
1. Use Chrome and install JSONView https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en
1. git clone git@github.com:willtran-/apigateway-workshop.git
2. cd apigateway-workshop
2. mvn spring-boot:run
3. http://localhost:8080/api/v1/agencies/

## Challenge

Sort the TTC Streetcar routes from most frequent to least frequent. Output the route title and frequency in vehicles per hour, ordered by most frequent. Output in JSON:
```
[{"route":"501-Queen","vehicles_per_hour":10.3},...]
```

List of TTC routes, you want ones in the 500’s
http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc

List of stopIds for a route, pick any
http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=501

Current predictions for vehicles approaching that stop
http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=5511

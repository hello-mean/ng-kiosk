/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/../dist'));
app.locals.site = 'http://localhost:' + app.get('port');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//ensure all responses are hal+json
app.use(function(req, res, next) {
  if (/^\/api/.test(req.path)) {
    res.set('Content-Type', 'application/json');
  }
  next();
});

app.get('/', function(req, res) {
  res.render('application');
});
app.get('/api', routes.index);
app.get('/api/topic', routes.topic);
app.get('/api/topic/:id/slide', routes.slide);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

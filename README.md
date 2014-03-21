#NG-KIOSK 
Open Source AngularJS directive for Creating Hypermedia powered Kiosks
[![Build Status](https://secure.travis-ci.org/hello-mean/ng-kiosk.png?branch=master)](https://travis-ci.org/hello-mean/ng-kiosk)

Overview
==============
ng-kiosk is an [AngularJS](http://angularjs.org/) directive for creating an awesome kiosk.  The entire kiosk is powered by a [HAL Hypermedia API](http://stateless.co/hal_specification.html) which determines topics & content.  It is designed to be customizable by the end user and does not force an HTML structure.  You can provide it with custom HTML templates and control it programmatically via an Angular application.

Installation
===============
ng-koisk is easily installed via [bower](http://bower.io/)

	$ bower install ng-kiosk

Features
===============
- Powered by a simple HAL API
- Can be controlled through an Angular service
- Customizable HTML templates

Use
===============
### HTML
Add script tags for ng-kiosk and it's dependencies to your HTML page.

	<script type="text/javascript" src="angular.min.js"></script>
	<script type="text/javascript" src="angular-sanitize.min.js"></script>
	<script type="text/javascript" src="kiosk.js"></script>

Include the directive in your page as an HTML element.

	<kiosk src="http://kiosk.example.com/api">
		<kiosk-nav topics="topics" />
	</kiosk>
	
The directive requires a `src` attribute, that is a URL to the kiosk root of your HAL API.  See below for the structure of the API.

### Angular
Make sure to include ng-kiosk as a dependency to your AngularJS app so that the directive will be parsed.

	angular.module('app', ['ng-kiosk'])

The kiosk can be controlled by your application through the `kiosk` service, for example:

	kiosk.setCurrentSlide(1); 	// Sets the current slide to index 1
	kiosk.next();				// Moves to the next slide within the current topic
	kiosk.setCurrentTopic(3);	// Sets the current topic to index 3
	
##### Playing it Safe
The kiosk service methods all have corresponding 'safe' methods for updating the kiosk while already in an Angular digest cycle.  For example if you wanted to call `next()` from within an Angular template you would use `kiosk.safe.next()`.  Calls to methods without using `safe`, will automatically occur within the context of a `$scope.$apply()`.

### HAL API Format
You'll need to supply ng-kiosk with a HAL API wich describes your kiosk.  The following shows examples of the format that is expected.

Root Kiosk Response:

    {
      "_links": {
        "self":  {"href": "http://kiosk.example.com/api"},
        "topic": {"href": "http://kiosk.example.com/api/topic"}
      }
    }

Topic Response:

    {
      "_links": {
        "self": {"href": "http://kiosk.example.com/api/topic"},
        "next": {"href": "http://kiosk.example.com/api/topic?page=2"},
        "last": {"href": "http://kiosk.example.com/api/topic?page=2"}
      },
      "count": 4,
      "page": 1,
      "per_page": 2,
      "_embedded": {
        "topic": [
          {
          "_links": {
            "self":  {"href": "http://kiosk.example.com/api/topic/1"},
              "slide": {"href": "http://kiosk.example.com/api/topic/1/slide"}
          },
              "title": "Stocks"
          },
          {
          "_links": {
              "self":  {"href": "http://kiosk.example.com/api/topic/2"},
              "slide": {"href": "http://kiosk.example.com/api/topic/2/slide"}
          },
          "title": "Weather"
          }
        ]
      }
    }


Slide Response:

    {
      "_links": {
        "self": {"href": "http://kiosk.example.com/api/topic/1/slide"}
      },
      "_embedded": {
        "slide": [
          {
            "_links": {
              "self": {"href": "http://kiosk.example.com/api/slide/1"},
              "topic": {"href": "http://kiosk.example.com/api/topic/1"}
            },
            "content": "<h1>Slide1</h1>",
    	      "id":1
          },      
          {
            "_links": {
              "self": {"href": "http://kiosk.example.com/api/slide/2"},
              "topic": {"href": "http://kiosk.example.com/api/topic/1"}
            },
            "content": "<h1>Slide2</h1>",
    	      "id":2
          }
        ]
      }
    }

License
===============
MIT

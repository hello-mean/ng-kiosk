'use strict';

describe('kiosk', function() {
  beforeEach(module('ng-kiosk'));

  var $compile, 
      $rootScope,
      $httpBackend;

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  function getElement() {
    var directiveHtml = '<kiosk src="http://jasonandbrianrcool.com/api"></kiosk>',
        element = $compile(directiveHtml)($rootScope);
    return element;
  };

  describe('directive compile', function() {
    it('should compile the kiosk element to a div', function() {
      expect(getElement()[0].tagName).toEqual('DIV');
    }); 

    it('should set error html if the src attribute is not set', function() {
      var directiveHtml = '<kiosk></kiosk>',
          element = $compile(directiveHtml)($rootScope),
          expected = '<p><strong>ng-kiosk:src attribute not set</strong></p>';
        
      expect(element.html()).toEqual(expected);
    });
  });

  describe('initial request', function() {
    it('should make an http request to the url in the src attribute', function() {
      var directiveHtml = '<kiosk src="http://hellomean.com/kiosk"></kiosk>';

      $httpBackend.expectGET('http://hellomean.com/kiosk').respond(200, JSON.stringify(fixtures.rootResponse));
      $httpBackend.expectGET(fixtures.rootResponse._links.topic.href).respond(200, JSON.stringify(fixtures.topicResponse));
      $rootScope.$apply(function() {
        $compile(directiveHtml)($rootScope);
      });

      $httpBackend.flush();
    });

    it('should store the request result on the scope', function() {
      var directiveHtml = '<kiosk src="http://hellomean.com/kiosk"></kiosk>';
      $httpBackend.expectGET('http://hellomean.com/kiosk').respond(200, JSON.stringify(fixtures.rootResponse));
      $httpBackend.expectGET(fixtures.rootResponse._links.topic.href).respond(200, JSON.stringify(fixtures.topicResponse));
      $rootScope.$apply(function() {
        $compile(directiveHtml)($rootScope);
      });

      $httpBackend.flush();
      expect($rootScope.data).toEqual(fixtures.rootResponse);
    });
  });

  
  describe('state class', function() {
    it('should set a class of is-initializing on the kiosk element', function() {
      expect(getElement().hasClass('is-initializing')).toBe(true); 
    });   

    it('should only have is-ready class when http request is done', function() {
      var directiveHtml = '<kiosk src="http://hellomean.com/kiosk"></kiosk>',
          element;

      $httpBackend.expectGET('http://hellomean.com/kiosk').respond(200, JSON.stringify(fixtures.rootResponse));
      $httpBackend.expectGET(fixtures.rootResponse._links.topic.href).respond(200, JSON.stringify(fixtures.topicResponse));
      $rootScope.$apply(function() {
        element = $compile(directiveHtml)($rootScope);
        expect(element.hasClass('is-ready')).toBe(false);
        expect(element.hasClass('is-initializing')).toBe(true);
      });

      $httpBackend.flush();
      expect(element.hasClass('is-ready')).toBe(true);
      expect(element.hasClass('is-initializing')).toBe(false);
    });
     
    it('should have is-error class when http request fails', function() {
      var directiveHtml = '<kiosk src="http://hellomean.com/kiosk"></kiosk>',
          element;

      $httpBackend.expectGET('http://hellomean.com/kiosk').respond(400);
      $rootScope.$apply(function() {
        element = $compile(directiveHtml)($rootScope);
      });

      $httpBackend.flush();
      expect(element.hasClass('is-ready')).toBe(false);
      expect(element.hasClass('is-error')).toBe(true);
    }); 
  });

  describe('get topics', function() {
    it('it should hit the topic rel to fetch topics', function() {
      var directiveHtml = '<kiosk src="http://hellomean.com/kiosk"></kiosk>';

      $httpBackend.whenGET('http://hellomean.com/kiosk').respond(200, JSON.stringify(fixtures.rootResponse));
      $httpBackend.expectGET(fixtures.rootResponse["_links"].topic.href).respond(200, JSON.stringify(fixtures.topicResponse));
      $rootScope.$apply(function() {
        $compile(directiveHtml)($rootScope);
      });

      $httpBackend.flush();
    });   
    
    it('it should hit the topic rel to fetch topics', function() {
      var directiveHtml = '<kiosk src="http://hellomean.com/kiosk"></kiosk>',
          element;

      $httpBackend.whenGET('http://hellomean.com/kiosk').respond(200, JSON.stringify(fixtures.rootResponse));
      $httpBackend.expectGET(fixtures.rootResponse["_links"].topic.href).respond(200, JSON.stringify(fixtures.topicResponse));
      $rootScope.$apply(function() {
        element = $compile(directiveHtml)($rootScope);
      });

      $httpBackend.flush();

      angular.forEach(fixtures.topicResponse._embedded.topic, function(topic) {
        var anchor = element.find('a[href="' + topic._links.self.href + '"]');
        expect(anchor.length).toEqual(1);
        expect(anchor.text()).toEqual(topic.title);
      });
    });
  });
});

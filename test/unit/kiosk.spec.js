'use strict';

describe('kiosk', function() {
  beforeEach(module('ng-kiosk'));
  beforeEach(module('templates/kiosk.html'));
  beforeEach(module('templates/kiosk-nav.html'));

  var $compile, 
      $rootScope,
      $httpBackend;

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  function getElement(config) {
    helpers.mockHttp($httpBackend)($rootScope, config);
    var element;

    $rootScope.$apply(function() {
      var directiveHtml = '<kiosk src="' + helpers.src + '"><kiosk-nav /></kiosk>';
      element = $compile(directiveHtml)($rootScope);
    });

    return element;
  };

  describe('nav', function () {
    it('should create a list of nav items', function() {
      var element = getElement();
      $httpBackend.flush();
      angular.forEach(fixtures.topicResponse._embedded.topic, function(topic) {
        var anchor = element.find('a[href="#' + topic._links.self.href + '"]');
        expect(anchor.length).toEqual(1);
        expect(anchor.text()).toEqual(topic.title);
      });
    });

    it('should set is-active class to initial topic', function() {
      var element = getElement();
      $httpBackend.flush();
      var firstAnchor = angular.element(element.find('a')[0]);
      expect(firstAnchor.parent().hasClass('is-active')).toBe(true);
    });

    it('should set is-active class to selected topic', function() {
      var element = getElement();
      $httpBackend.flush();
      var secondAnchor = angular.element(element.find('a')[0]);
      secondAnchor.click();
      expect(secondAnchor.parent().hasClass('is-active')).toBe(true);
    });
  });

  describe('state class', function() {
    it('should set state to is-initializing by default', function () {
      var element = getElement();
      expect(element.hasClass('is-initializing')).toBe(true);
    });

    it('should set state to is-ready after successful request', function () {
      var element = getElement();
      $httpBackend.flush();
      expect(element.hasClass('is-ready')).toBe(true);
    });

    it('should set state to is-error after unsuccessful request', function () {
      var element = getElement(function($http){
        $http.expectGET(helpers.src)
            .respond(403, JSON.stringify("I Am A Teapot."));
      });

      $httpBackend.flush();
      expect(element.hasClass('is-error')).toBe(true);
    });
  });

  describe('changing selected topic', function() {
    
    it('should request the clicked topics slide href', function() {
      var element = getElement();
      $httpBackend.flush();
      var topic = element.find('a')[1],
          href = fixtures.topicResponse._embedded.topic[1]._links.slide.href;
      $httpBackend.expectGET(href).respond(200, fixtures.slideResponse.topic1);  
      angular.element(topic).click();
      $httpBackend.flush();
    });

  });
});

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
    helpers.mockHttp($httpBackend)($rootScope);
  }));

  function getElement() {
    var directiveHtml = '<kiosk src="' + helpers.src + '"><kiosk-nav /></kiosk>',
        element = $compile(directiveHtml)($rootScope);
    return element;
  };

  describe('nav', function () {
    it('should create a list of nav items', function() {
      var element = getElement();
      $httpBackend.flush();
      angular.forEach(fixtures.topicResponse._embedded.topic, function(topic) {
        var anchor = element.find('a[href="' + topic._links.self.href + '"]');
        expect(anchor.length).toEqual(1);
        expect(anchor.text()).toEqual(topic.title);
      });
    });
  });
});

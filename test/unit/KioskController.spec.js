'use strict'

describe('KioskController', function() {
  beforeEach(module('ng-kiosk'));

  var $rootScope,
      $scope,
      $controller,
      $http,
      setup,
      ctrl;

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$controller_) {
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $controller = _$controller_;
    setup = function($scope, config) { 
      helpers.mockHttp($http, $controller)($scope, config);
      $http.flush();
    };
  }));

  it('should initialize state to "is-initializing"', function () {
    var $scope = $rootScope.$new();
    $scope.src = 'http://hellomean.com/kiosk'; 
    $controller('KioskController', { $scope: $scope });
    expect($scope.state).toEqual('is-initializing');
  });

  it('should throw error if src not set', function () {
    expect(function() {
      $controller('KioskController', { $scope: $rootScope.$new() });
    }).toThrow();
  });

  describe('data initialization', function() {
    var $scope;

    beforeEach(function() {
      $scope = $rootScope.$new();
      setup($scope);
    });
    
    it('should set the kiosk to the result of src', function() {
      expect($scope.kiosk).toEqual(fixtures.rootResponse);
    });

    it('should set the topics to the result of kiosk topics', inject(function(map) {
      var mapped = map.topics(fixtures.topicResponse);
      expect($scope.topics).toEqual(mapped);
    }));

    it('should set the slide to the slide of the first topic', inject(function(map) {
      var mapped = map.slides(fixtures.slideResponse.topic1);
      expect($scope.currentSlide).toEqual(mapped[0]);
    }));

    it('should set the state to is-ready when topics are loaded', function () {
      expect($scope.state).toEqual('is-ready');
    });

    it('should set the state to is-error on error response', function () {
      var $scope = $rootScope.$new();
      setup($scope, function() {
        $http.expectGET($scope.src).respond(400, 'go to fail');
      });

      expect($scope.state).toEqual('is-error');
    });
  });
    
  describe('#setState()', function () {
    var $scope;

    beforeEach(function() {
      $scope = $rootScope.$new();
      setup($scope);
    });

    it('should set the state property on $scope', function() {
      $scope.setState('is-testable');
      expect($scope.state).toEqual('is-testable');
    });

    it('should broadcast the state event', function () {
      spyOn($scope, '$broadcast');
      $scope.setState('is-testable');
      expect($scope.$broadcast).toHaveBeenCalledWith('kiosk:is-testable');
    });

    it('should emit the state event', function () {
      spyOn($scope, '$emit');
      $scope.setState('is-testable');
      expect($scope.$emit).toHaveBeenCalledWith('kiosk:is-testable');
    });
  });
});

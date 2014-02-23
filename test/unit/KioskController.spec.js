'use strict'

describe('KioskController', function() {
  beforeEach(module('ng-kiosk'));

  var $rootScope,
      $scope,
      $controller,
      $http,
      ctrl;

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$controller_) {
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $controller = _$controller_;
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
      $scope.src = 'http://hellomean.com/kiosk'; 
      $http.expectGET($scope.src)
        .respond(200, JSON.stringify(fixtures.rootResponse));
      $http.expectGET(fixtures.rootResponse._links.topic.href)
        .respond(200, JSON.stringify(fixtures.topicResponse));
      $scope.$apply(function() {
        $controller('KioskController', { $scope: $scope });
      });
      $http.flush();
    });
    
    it('should set the kiosk to the result of src', function() {
      expect($scope.kiosk).toEqual(fixtures.rootResponse);
    });

    it('should set the topics to the result of kiosk topics', function() {
      expect($scope.topics).toEqual(fixtures.topicResponse);
    });
  });
});

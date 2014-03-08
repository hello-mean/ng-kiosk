'use strict';

angular.module('ng-kiosk', [
  'ngSanitize',
  'ng-kiosk.mapping',
  'templates/kiosk.html',
  'templates/kiosk-nav.html'
])
  .directive('kiosk', [function() {
    return {
      restrict: 'E',
      controller: 'KioskController',
      templateUrl: 'templates/kiosk.html',
      replace: true,
      transclude: true,
      scope: {
        src:'@'
      }
    };
  }])
  .controller('KioskController', ['$scope', '$http', 'map', 'Coordinator', function($scope, $http, map, coordinator) {

    $scope.coordinator = coordinator;

    if (!$scope.src) {
      throw new Error('kiosk src attribute not set');
    }
    
    $http.get($scope.src)
      .then(function(response) {
        $scope.setKiosk(response.data);
        return $http.get($scope.kiosk._links.topic.href);
      })
      .then(function(response) {
        $scope.setTopics(response.data);
        return $http.get($scope._topics._embedded.topic[0]._links.slide.href);
      })
      .then(function(response) {
        $scope.setSlides(response.data);
        $scope.setState('is-ready');
      })
      .catch(function() {
        $scope.setState('is-error');
      });

    $scope.setKiosk = function(kiosk) {
      $scope.kiosk = kiosk;
    };

    $scope.setTopics = function(topics) {
      $scope._topics = topics;
      $scope.coordinator.setTopics(map.topics(topics));
    };

    $scope.setSlides = function(slides) {
      $scope._slides = slides;
      $scope.coordinator.setSlides(map.slides(slides));
    };

    $scope.setState = function(state) {
      $scope.state = state;
      $scope.$broadcast('kiosk:' + state);
      $scope.$emit('kiosk:' + state);
    };

    $scope.setState('is-initializing');
  }])
  .directive('kioskNav', ['Coordinator', function(Coordinator) {
    return {
      require: '^kiosk',
      restrict: 'E',
      replace: true,
      controller: ['$scope', function($scope) {
        $scope.coordinator = Coordinator;
      }],
      templateUrl: 'templates/kiosk-nav.html'
    };
  }]);

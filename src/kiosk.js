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
      },
      link: function($scope, elem) {
        $scope.$watch('state', function(newState, oldState) {
          elem.addClass(newState);
          elem.removeClass(oldState);
        });
      }
    };
  }])
  .controller('KioskController', ['$scope', '$http', 'map', '$q', function($scope, $http, map, $q) {
    if (!$scope.src) {
      throw new Error('kiosk src attribute not set');
    }

    var deferredTopics = $q.defer();
    
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
      $scope.topics = map.topics(topics);
      deferredTopics.resolve($scope.topics);
    };

    $scope.setSlides = function(slides) {
      $scope._slides = slides;
      $scope.slides = map.slides(slides);
      $scope.currentSlide = $scope.slides[0];
    };

    $scope.setState = function(state) {
      $scope.state = state;
      $scope.$broadcast('kiosk:' + state);
      $scope.$emit('kiosk:' + state);
    };

    this.getTopics = function() {
      return deferredTopics.promise;
    };

    $scope.setState('is-initializing');
  }])
  .directive('kioskNav', function() {
    return {
      require: '^kiosk',
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/kiosk-nav.html',
      link: function($scope, elem, attrs, kioskCtrl) {
        kioskCtrl.getTopics().then(function(topics) {
          $scope.topics = topics;
        });
      }
    };
  });

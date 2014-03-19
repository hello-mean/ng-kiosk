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
  .controller('KioskController', ['$scope', '$http', 'map', 'Kiosk', function($scope, $http, map, kiosk) {
    var that = this;

    var updateSlidesFromResponse = function(response) {
      $scope.setSlides(response.data);
      $scope.setState('is-ready');
    };

    $scope.kiosk = kiosk;

    this.findTopicByUrl = function(url) {
      return $scope._topics._embedded.topic.reduce(function(r, t) {
        if (t._links.self.href === url) { return t; }
        return r;
      });
    };

    $scope.$watch('kiosk.topics.current', function(newValue, oldValue) {
      var canUpdate = (oldValue && $scope._topics);
      if (!canUpdate) { return; }

      var topic = that.findTopicByUrl(newValue.url);
      if (topic) {
        $http.get(topic._links.slide.href)
          .then(updateSlidesFromResponse);
      }
    });

    if (!$scope.src) {
      throw new Error('kiosk src attribute not set');
    }
    
    $http.get($scope.src)
      .then(function(response) {
        $scope.setRoot(response.data);
        return $http.get($scope._root._links.topic.href);
      })
      .then(function(response) {
        $scope.setTopics(response.data);
        return $http.get($scope._topics._embedded.topic[0]._links.slide.href);
      })
      .then(updateSlidesFromResponse)
      .catch(function() {
        $scope.setState('is-error');
      });

    $scope.setRoot = function(root) {
      $scope._root = root;
      $scope.kiosk.safe.setConfiguration(map.configuration(root));
    };

    $scope.setTopics = function(topics) {
      $scope._topics = topics;
      $scope.kiosk.safe.setTopics(map.topics(topics));
    };

    $scope.setSlides = function(slides) {
      $scope._slides = slides;
      $scope.kiosk.safe.setSlides(map.slides(slides));
    };

    $scope.setState = function(state) {
      $scope.state = state;
      $scope.$broadcast('kiosk:' + state);
      $scope.$emit('kiosk:' + state);
    };

    $scope.setState('is-initializing');

  }])
  .controller('SlideController', ['$scope', 'Kiosk', function($scope, Kiosk) {
    $scope.isCurrentSlide = function() {
      return $scope.slide.id === Kiosk.slides.current.id;
    };
  }])
  .directive('kioskNav', ['Kiosk', function(Kiosk) {
    return {
      require: '^kiosk',
      restrict: 'E',
      replace: true,
      controller: ['$scope', function($scope) {
        $scope.kiosk = Kiosk;
      }],
      templateUrl: 'templates/kiosk-nav.html'
    };
  }]);

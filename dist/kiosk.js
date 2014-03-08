angular.module("templates/kiosk-nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk-nav.html",
    "<nav>\n" +
    "	<ul>\n" +
    "		<li ng-repeat=\"topic in topics\">\n" +
    "			<a href=\"{{topic.url}}\">{{topic.title}}</a>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</nav>");
}]);

angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div ng-class=\"state\">\n" +
    "	<ul>\n" +
    "		<li ng-repeat=\"slide in slides\" ng-bind-html=\"slide.content\">\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "	<div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

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

'use strict';

angular.module('ng-kiosk.mapping', [])
  .factory('map', function () {
    return {
      topics: function(hal) {
        return hal._embedded.topic.map(function(topic) {
          return {
            title: topic.title,
            url: topic._links.self.href
          };
        });
      },
      slides: function(hal) {
        return hal._embedded.slide.map(function(slide) {
          return {
            content: slide.content
          };
        });
      }
    };
  });


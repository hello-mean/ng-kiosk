angular.module("templates/kiosk-nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk-nav.html",
    "<nav>\n" +
    "	<ul>\n" +
    "		<li ng-repeat=\"topic in kiosk.topics\">\n" +
    "			<a href=\"{{topic.url}}\">{{topic.title}}</a>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</nav>\n" +
    "");
}]);

angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div ng-class=\"state\">\n" +
    "	<ul>\n" +
    "		<li ng-repeat=\"slide in coordinator.slides\" ng-bind-html=\"slide.content\">\n" +
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
  .controller('KioskController', ['$scope', '$http', 'map', 'Kiosk', function($scope, $http, map, kiosk) {

    $scope.kiosk = kiosk;

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
      .then(function(response) {
        $scope.setSlides(response.data);
        $scope.setState('is-ready');
      })
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

'use strict';
angular.module('ng-kiosk')
  .factory('Kiosk', ['$rootScope', function($rootScope) {
    var $scope = $rootScope.$new();

    /**
     * Define functions that do not trigger a digest
     */
    var safe = {
      setTopics: function(topics) {
        $scope.topics = topics;
      },
      setSlides: function(slides) {
        $scope.slides = slides;
      },
      addSlide: function(slide) {
        $scope.slides.push(slide);
      },
      setConfiguration: function(config) {
        $scope.configuration = config;
      }
    };

    var kiosk = {};
    /**
     * Create an unsafe copy of a safe function - i.ie
     * a function that triggers a digest
     */
    function createAppliedFunction(key) {
      return function(/** args **/) {
        var args = arguments;
        $scope.$apply(function() {
          safe[key].apply(kiosk, args);
        });
      };
    }

    /**
     * Create the default kiosk interface
     */
    for(var k in safe) {
      kiosk[k] = createAppliedFunction(k);
    }

    /**
     * Add the safe namespace for non applied functions
     */
    kiosk.safe = safe;


    Object.defineProperty(kiosk, 'topics', {
      get: function() {
        return $scope.topics;
      }
    });
    Object.defineProperty(kiosk, 'slides', {
      get: function() {
        return $scope.slides;
      }
    });
    return kiosk;
  }]);

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
      },
      configuration: function(hal) {
        var copy = angular.copy(hal);
        delete copy._links;
        delete copy._embedded;
        return copy;
      }
    };
  });


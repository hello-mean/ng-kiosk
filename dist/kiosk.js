angular.module("templates/kiosk-nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk-nav.html",
    "<div>\n" +
    "    <nav>\n" +
    "        <ul>\n" +
    "            <li ng-class=\"{'is-active': kiosk.topics.index === $index}\" ng-repeat=\"topic in kiosk.topics\">\n" +
    "                <a ng-click=\"kiosk.safe.setCurrentTopic($index)\" href=\"#{{topic.url}}\">{{topic.title}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "    <div>\n" +
    "        <button ng-click=\"kiosk.safe.prev()\" type=\"button\">Prev</button>\n" +
    "        <button ng-click=\"kiosk.safe.next()\" type=\"button\">Next</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div class=\"kiosk\" ng-class=\"state\">\n" +
    "    <ul class=\"kiosk-slides\">\n" +
    "        <li class=\"kiosk-slide\" ng-repeat=\"slide in kiosk.slides\" ng-bind-html=\"slide.content\" ng-controller=\"SlideController\" ng-show=\"isCurrentSlide()\">\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div ng-transclude></div>\n" +
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
        $http.get(topic._links.slide.href).then(updateSlidesFromResponse);
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
        safe.setCurrentTopic(0);
      },
      setSlides: function(slides) {
        $scope.slides = slides;
        safe.setCurrentSlide(0);
      },
      addSlide: function(slide) {
        $scope.slides.push(slide);
      },
      setConfiguration: function(config) {
        $scope.configuration = config;
      },
      setCurrentSlide: function(index) {
        if (!$scope.slides[index]) {
          throw new Error('No slide at index ' + index);
        }
        $scope.slides.index = index;
        $scope.slides.current = $scope.slides[index];
      },
      next: function() {
        var last = $scope.slides.length - 1,
            index = ($scope.slides.index === last) ? 0 : $scope.slides.index + 1;
        safe.setCurrentSlide(index);
      },
      prev: function() {
        var prev = $scope.slides.index - 1,
            index = ($scope.slides.index === 0) ? $scope.slides.length - 1 : prev;
        safe.setCurrentSlide(index);
      },
      nextTopic: function() {
        var last = $scope.topics.length - 1,
            index = ($scope.topics.index === last) ? 0 : $scope.topics.index + 1;
        safe.setCurrentTopic(index);
      },
      prevTopic: function() {
        var prev = $scope.topics.index - 1,
            index = ($scope.topics.index === 0) ? $scope.topics.length - 1 : prev;
        safe.setCurrentTopic(index);
      },
      setCurrentTopic: function(index) {
        if (!$scope.topics[index]) {
          throw new Error('No topic at index ' + index);
        }
        $scope.topics.index = index;
        $scope.topics.current = $scope.topics[index];
      }
    };

    var kiosk = {
      scope: $scope
    };

    /**
     * Create an unsafe copy of a safe function - i.e
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
            content: slide.content,
            id: slide.id
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


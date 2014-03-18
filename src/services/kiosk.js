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
      }
    };

    var kiosk = {
      scope: $scope
    };
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

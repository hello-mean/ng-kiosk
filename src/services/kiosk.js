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

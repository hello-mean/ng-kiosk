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

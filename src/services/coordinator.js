'use strict';
angular.module('ng-kiosk')
  .factory('Coordinator', [function() {
    return {
      setTopics: function(topics) {
        this.topics = topics;
      },
      setSlides: function(slides) {
        this.slides = slides;
      }
    };
  }]);
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


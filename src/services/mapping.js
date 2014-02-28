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
      }
    };
  });


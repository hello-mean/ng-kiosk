'use strict';

angular.module('ng-kiosk', [])
  .directive('kiosk', ['$http', function($http) {
    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true,
      link: function(scope, elem, attrs) {
        if (!attrs.src) {
          elem.html('<p><strong>ng-kiosk:src attribute not set</strong></p>');
          return;
        }

        scope.dataUrl = attrs.src;

        $http.get(scope.dataUrl)
          .then(function(resp) {
            scope.data = resp.data;
          });
      }
    };
  }]);



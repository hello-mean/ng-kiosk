'use strict';

angular.module('ng-kiosk', [])
  .directive('kiosk', function() {
    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true
    };
  });



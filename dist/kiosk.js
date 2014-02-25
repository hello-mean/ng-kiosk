'use strict';

angular.module('ng-kiosk', [])
  .directive('kiosk', [function() {
    return {
      restrict: 'E',
      controller: 'KioskController',
      template: '<div class="is-initializing"><div ng-transclude></div></div>',
      replace: true,
      transclude: true,
      scope: {
        src:'@'
      },
      link: function($scope, elem) {
        if (!$scope.src) {
          elem.html('<p><strong>ng-kiosk:src attribute not set</strong></p>');
          return;
        }
        $scope.$watch('state', function(newState, oldState) {
          elem.addClass(newState);
          elem.removeClass(oldState);
        });
      }
    };
  }])
  .controller('KioskController', ['$scope', '$http', function($scope, $http) {
    if (!$scope.src) {
      throw new Error('kiosk src not set');
    }
    
    $http.get($scope.src)
      .then(function(response) {
        $scope.setKiosk(response.data);
        return $http.get($scope.kiosk._links.topic.href);
      })
      .then(function(response) {
        $scope.setTopics(response.data);
        $scope.setState('is-ready');
      })
      .catch(function() {
        $scope.setState('is-error');
      });

    $scope.setKiosk = function(kiosk) {
      $scope.kiosk = kiosk;
    };

    $scope.setTopics = function(topics) {
      $scope.topics = topics;
    };

    $scope.setState = function(state) {
      $scope.state = state;
      $scope.$broadcast('kiosk:' + state);
      $scope.$emit('kiosk:' + state);
    };

    $scope.setState('is-initializing');
  }])
  .directive('kioskNav', function() {
    return {
      require: '^kiosk',
      restrict: 'E',
      replace: true,
      template: '<nav><ul><li ng-repeat="topic in topics"><a href="{{topic.href}}">{{topic.title}}</a></li></ul></nav>'
    };
  });

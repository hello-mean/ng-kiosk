var helpers = {};

helpers.src = 'http://hellomean.com/kiosk';

helpers.mockHttp = function ($http, $controller) {
    return function ($scope, config) {
        config || (config = function() {
          $http.expectGET($scope.src)
            .respond(200, JSON.stringify(fixtures.rootResponse));
          $http.expectGET(fixtures.rootResponse._links.topic.href)
            .respond(200, JSON.stringify(fixtures.topicResponse));
        });
        $scope.src = helpers.src;
        config();
        $controller && $scope.$apply(function() {
          $controller('KioskController', { $scope: $scope });
        });
  };
};

window.helpers = helpers;
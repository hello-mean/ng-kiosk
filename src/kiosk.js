'use strict';

angular.module('ng-kiosk', ['ng-kiosk.services'])
  .directive('kiosk', ['$http', 'State', function($http, State) {
    return {
      restrict: 'E',
      controller: 'KioskController',
      template: '<div class="is-initializing"></div>',
      replace: true,
      link: function($scope, elem, attrs, ctrl) {
        var state = new State(elem, $scope);
        if (!attrs.src) {
          elem.html('<p><strong>ng-kiosk:src attribute not set</strong></p>');
          return;
        }
        ctrl.getRoot(attrs.src, state)
          .then(function(topics) {
            var nav = angular.element('<nav><ul></ul></nav>');
            angular.forEach(topics, function(topic) {
              var tpl = '<li><a href="' + topic.href + '">' + topic.title + '</a></li>',
                  item = angular.element(tpl);
              nav.find('ul').append(item);
            });
            elem.append(nav);
          });
      }
    };
  }])
  .controller('KioskController', ['$scope', '$http', function($scope, $http) {
    this.getRoot = function(dataUrl, state) {
      this.dataUrl = dataUrl;
      this.state = state;
      return $http.get(dataUrl)
        .then(angular.bind(this, this.setData))
        .then(this.getTopics)
        .catch(angular.bind(this, state.set,'is-error'));
    };

    this.setData = function(resp) {
      $scope.data = resp.data;
      this.state.set('is-ready');
      return resp.data;
    };

    this.getTopics = function(hal) {
      var topicLink = hal._links.topic;
      return $http.get(topicLink.href).
        then(function(resp) {
          var topics = resp.data._embedded.topic;
          return topics.map(function(t) { return { title: t.title, href: t._links.self.href }; });
        });
    };

  }]);

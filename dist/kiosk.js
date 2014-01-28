'use strict';

angular.module('ng-kiosk', ['ng-kiosk.services'])
  .directive('kiosk', ['$http', 'State', function($http, State) {
    return {
      restrict: 'E',
      template: '<div class="is-initializing"></div>',
      replace: true,
      link: function(scope, elem, attrs) {
        var state = new State(elem, scope);
        if (!attrs.src) {
          elem.html('<p><strong>ng-kiosk:src attribute not set</strong></p>');
          return;
        }

        scope.dataUrl = attrs.src;

        $http.get(scope.dataUrl)
          .then(function(resp) {
            scope.data = resp.data;
            state.set('is-ready');
            return resp.data;
          })
          .then(function(data) {
            var topicLink = data._links.topic;
            return $http.get(topicLink.href);
          })
          .then(function(resp) {
            var topics = resp.data._embedded.topic,
                nav = document.createElement('nav'),
                ul = document.createElement('ul');
            angular.forEach(topics, function(topic) {
              var li = document.createElement('li'),
                  a = document.createElement('a'),
                  anchorText = document.createTextNode(topic.title);
              a.href = topic._links.self.href;
              a.appendChild(anchorText);
              li.appendChild(a);
              ul.appendChild(li);
            });
            nav.appendChild(ul);
            elem.append(nav);
          })
          .catch(function() {
            state.set('is-error');
          });
      }
    };
  }]);



'use strict';

angular.module('ng-kiosk.services', []);

'use strict';

angular.module('ng-kiosk.services')
  .factory('State', function() {
    var states = [
      'is-initializing',
      'is-ready',
      'is-error'
    ];
    return function(elem, scope) {
      this.set = function(state) {
        angular.forEach(states, elem.removeClass, elem);
        elem.addClass(state);
        scope.$broadcast('kiosk:' + state);
        scope.$emit('kiosk:' + state);
      };
    };
  });

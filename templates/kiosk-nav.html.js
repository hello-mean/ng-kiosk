angular.module("templates/kiosk-nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk-nav.html",
    "<div>\n" +
    "    <nav>\n" +
    "        <ul>\n" +
    "            <li ng-class=\"{'is-active': kiosk.topics.index === $index}\" ng-repeat=\"topic in kiosk.topics\">\n" +
    "                <a ng-click=\"kiosk.safe.setCurrentTopic($index)\" href=\"#{{topic.url}}\">{{topic.title}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "    <div>\n" +
    "        <button ng-click=\"kiosk.safe.prev()\" type=\"button\">Prev</button>\n" +
    "        <button ng-click=\"kiosk.safe.next()\" type=\"button\">Next</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

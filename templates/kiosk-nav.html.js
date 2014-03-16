angular.module("templates/kiosk-nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk-nav.html",
    "<div>\n" +
    "    <nav>\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"topic in kiosk.topics\">\n" +
    "                <a href=\"{{topic.url}}\">{{topic.title}}</a>\n" +
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

angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div>\n" +
    "        <div ng-bind-html=\"currentSlide.content\"></div>\n" +
    "	<div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

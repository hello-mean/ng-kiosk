angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div ng-class=\"state\">\n" +
    "    <div ng-bind-html=\"currentSlide.content\"></div>\n" +
    "	<div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

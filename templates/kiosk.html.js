angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div ng-class=\"state\">\n" +
    "	<ul>\n" +
    "		<li ng-repeat=\"slide in coordinator.slides\" ng-bind-html=\"slide.content\">\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "	<div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

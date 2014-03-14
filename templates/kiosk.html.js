angular.module("templates/kiosk.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk.html",
    "<div class=\"kiosk\" ng-class=\"state\">\n" +
    "    <ul class=\"kiosk-slides\">\n" +
    "        <li class=\"kiosk-slide\" ng-repeat=\"slide in kiosk.slides\" ng-bind-html=\"slide.content\">\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

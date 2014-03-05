angular.module("templates/kiosk-nav.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/kiosk-nav.html",
    "<nav>\n" +
    "	<ul>\n" +
    "		<li ng-repeat=\"topic in topics\">\n" +
    "			<a href=\"{{topic.url}}\">{{topic.title}}</a>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</nav>");
}]);

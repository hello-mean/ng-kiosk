describe('SlideController', function() {
  beforeEach(module('ng-kiosk'));

  var $controller,
      $rootScope,
      kiosk,
      slides;


  beforeEach(inject(function(_$controller_, _$rootScope_, Kiosk) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    kiosk = Kiosk;
    slides = window.fixtures.slides;
    kiosk.setSlides(slides);
  }));

  function createController(slide) {
    var scope = $rootScope.$new();
    scope.slide = slide;
    var ctrl = $controller('SlideController', { $scope: scope});
    return {controller:ctrl, $scope:scope};
  };

  describe('#isCurrentSlide()', function() {
    it('should return true when the slide is current', function () {
      var ctrl = createController(slides[1]);
      kiosk.setCurrentSlide(1);

      expect(ctrl.$scope.isCurrentSlide()).toBe(true);
    });

    it('should return false when the slide is not current' , function() {
      var ctrl = createController(slides[1]);
      kiosk.setCurrentSlide(0);

      expect(ctrl.$scope.isCurrentSlide()).toBe(false);
    });
  });
});

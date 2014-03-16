describe('Kiosk', function() {
  beforeEach(module('ng-kiosk'));

  var kiosk;
  
  beforeEach(inject(function(Kiosk) {
    kiosk = Kiosk;
  }));

  describe('.safe', function() {

    describe('#setConfiguration()', function () {
      it('should set configuration on scope in a safe manner', function() {
        kiosk.safe.setConfiguration({'title':'such kiosk'});
        expect(kiosk.scope.configuration.title).toEqual('such kiosk');
      });

      it('should not trigger a digest', function() {
        var theNewConfigTitle;
        kiosk.scope.$watch('configuration.title', function(newTitle, oldTitle) {
          theNewConfigTitle = newTitle;
        });
        kiosk.safe.setConfiguration({'title':'such kiosk'});
        expect(theNewConfigTitle).toBe(undefined);
      });
    });

  });

  describe('#setConfiguration()', function() {
    it('should trigger a digest', function() {
      var theNewConfigTitle;
      kiosk.scope.$watch('configuration.title', function(newTitle, oldTitle) {
        theNewConfigTitle = newTitle;
      });
      kiosk.setConfiguration({'title':'such kiosk'});
      expect(theNewConfigTitle).toEqual('such kiosk');
    });
  });

  describe('#setSlides()', function() {
    it('should initialize the index to 0', function () {
      kiosk.setSlides(fixtures.slides);
      expect(kiosk.slides.index).toBe(0);
    });
  });

  describe('#setCurrentSlide()', function() {
    beforeEach(function() {
      kiosk.setSlides(fixtures.slides);
    });

    it('should set the index to the passed in index', function() {
      kiosk.setCurrentSlide(1);
      expect(kiosk.slides.index).toBe(1);
    });

    it('should throw an error if index out of bounds', function() {
      var exec = function() {
        kiosk.setCurrentSlide(99);
      };
      expect(exec).toThrow("No slide at index 99");
    });

    it('should set the current propert of the slides', function() {
      kiosk.setCurrentSlide(1);
      expect(kiosk.scope.slides.current).toBe(fixtures.slides[1]);
    });
  });

});

describe('Kiosk', function() {
  beforeEach(module('ng-kiosk'));

  var kiosk;
  
  beforeEach(inject(function(Kiosk) {
    kiosk = Kiosk;
    kiosk.setSlides(fixtures.slides);
    kiosk.setTopics(fixtures.topics);
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

    it('should set the current property of the slides', function() {
      kiosk.setCurrentSlide(1);
      expect(kiosk.scope.slides.current).toBe(fixtures.slides[1]);
    });
  });

  describe('#next()', function() {
    
    it('should set the current slide to the next available', function() {
      kiosk.next();
      expect(kiosk.scope.slides.index).toBe(1);
    });

    it('should rewind to index 0 when called on last slide', function() {
      kiosk.setCurrentSlide(fixtures.slides.length - 1);
      kiosk.next();
      expect(kiosk.scope.slides.index).toBe(0);
    });
  });

  describe('#prev()', function() {
    
    it('should set the current slide to the previous', function() {
      kiosk.setCurrentSlide(2);
      kiosk.prev();
      expect(kiosk.scope.slides.index).toBe(1);
    });

    it('should forward to last index when called on first slide', function() {
      kiosk.setCurrentSlide(0);
      kiosk.prev();
      expect(kiosk.scope.slides.index).toBe(fixtures.slides.length - 1);
    });
  });

  describe('#setTopics()', function() {
    it('should initialize the index to 0', function () {
      kiosk.setTopics(fixtures.topics);
      expect(kiosk.topics.index).toBe(0);
    });
  });

  describe('#setCurrentTopic()', function() {
    it('should set the index to the passed in index', function() {
      kiosk.setCurrentTopic(1);
      expect(kiosk.scope.topics.index).toBe(1);
    });

    it('should throw an error if index out of bounds', function() {
      var exec = function() {
        kiosk.setCurrentTopic(99);
      };
      expect(exec).toThrow("No topic at index 99");
    });

    it('should set the current property of the topics', function() {
      kiosk.setCurrentTopic(1);
      expect(kiosk.scope.topics.current).toBe(fixtures.topics[1]);
    });
  });
});

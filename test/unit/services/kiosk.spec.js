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
});

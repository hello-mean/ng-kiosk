describe('state service', function() {
  beforeEach(module('ng-kiosk.services'));

  var $compile,
      $rootScope,
      $httpBackend,
      State;

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _State_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    State = _State_;
  }));

  describe('#set()', function() {
    it('should add a state class to the element and broadcast + emit event', function() {
      spyOn($rootScope, '$broadcast');
      spyOn($rootScope, '$emit');
      var elem = $compile('<div></div>')($rootScope),
          state = new State(elem, $rootScope);
      state.set('is-error');
      expect(elem.hasClass('is-error')).toBe(true);
      expect($rootScope.$broadcast).toHaveBeenCalledWith('kiosk:is-error'); 
      expect($rootScope.$emit).toHaveBeenCalledWith('kiosk:is-error'); 
    });
  });
});

'use strict';

describe('kiosk', function() {
  beforeEach(module('ng-kiosk'));

  var $compile, 
      $rootScope;
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should compile the kiosk element to a div', function() {
      var directiveHtml = '<kiosk></kiosk>',
          element = $compile(directiveHtml)($rootScope);
      
      expect(element[0].tagName).toEqual('DIV');
  }); 
});

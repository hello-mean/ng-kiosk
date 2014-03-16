describe('mapping', function() {
  beforeEach(module('ng-kiosk.mapping'));

  describe('#map.topics()', function() {
    it('should map a topic hal response to topic objects', inject(function (map) {
      var topics = map.topics(fixtures.topicResponse);
      for (var i = 0, embedded = fixtures.topicResponse._embedded.topic; i < embedded.length; i++) {
        expect(topics[i].title).toEqual(embedded[i].title);
        expect(topics[i].url).toEqual(embedded[i]._links.self.href);
      }
    }));
  });
  
  
  describe('#map.slides()', function() {
    it('should map a slide hal response to slide objects', inject(function (map) {
      var slides = map.slides(fixtures.slideResponse.topic1);
      for (var i = 0, embedded = fixtures.slideResponse.topic1._embedded.slide; i < embedded.length; i++) {
       expect(slides[i].content).toEqual(embedded[i].content); 
       expect(slides[i].id).toEqual(embedded[i].id);
      }
    }));
  });

  describe('#map.configuration()', function() {
    it('should map configuration data from a response', inject(function (map) {
      var config = map.configuration(fixtures.rootResponse);
      expect(config.title).toEqual(fixtures.rootResponse.title);
    }));
  });
});

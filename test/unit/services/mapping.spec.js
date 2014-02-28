describe('mapping', function() {
  beforeEach(module('ng-kiosk.mapping'));

  describe('#mapTopics()', function() {
    it('should map a topic hal response to topic objects', inject(function (map) {
      var topics = map.topics(fixtures.topicResponse);
      for (var i = 0, embedded = fixtures.topicResponse._embedded.topic; i < embedded.length; i++) {
        expect(topics[i].title).toEqual(embedded[i].title);
        expect(topics[i].url).toEqual(embedded[i]._links.self.href);
      }
    }));
  });
});

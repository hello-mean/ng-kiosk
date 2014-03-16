window.fixtures = {};

window.fixtures.rootResponse = {
  "_links": {
    "self": {"href": "http://hellomean.com/kiosk"},
    "topic": {"href": "http://hellomean.com/kiosk/topic"}
  },
  'title': 'Such Kiosk'
};

window.fixtures.topicResponse = {       
  "_links": {        
    "self": {"href": "http://hellomean.com/kiosk/topic"}, 
    "next": {"href": "http://hellomean.com/kiosk/topic?page=2"},
    "last": {"href": "http://hellomean.com/kiosk/topic?page=2"}
  },
  "count": 10,      
  "page": 1,
  "per_page": 5, 
  "_embedded": {       
    "topic": [
      {
        "_links": { 
          "self": {"href": "http://hellomean.com/kiosk/topic/1"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/1/slide"} 
        }, 
        "title": "Stocks"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/2"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/2/slide"} 
        },
        "title": "Weather"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/3"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/3/slide"} 
        },
        "title": "Sports"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/4"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/4/slide"} 
        },
        "title": "Food"
      },
      {
        "_links": {
          "self": {"href": "http://hellomean.com/kiosk/topic/5"},
          "slide": {"href": "http://hellomean.com/kiosk/topic/5/slide"} 
        },
        "title": "Finance"
      }
    ]
  }
};

window.fixtures.slideResponse = {
  topic1: {
    "_links": {
      "self": {"href": "http://hellomean.com/kiosk/topic/1/slide"}
    },
    "_embedded": {
      "slide": [
        {
          "_links": {
            "self": {"href": "http://hellomean.com/kiosk/slide/1"},
            "topic": {"href": "http://hellomean.com/kiosk/topic/1"}
          },
          "content": "<img alt='stocks' src='http://upload.wikimedia.org/wikipedia/commons/b/b8/Sao_Paulo_Stock_Exchange.jpg' />"
       },
       {
          "_links": {
            "self": {"href": "http://hellomean.com/kiosk/slide/2"},
            "topic": {"href": "http://hellomean.com/kiosk/topic/1"}
          },
          "content": "<img alt='stocks' src='http://s3.freefoto.com/images/04/03/04_03_1_web.jpg' />"
       },
       {
          "_links": {
            "self": {"href": "http://hellomean.com/kiosk/slide/3"},
            "topic": {"href": "http://hellomean.com/kiosk/topic/1"}
          },
          "content": "<img alt='stocks' src='http://upload.wikimedia.org/wikipedia/commons/2/28/Borussia_Dortmund_GmbH_%26_Co._KGaA_Economic_Share_Price_and_Stock_Market_Volume.png' />"
       }
      ]
    }
  }
};

window.fixtures.slides = [
  { content: 'I am' },
  { content: ' the very' },
  { content: ' model of' },
  { content: ' a modern' },
  { content: ' major general'}
];

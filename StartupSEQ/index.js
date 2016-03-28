var Twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new Twit(twitInfo);
var natural = require('natural'),
  tokenizer = new natural.WordTokenizer();

function matchRE (re, text) {
  var wordArray = tokenizer.tokenize(text);
  for(var i=0;i < wordArray.length;i++) {
    if (re.test(wordArray[i])) {
      return true;
    }
  }
  return false; 
}

function search (query, asker) {
  var search = "Startup event " + query + " filter:links";
  twitter.get('search/tweets', { q: search, count: 10 }, function(err, data, response) {

    var resultLink; 

    if (data.statuses[0].entities.urls.length > 0) {
      resultLink = data.statuses[0].entities.urls[0].url;
    } else {
      for (var i=0;i < data.statuses.length;i++) {
        if (data.statuses[i].entities.urls.length > 0) {
          resultLink = data.statuses[i].entities.urls[0].url;
          i = data.statuses.length;
        }
      }
    };    

    var result = "@" + asker + " Awesome! " + query + " is where it's at. How about this? " + resultLink;
    post(result);
  })
}

function post (content) {
  twitter.post('statuses/update', { status: content }, function(err, data, response) {
  })
}

var stream = twitter.stream('statuses/filter', { track: '@StartupSEQ' })

stream.on('tweet', function (tweet) {
  var asker = tweet.user.screen_name;
  var text = tweet.text;

  // RegExes
  var greetingRE = /^Hi$/;
  var goldcoastRE = /^Gold Coast$/;
  var brisbaneRE = /^Brisbane$/;
  var sydneyRE = /^Sydney$/;
  var melbourneRE = /^Melbourne$/;
  var foodRE = /^food$/;
  var drinkRE = /^drink$/;

  if (matchRE(brisbaneRE, text)) {
    search("Brisbane", asker)
  } else if (matchRE(sydneyRE, text)) {
    search("Sydney", asker)
  } else if (matchRE(melbourneRE, text)) {
    search("Melbourne", asker)
  } else if (matchRE(goldcoastRE, text)) {
    search("Gold Coast", asker);
  } else if (matchRE(drinkRE, text)) {
    search("drink", asker)
  } else if (matchRE(foodRE, text)) {
    search("food", asker)
  } else if (matchRE(greetingRE, text)) {
    post("Hey " + "@" + asker + " . So, I've heard about some cool startup events. Or you know, whatever. [Gold Coast, Brisbane, Sydney, Melbourne, free, food, drink]");
  } else {
  }

})

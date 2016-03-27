var Twit = require('twit');
var twitInfo = require('./config.js');

var twitter = new Twit(twitInfo);

twitter.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data);
});

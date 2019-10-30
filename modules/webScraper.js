var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');

var file = "../Articles/Pages/Audible fires back at book publishers, says captions are fair use.html"

request({
  uri: 'https://stackoverflow.com/questions/25438048/href-retrieval-with-cheerio',
}, function(error, response, body) {
  //console.log(body);
  var $ = cheerio.load(file);
  //console.log($);

  $('*').each(function() {
    var link = $(this);
    var text = link.text();
    var href = link.attr("href");

    console.log(text + " -> " + href);
  });
});
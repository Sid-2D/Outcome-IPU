var app = require('express')(),
	request = require('request'),
	cheerio = require('cheerio');

app.get('/', function (req, res) {
	request('http://164.100.158.135/ExamResults/ExamResultsmain.htm', function (err, response, html) {
		if (err) {
			return res.send(err);
		}
		var $ = cheerio.load(html);
        var trowsOnPage = $("tr").toArray();
        var newLinks = [];
        for (let i = 1; i < trowsOnPage.length; i++) {
			if (trowsOnPage[i].children[3].name === "td") {
				if (trowsOnPage[i].children[3].children[0].data === "02-03-17") {
					break;
				}
				var a = trowsOnPage[i].children[1].children[1];
				var obj = {};
				obj.link =  'http://164.100.158.135/ExamResults' + a.attribs['href'];
				obj.name = a.children[0].data;
				newLinks.push(obj);
			}
        }
       	linksToReturn = newLinks.filter(obj => {
       		if (/ece/gi.test(obj.name) || /cse/gi.test(obj.name)) {
       			return true;
       		}
       		return false;
       	});
        console.log(linksToReturn);
		res.json(linksToReturn);
	});
});

app.listen(process.env.PORT || 3001, err => {
	if (err) {
		console.log(error);
	} else {
		console.log('Listening on port 3001...');
	}
});
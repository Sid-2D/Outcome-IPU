var app = require('express')(),
	request = require('request'),
	cheerio = require('cheerio'),
	router = require('express').Router();

router.get('/', function (req, res) {
	request('http://164.100.158.135/ExamResults/ExamResultsmain.htm', function (err, response, html) {
		if (err) {
			return res.send(err);
		}
		var $ = cheerio.load(html);
        var trowsOnPage = $("tr").toArray();
        var newLinks = [];
		var obj = {
			'link': '',
			'name': ''
		};
        for (let i = 1; i < trowsOnPage.length; i++) {
        	try {
				if (trowsOnPage[i].children[3].name !== "td") {
					continue;
				}
				if (trowsOnPage[i].children[3].children[0].data === "02-03-17") {
					break;
				}
				var a = trowsOnPage[i].children[1].children[1];
				obj.link =  'http://164.100.158.135/ExamResults/' + a.attribs['href'];
				obj.name = a.children[0].data;
				newLinks.push(obj);
        	} catch (e) { 
        		console.log(i, e);
        	}
        }
       	var others = [], specific = [];
       	newLinks.forEach(obj => {
       		if (/ece/gi.test(obj.name) || /cse/gi.test(obj.name)) {
       			specific.push(obj);
       			return;
       		}
       		others.push(obj);
       	});
		res.render('index.ejs', {
			specific,
			others,
	      	colors : [
	      		"",
	      		"list-group-item-success",
				"list-group-item-info",
				"list-group-item-warning",
				"list-group-item-danger"
	      	]
		});
	});
});

module.exports = router;
var template = require('./template.js');
var report = require('./report.js');

function makeSummary(response) {
	var summaryContainer = document.createElement(template[22].tag);
	setHtml(22, summaryContainer);

	var results = filterResponse(response);

	// Heading
	var headingConatiner = document.createElement('div');
	headingConatiner.style.width = '100%';

	var heading = document.createElement('div');
	heading.style.color = '#999';
	heading.style.fontSize = '27px';
	heading.innerHTML = '&nbsp;Summary';

	headingConatiner.appendChild(heading);
	summaryContainer.appendChild(headingConatiner);

	// Table
	var tableContainer = document.createElement('div');
	tableContainer.className = 'table-responsive';

	var table = document.createElement(template[23].tag);
	setHtml(23, table);

	var thead = document.createElement('thead');
	var tr = document.createElement('tr');
	var th = [];
	['Sem', 'Aggregate', 'Credits'].forEach(heading => {
		let head = document.createElement('th');
		head.innerHTML = heading;
		th.push(head);
	});

	th.forEach(heading => tr.appendChild(heading));
	thead.appendChild(tr);
	table.appendChild(thead);

	var tbody = document.createElement('tbody');

	var totalScore = 0, totalCredits = 0;
	results.forEach((result, index) => {
		let tr = document.createElement('tr');
		let th = document.createElement('th');
		th.setAttribute('scope', 'row');
		th.innerHTML = index + 1;

		var td1 = document.createElement('td');
		td1.innerHTML = result.Score;
		totalScore += result.Score;

		var td2 = document.createElement('td');
		td2.innerHTML = result.Credits;
		totalCredits = result.Credits;

		tr.appendChild(th);
		tr.appendChild(td1);
		tr.appendChild(td2);

		tbody.appendChild(tr);
	});

	totalScore = (totalScore / results.length).toFixed(2);

	table.appendChild(tbody);
	tableContainer.appendChild(table);
	summaryContainer.appendChild(tableContainer);

	var total = document.createElement('span');
	total.innerHTML = `&nbsp;Total: ${totalScore}<br>`;
	summaryContainer.appendChild(total);

	var reportButtonContainer = document.createElement('div');
	reportButtonContainer.style.width = '100%';
	reportButtonContainer.style.textAlign = 'left';

	var reportButton = document.createElement('span');
	setHtml(24, reportButton);
	reportButton.innerHTML = 'Report <i class="fa fa-download"></i>';

	var downloadMessage = document.createElement('div');
	downloadMessage.style.opacity = '0';
	downloadMessage.innerHTML = '&nbsp;Download will start shortly';

	reportButton.onclick = reportClick.bind(null, response, reportButton, downloadMessage);

	reportButtonContainer.appendChild(reportButton);
	reportButtonContainer.appendChild(document.createElement('br'));
	reportButtonContainer.appendChild(downloadMessage);

	summaryContainer.appendChild(reportButtonContainer);

	return summaryContainer;
}

// --------------------- Helpers ---------------------------

function reportClick(response, button, downloadMessage) {
	button.style.backgroundColor = '#4C9250';
	downloadMessage.style.animation = 'fadeIn 2s';
	downloadMessage.style.opacity = '1';
	setTimeout(() => {
		downloadMessage.style.animation = 'fadeOut 2s';
		downloadMessage.style.opacity = '0';
	}, 1500);
	report.completeReport(response);
}

function setHtml(i, tag) {
    var keys = Object.keys(template[i]);
    keys.forEach(function(key) {
        if (key !== 'tag') {
            tag.setAttribute(key, template[i][key]);
        }
    });
}

function filterResponse(response) {
	response = JSON.parse(response);
	var filterResponse = [];
	response.forEach(result => {
		if (/REGULAR/gi.test(result.Examination)) {
			filterResponse.push({
				'Sem': result.Semester,
				'Score': result.Score,
				'Credits': result.CreditsSecured
			});
		}
	})
	filterResponse.sort((x, y) => x.Sem - y.Sem);
	return filterResponse;
}

module.exports = makeSummary;
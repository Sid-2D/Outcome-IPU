var template = require('./template.js');
var report = require('./report.js');
var overallRankTable = require('./overallRankTable.js');

function makeSummary(response) {
	var summaryContainer = document.createElement(template[22].tag);
	setHtml(22, summaryContainer);

	var results = filterResponse(response);

	// Heading
	var headingConatiner = document.createElement('div');
	headingConatiner.style.width = '100%';
	headingConatiner.style.marginTop = '10px';
	var reportButton = document.createElement('span');
	setHtml(25, reportButton);
	reportButton.innerHTML = 'Report <i class="fa fa-download"></i>';

	reportButton.onclick = reportClick.bind(null, response, reportButton);

	var heading = document.createElement('span');
	heading.style.color = '#999';
	heading.style.fontSize = '24px';
	heading.innerHTML = '&nbsp;Summary';

	headingConatiner.appendChild(heading);
	headingConatiner.appendChild(reportButton);
	summaryContainer.appendChild(headingConatiner);

	// Table
	var tableContainer = document.createElement('div');
	tableContainer.className = 'table-responsive';

	var table = document.createElement(template[23].tag);
	setHtml(23, table);

	var thead = document.createElement('thead');
	var tr = document.createElement('tr');
	var th = [];
	['Sem', 'Marks', 'Percentage', 'Credits'].forEach(heading => {
		let head = document.createElement('th');
		if (heading === 'Percentage') {
			head.style.textAlign = 'center';
		}
		head.innerHTML = heading;
		th.push(head);
	});

	th.forEach(heading => tr.appendChild(heading));
	thead.appendChild(tr);
	table.appendChild(thead);

	var tbody = document.createElement('tbody');

	var totalScore = 0, totalCredits = 0, marks = 0, marksSum = 0;
	results.forEach((result, index) => {
		let tr = document.createElement('tr');
		let th = document.createElement('th');
		th.setAttribute('scope', 'row');
		th.innerHTML = index + 1;

		let td1 = document.createElement('td');
		td1.innerHTML = `${result.MarksObtained}/${result.TotalMarks}`;
		marks += result.MarksObtained;
		marksSum += result.TotalMarks;

		let td2 = document.createElement('td');
		td2.style.textAlign = 'center';
		td2.innerHTML = result.Score;
		totalScore += result.Score;

		let td3 = document.createElement('td');
		td3.innerHTML = result.Credits;
		totalCredits += parseInt(result.Credits);

		tr.appendChild(th);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tbody.appendChild(tr);
	});
	let finalRow = document.createElement('tr');
	finalRow.appendChild(document.createElement('th'));
	finalRow.style.fontWeight = 'bold';
	
	let finalMarks = document.createElement('td');
	let finalScore = document.createElement('td');
	let finalCredits = document.createElement('td');

	finalMarks.innerHTML = `${marks}/${marksSum}`;
	finalRow.appendChild(finalMarks);
	
	finalScore.style.textAlign = 'center';
	finalScore.innerHTML = totalScore;
	finalRow.appendChild(finalScore);

	finalCredits.innerHTML = totalCredits;
	finalRow.appendChild(finalCredits);
	tbody.appendChild(finalRow);

	totalScore = (totalScore / results.length).toFixed(2);

	let tableEnd = document.createElement('hr');
	tableEnd.style.background = '#fff';

	table.appendChild(tbody);
	tableContainer.appendChild(table);
	tableContainer.appendChild(tableEnd);
	summaryContainer.appendChild(tableContainer);

	var total = document.createElement('span');
	total.style.fontWeight = 'bold';
	total.innerHTML = `&nbsp;Aggregate : ${totalScore}<br>`;
	summaryContainer.appendChild(total);

	var btnContainer = document.createElement('div');
	btnContainer.style.width = '100%';
	btnContainer.style.textAlign = 'center';

	var overallRankButton = document.createElement(template[10].tag);
	setHtml(10, overallRankButton);
	overallRankButton.innerHTML = 'Overall Ranks';
	overallRankButton.onclick = getOverallRanks.bind(null, response, overallRankButton, summaryContainer);

	btnContainer.appendChild(overallRankButton);
	summaryContainer.appendChild(btnContainer);

	return summaryContainer;
}

module.exports = makeSummary;

// --------------------- Helpers ---------------------------

function reportClick(response, button) {
	button.style.backgroundColor = '#d9534f';
	button.style.color = '#fff';
	window.ga('send', 'event', 'Report', 'download', 'Complete Report');
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
				'Credits': result.CreditsSecured,
				'MarksObtained': result.Marks.reduce((total, subject) => {
					return total + subject.Total
				}, 0),
				'TotalMarks': result.Marks.length * 100
			});
		}
	})
	filterResponse.sort((x, y) => x.Sem - y.Sem);
	return filterResponse;
}

function addRankProgressBar(progessContainer) {
    progessContainer.style.width = '100%';
    progessContainer.style.textAlign = 'center';
    progessContainer.style.fontSize = '11px';

    let progress = document.createElement(template[17].tag);
    setHtml(17, progress);

    progessContainer.appendChild(progress);
}

function getOverallRanks(response, btn, parent) {
	btn.style.animation = 'fadeOut 1s';
	btn.style.opacity = '0';
	btn.onclick = '';

    let progressContainer = document.createElement('div');
	addRankProgressBar(progressContainer);
    parent.appendChild(progressContainer);
	
    sendListRequest(response, parent, progressContainer);
}

function sendListRequest(response, parent, progressContainer) {
	let studentInfo = getStudentInfo(response);
	let roll = studentInfo['roll'];
	delete studentInfo['roll'];

	let request = new XMLHttpRequest();
    request.addEventListener('load', overallTransferComplete);
    request.addEventListener('error', () => console.log('Connection error.'));

    request.open('POST', '/overall-classrank', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(studentInfo));

    function overallTransferComplete() {
	    window.history.replaceState({ type: 'result' }, { home: false }, 'overall-classrank');
		window.ga('set', 'page', '/overall-classrank');
	    window.ga('send', 'pageview');
    	progressContainer.style.animation = 'fadeOut 1s';
    	progressContainer.style.opacity = '0';
    	// Add table here
    	overallRankTable(request.response, roll, completeTable => {
    		parent.appendChild(completeTable);
    	})
    }
}

function getStudentInfo(response) {
	response = JSON.parse(response);
	let info = { 
		Programme: response[0].Programme, 
		Batch: response[0].Batch, 
		CollegeCode: response[0].CollegeCode,
		subject: response[0].EnrollmentNumber.substr(6, 3),
		roll: response[0].EnrollmentNumber
	};
	return info;
}
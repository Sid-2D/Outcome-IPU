function semReport(response, semNo) {
	var report = new jsPDF();
	var results = JSON.parse(response);
	var sem = results.findIndex(result => /REGULAR/gi.test(result.Examination) && result.Semester === semNo);
	addSemData(results[sem], report);
	var filename = results[0].EnrollmentNumber + '-Sem' + semNo;
	beginDownload(report, filename);
}

function completeReport(response) {
	var report = new jsPDF();
	var results = JSON.parse(response);

	var summary = filterSummary(response);

	var columns = [
        {title: "Sem", dataKey: "sem"},
        {title: "Marks", dataKey: "marks"},
        {title: "Percentage", dataKey: "percentage"},
        {title: "Credits", dataKey: "credits"}
    ];

	report.setFontSize(12);
    report.text(results[0].Name, 10, 15);
    report.text(results[0].EnrollmentNumber, 10, 20);
    report.text(results[0].Institution.length > 65 ? results[0].Institution.slice(0, 65) + '...' : results[0].Institution, 10, 25);
    report.text(results[0].Programme.length > 65 ? results[0].Programme.slice(0, 65) + '...' : results[0].Programme, 10, 30);
    report.text('Batch: ' + results[0].Batch, 10, 35);

    report.text('Summary: ', 10, 42);

    report.autoTable(columns, summaryTableData(), {
	    startY: 43,
	    margin: {horizontal: 7},
	    bodyStyles: {valign: 'top'},
	    styles: {overflow: 'linebreak', columnWidth: 'auto'},
	    columnStyles: {text: {columnWidth: 'auto'}}
	});

	let offsetY = 52 + 8 * (summary.length + 1);
	let regularResults = results.filter(result => /REGULAR/.test(result.Examination));
	report.text('Aggregate: ' + (regularResults.reduce((x, y) => { return {Score: x.Score + y.Score} }, {Score: 0}).Score / regularResults.length).toFixed(2), 10, offsetY + 5);
	report.text('Credits: ' + regularResults.reduce((x, y) => { return {CreditsSecured: x.CreditsSecured + parseInt(y.CreditsSecured)} }, {CreditsSecured: 0}).CreditsSecured, 10, offsetY + 10);


	// TODO: Add all res
	var sems = filterSems(results);
	sems.forEach(sem => {
		report.addPage();
		addSemData(sem, report);
	});

	var filename = results[0].EnrollmentNumber + '-Complete';
	beginDownload(report, filename);

	// --------------------Helpers----------------------
    function summaryTableData() {
    	let data = []
    	let totalMarks = 0, totalPercentage = 0, totalCredits = 0, totalMarksObtained = 0 
		for (let i = 0; i < summary.length; i++) {
			totalMarksObtained += summary[i].MarksObtained
			totalCredits += parseInt(summary[i].Credits)
			totalPercentage += summary[i].Score
			totalMarks += summary[i].TotalMarks
		    data.push({
		        sem: summary[i].Sem,
		        marks: `${summary[i].MarksObtained}/${summary[i].TotalMarks}`,
		        percentage: summary[i].Score,
		        credits: summary[i].Credits
		    });
		}
		data.push({
			sem: '',
			marks: `${totalMarksObtained}/${totalMarks}`,
			percentage: (totalPercentage/summary.length).toFixed(2),
			credits: totalCredits
		})
		return data;
    }

    function filterSems(results) {
    	return results.filter(result => /REGULAR/gi.test(result.Examination))
		    	      .sort((x, y) => parseInt(x.Semester) - parseInt(y.Semester));
    }
}

module.exports = {completeReport, semReport};

// --------------------Helpers----------------------

function beginDownload(report, filename) {
	var blob = report.output('blob');
    var file = new File([blob], 'file.pdf', {type: 'application/pdf'});
    saveAs(file, filename);
}

function filterSummary(response) {
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

function addSemData(sem, report) {
	report.setFontSize(12);
    report.text(sem.Name, 10, 15);
    report.text(sem.EnrollmentNumber, 10, 20);
    report.text('Semester: ' + sem.Semester, 10, 27);

    var columns = [
        {title: "ID", dataKey: "id"},
        {title: "Subject", dataKey: "name"},
        {title: "Internal", dataKey: "internal"},
        {title: "External", dataKey: "external"},
        {title: "Total", dataKey: "total"},
        {title: "Credits", dataKey: "credits"}
    ];

    report.autoTable(columns, filterSemData(sem), {
	    startY: 28,
	    margin: {horizontal: 7},
	    bodyStyles: {valign: 'top'},
	    styles: {overflow: 'linebreak', columnWidth: 'auto'},
	    columnStyles: {text: {columnWidth: 'auto'}}
	});

	let offsetY = 30 + 8 * sem.Marks.length;
	report.text('Total: ' + sem.Score, 10, offsetY + 5);
	report.text('Credits: ' + sem.CreditsSecured, 10, offsetY + 10);
	report.text('Credit Percentage: ' + sem.Credit, 10, offsetY + 15);
}

function filterSemData(sem) {
	let data = [];
	for (let i = 0; i < sem.Marks.length; i++) {
		if (sem.Marks[i].Name.length > 40) {
			sem.Marks[i].Name = sem.Marks[i].Name.slice(0, 40) + '...';
		}
	    data.push({
	        id: sem.Marks[i].Id,
	        name: sem.Marks[i].Name,
	        internal: sem.Marks[i].Internal,
	        external: sem.Marks[i].External,
	        total: sem.Marks[i].Total,
	        credits: sem.Marks[i].Credits
	    });
	}
	return data;
}
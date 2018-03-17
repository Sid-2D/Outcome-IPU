window.onpopstate = e => {
	if (e.state !== null) {
	    console.log(JSON.stringify(e.state));
	    console.log(`overlay-${e.state.state}`);
	    document.getElementById(`overlay-${e.state.state}`).style.width = "0%";
	} else {

	} 
}

function overlayIn(option) {
    document.getElementById(`overlay-${option}`).style.width = "100%";
    var stateObj = { state: option, option, option };
    window.history.replaceState({ state: option }, { home: true }, null);
    window.history.pushState(stateObj, { home: false }, window.location.pathname + '/' + option);
}

function overlayOut(option) {
    window.history.back();
}

function fixResultHistory(roll) {
	// If history is home - add, otherwise replace

}

module.exports = {fixResultHistory, overlayIn, overlayOut};
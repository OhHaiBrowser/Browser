var {remote} = require('electron');
var ThisWindow = remote.getCurrentWindow();

var Page2Load = getParameterByName('url',window.location.href);
console.log(Page2Load);




function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



document.getElementById('CloseBtn').addEventListener('click', function() {
	ThisWindow.close(); 
});
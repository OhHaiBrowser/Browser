let core = require('./../../modules/OhHaiBrowser.Core');

module.exports = function load(){
	let aboutPage = core.generateElement(`
	<div class='SettingsList'>
		<p>Browser Version</p>
		<span>3.3.0</span>
	</div>`);

	var Update_header = document.createElement('p');
	Update_header.appendChild(document.createTextNode('Update Status'));
		
	var browser_update = document.createElement('div');
	var browser_update_status = document.createElement('span');
		
	//if(true){
	browser_update_status.appendChild(document.createTextNode('Your browser is upto date :)'));
	//}
	//else{
	//	browser_update_status.appendChild(document.createTextNode('Please update your browser!'));
	//}
	browser_update.appendChild(browser_update_status);		
		
	return aboutPage;
};
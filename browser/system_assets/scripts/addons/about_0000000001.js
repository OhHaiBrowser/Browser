var about_0000000001 = {
	Load: function() {
		var outer_div = document.createElement('div');
		outer_div.setAttribute("class","SettingsList");
		
		var Version_header = document.createElement('p');
		Version_header.appendChild(document.createTextNode("Browser Version"));
		
		var browser_version_text = document.createElement('span');
		browser_version_text.appendChild(document.createTextNode("3.1.0"));
		
		var Update_header = document.createElement('p');
		Update_header.appendChild(document.createTextNode("Update Status"));
		
		var browser_update = document.createElement('div');
		var browser_update_status = document.createElement('span');
		
		if(true){browser_update_status.appendChild(document.createTextNode("Your browser is upto date :)"));}
		else{browser_update_status.appendChild(document.createTextNode("Please update your browser!"));}
		browser_update.appendChild(browser_update_status);
		
		outer_div.appendChild(Version_header);	
		outer_div.appendChild(browser_version_text);	
		
		//outer_div.appendChild(Update_header);	
		//outer_div.appendChild(browser_update);
		
		return outer_div;
	}
}
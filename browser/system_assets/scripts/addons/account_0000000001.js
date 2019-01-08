var account_0000000001 = {
	Load: function() {
		var outer_div = document.createElement('div');
		outer_div.setAttribute("class","SettingsList");
		
		var comingsoonmsg = document.createElement('span');
		comingsoonmsg.appendChild(document.createTextNode("This feature is coming soon."));
		
		outer_div.appendChild(comingsoonmsg);

		return outer_div;
	}
}
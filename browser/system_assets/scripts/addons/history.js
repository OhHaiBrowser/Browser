var {History} = require('./../../modules/OhHaiBrowser.Data');

module.exports = function load(){
	var HistDiv = document.createElement('div');
	HistDiv.setAttribute('class','HistDiv');
    
	History.List((HistItems) => {
		if (!Array.isArray(HistItems) || !HistItems.length) {
			//no items
			var NoItems = document.createElement('h3');
			NoItems.appendChild(document.createTextNode('No History :('));
			HistDiv.appendChild(NoItems);
		}else{			
			var histListData = '';
			var dateList =	extract(HistItems);

			dateList.forEach((dateItem) => {
				histListData += `<p class='Datetitle'>${Convert_DateTitle(dateItem.date)}</p>`;
				dateItem.items.forEach((thisitem) => {
					histListData += `
						<div class='histItem'>
							<img class='hist_img' src='${thisitem.icon}'/>
							<a class='hist_link' href='javascript:OhHaiBrowser.tabs.activePage.navigate("${thisitem.url}");'>${thisitem.title}</a>
							<span class='hist_datetime'>${Convert_TimeStamp(thisitem.timestamp)}</span>
							<div class='clear'></div>	
						</div>
					`;
				});
			});

			var HistList = document.createElement('div');
			HistList.setAttribute('id','HistList');
			HistList.setAttribute('class','HistList');		
			HistList.innerHTML = histListData;			
		
			HistDiv.appendChild(HistList);
		}
	});

	return HistDiv;
};

function Convert_DateTitle(dateStamp){
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','Febuary','March','April','May','June','July','Augusts','September','October','November','December'];
	var d = new Date(dateStamp);

	return (`${days[d.getDay()]} - ${ addZero(d.getDate())} ${months[d.getMonth()]}`);
}

function Convert_TimeStamp(timestamp){	
	var d = new Date(timestamp);			
	return addZero(d.getHours()) + ':' + addZero(d.getMinutes())
}

function extract(inputArray) {

	// this gives an object with dates as keys
	const groups = inputArray.reduce((groups, item) => {
		var d = new Date(item.timestamp);
		const date = d.toISOString().split('T')[0];
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(item);
		return groups;
	}, {});

	// Edit: to add it in the array format instead
	const groupArrays = Object.keys(groups).map((date) => {
		return {
			date,
			items: groups[date]
		};
	});

	return groupArrays;
}


function addZero(i) {
	if (i < 10) {
		i = '0' + i;
	}
	return i;
}
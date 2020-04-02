var {History} = require('../../system_assets/modules/OhHaiBrowser.Data');

module.exports = class HistoryEl extends HTMLElement {
	constructor() {
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = `
			<style>	
				.HistList{
					padding: 5px;
				}
					.HistDayList{
						margin-bottom: 5px;
						border-radius: 5px;
					}			
						.Datetitle {
							margin: 0;
							padding: 5px;
							background-color: #d2d4f2;
							font-size: 13px;
							border-radius: 5px 5px 0 0;
						}
						.itemList{
							padding: 5px;
							background: #fff;
							border-radius: 0 0 5px 5px;
						}

							.histitem {
								margin: 10px 5px;
							}

								.hist_img {
									height: 18px;
									width: 18px;
									margin-right: 10px;
									float: left;
								}

								.hist_link {
									display: inline-block;
									width: 100px;
									height: 20px;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									line-height: 20px;
									font-size: 13px;
								}

								.hist_datetime {
									float: right;
									font-size: 13px;
								}
			</style>
			<div class="HistDiv">
			</div>
		`;
		this.updateData();
	}
	updateData() {
		let domHistList = this.shadowRoot.querySelector('.HistDiv');
		History.List().then(arry => {
			if (!Array.isArray(arry) || !arry.length) {
				domHistList.innerHTML = '<h3>No history :(</h3>';
			} else {
				domHistList.innerHTML = `
					<div id="HistList" class="HistList">
						${extract(arry).map(item => `

							<div class='HistDayList'>
								<p class='Datetitle'>${Convert_DateTitle(item.date)}</p>
								<div class='itemList'>
								${item.items.map((thisitem => `
									<div class='histItem'>
										<img class='hist_img' src='${thisitem.icon}'/>
										<a class='hist_link' href='javascript:OhHaiBrowser.tabs.activePage.navigate("${thisitem.url}");'>${thisitem.title}</a>
										<span class='hist_datetime'>${Convert_TimeStamp(thisitem.timestamp)}</span>
										<div class='clear'></div>	
									</div>
								`)).join('')}
								</div>
							</div>

						`).join('')}
					<div>
				`;
			}
		});
	}
};

function Convert_DateTitle(dateStamp){
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','Febuary','March','April','May','June','July','Augusts','September','October','November','December'];
	var d = new Date(dateStamp);

	return (`${days[d.getDay()]} - ${ addZero(d.getDate())} ${months[d.getMonth()]}`);
}

function Convert_TimeStamp(timestamp){	
	var d = new Date(timestamp);			
	return addZero(d.getHours()) + ':' + addZero(d.getMinutes());
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
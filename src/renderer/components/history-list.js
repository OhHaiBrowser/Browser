export class HistoryItem extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .histItem {
                    height: 35px;
                    background: rgb(255 255 255 / 55%);
                    transition: background 0.25s;
                    border-radius: 2px;
                    margin: 15px 0;
                    display:flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    user-select:none;
                }
                    .histItem:hover {
                        background: rgb(255 255 255 / 70%);
                    }

                #hist_img {
                    height: 16px;
                    width: 16px;
                    border-radius: 2px;
                    margin: 9px;                
                }
                #hist_text {
                    flex:auto;
                    font-size: 14px;
                    height: 16px;
                    line-height: 16px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;    
                    margin: 9px 5px;        
                }
                #hist_dt {
                    font-size: 14px;
                    height: 16px;
                    line-height: 16px;
                    margin: 9px 14px 9px 5px;
                }
            </style>
            <div class='histItem'>
                <img id='hist_img'/>
                <span id='hist_text'></span>
                <span id='hist_dt'></span>
            </div>
        `;
        this.shadowRoot.querySelector('.histItem').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate', {detail: {url: this.getAttribute('url')}}));
        });
        this.shadowRoot.querySelector('.histItem').addEventListener('contextmenu', () => {
            this.dispatchEvent(new CustomEvent('context-click'));
        });
    }
    connectedCallback() {
        this.hasAttribute('icon') ? this.shadowRoot.getElementById('hist_img').src = this.getAttribute('icon') : this.shadowRoot.getElementById('hist_img').src = 'assets/favicon_default.png';
        this.hasAttribute('title') ? this.shadowRoot.getElementById('hist_text').textContent = this.getAttribute('title') : this.shadowRoot.getElementById('hist_text').textContent = 'Default item';
        this.hasAttribute('timestamp') ? this.shadowRoot.getElementById('hist_dt').textContent = this.getAttribute('timestamp') : this.shadowRoot.getElementById('hist_dt').textContent = '00:00';
    }
}

export class HistoryList extends HTMLElement {
    #histList = [];
    constructor() { 
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = `
            <style>
                #histList {
                    
                }
                    #histList > details {

                    }
                        #histList > details > summary {
                            color: #172467;
                            margin: 0;
                            font-size:16px;
                        }
                        #histList > .dayList > .container {
                            
                        }
            </style>
            <div id='histList'>
                
            </div>
        `;
    }
    load(list){
        this.#histList = list;
        this.render();
    }
    add(item) {
        
    }
    remove(item) {

    }
    export() {

    }
    render(){
        const listOuter = this.shadowRoot.getElementById('histList');
        listOuter.innerHTML = `
            ${extract(this.#histList).map((item, idx) => `
                <details ${idx < 1 ? 'open' : ''}>
                    <summary>${Convert_DateTitle(item.date)}</summary>
                    <div class='container'>
                    ${item.items.map((thisItem => `
                        <history-item icon='${thisItem.icon}' title='${thisItem.title}' url='${thisItem.url}' timestamp='${Convert_TimeStamp(thisItem.timestamp)}'></history-item>
                    `)).join('')}
                    </div>
                </details>
            `).join('')}
        `;
        listOuter.querySelectorAll('history-item').forEach(el => {
            el.addEventListener('navigate', (e) => {
                this.dispatchEvent(new CustomEvent('item-click', {detail: {url: e.detail.url }}));
            });
            el.addEventListener('contextmenu', (e) => {
                this.dispatchEvent(new CustomEvent('item-context', {detail: {event: e}}));
            });
        });
    }
}

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
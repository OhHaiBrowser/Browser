
class tabContainer extends HTMLElement{
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
            <style>
                .TabContainer {
                    max-height: none;
                    padding: 0;
                }
                .AddTab::before {
                    content: "+";
                    color: #fff;
                }               
                .AddTab {
                    width: 50px;
                    display: block;
                    margin: 10px auto;
                    border-radius: 4px;
                    border: none;
                    background-color: rgba(23, 36, 103, 0.6);
                    transition: background-color 0.5s;
                    cursor: pointer;
                }   
                .AddTab:hover { background-color: rgba(23, 36, 103, 0.8); }   
                .AddTab:active {
                    box-shadow: inset 0px 5px 10px #c4c4c4;
                    background-color: rgb(247, 241, 241);
                }
            </style>
            <div class="TabContainer">
                <div id="Tabs">
                    <slot></slot>
                </div>
                <button id="AddTab" title="Add a new tab" class="CommandBtn AddTab"></button>
            </div>
        `;
		this.shadowRoot.getElementById('AddTab').addEventListener('click', () => {
			this.dispatchEvent(new Event('addClick'));
		});
	}    
}

module.exports = tabContainer;

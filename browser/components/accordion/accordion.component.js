
class AccordionPanel extends HTMLElement {
	constructor(){
		super();
	}
	connectedCallback(){
		document.addEventListener('DOMContentLoaded', () => { 
			Array.from(this.children).forEach(element => {
				element.addEventListener('dragOverTitle', (e) => {
					this.showPanel(e.detail);
				});
				element.addEventListener('clickTitle', (e) => {
					this.showPanel(e.detail);
				});
			});
		});
	}
	showPanel(panel){
		//Hide current one. First time it will be null. 
		var expandedPanel = this.querySelector('.active');
		if (expandedPanel){
			expandedPanel.classList.remove('active');
			expandedPanel.setAttribute('active', 'false');
		}
		//Show new one
		panel.classList.add('active');
		panel.setAttribute('active', 'true');
	}
	panels(){
		return this.children;
	}
	/**
	 * 
	 * @param {AccordionItem} item 
	 */
	add(item) {
		this.appendChild(item);
	}
}
module.exports.accordionPanel = AccordionPanel;

class AccordionItem extends HTMLElement {
	static get observedAttributes() {
		return [
			'active',
			'title'
		];
	}

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
            <link rel='stylesheet' href='${__dirname}/accordion.component.css' />
            <div class='acc-header'><span class="panTitle"></span></div>
            <div class='acc-body'>
                <slot></slot>
            </div>
        `;
		this.accHeader = this.shadowRoot.querySelector('.acc-header');
		this.accTitle = this.shadowRoot.querySelector('.acc-header .panTitle');
		this.accBody = this.shadowRoot.querySelector('.acc-body');

		this.accHeader.addEventListener('dragenter', () => {
			this.dispatchEvent(new CustomEvent('dragOverTitle', {detail: this}));
		});
		this.accHeader.addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('clickTitle', { detail: this}));
		});
	}

	connectedCallback(){
		this.classList.add('panel');
		if (this.hasAttribute('active')){
			this.classList.add('active');
			this.accHeader.classList.add('active');
			this.accBody.classList.add('active');
		}
		this.accTitle.textContent = this.hasAttribute('title') ? this.getAttribute('title') : 'Title';
	}

	attributeChangedCallback(attrName, oldVal, newVal){
		switch(attrName){
		case 'active':
			this.accHeader.classList.toggle('active');
			this.accBody.classList.toggle('active');
			break;
		case 'title': 
			this.accTitle.textContent = newVal;
			break;
		}
	}
}
module.exports.accordionItem = AccordionItem;

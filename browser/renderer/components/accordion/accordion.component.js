
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
			<style>
				.acc-header::before{
					content: '>'; 
					color: var(--sidebar_header_title);
					display: inline-block;
					margin-right: 3px;  
					transition: all 0.3s;
				}
				.acc-header{
					line-height: 20px;
					font-size: 14px;
					background: var(--sidebar_header_bg);
					padding: 5px;
					cursor: pointer;
					transition: background 0.2s;
					display: flex;
				}   
					.acc-header .panTitle{
						text-transform: uppercase;
						font-weight: bold;
						font-size: 11px;
						user-select: none;
						color: var(--sidebar_header_title);
						flex: auto;
					}
					.acc-header .contextBtns {
						opacity: 0;
						transition: opacity 0.5s;
					}
					.acc-header .contextBtns.visible {
						opacity: 1;
					}
				
				.acc-header.active::before{
					content: '>';
					transform: rotate(90deg);
				}    
				
				.acc-body{
					height: 0px;
					overflow: hidden;
					transition: all 0.2s;
					opacity: 0;
					flex: 1 1 auto;
				}
				.acc-body.active {
					opacity: 1;
					overflow-y: auto;         
				}
				.acc-body.active::-webkit-scrollbar {
					width: 10px;
				}
				
				.acc-body.active::-webkit-scrollbar-thumb {
					opacity: 0.5;
					background: rgb(85, 85, 85);   
				}
					.acc-body.active::-webkit-scrollbar-thumb:hover {
						background: rgb(110, 110, 110);
					}
			</style>
			<div class='acc-header'>
				<span class="panTitle"></span>
				<div class='contextBtns'>
					<slot name='context-btns'></slot>
				</div>
			</div>
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

		const accContextBtns = this.shadowRoot.querySelector('.contextBtns');
		this.addEventListener('mousemove', () => {
			if(this.hasAttribute('active') && !accContextBtns.classList.contains('visible')) {
				if(this.getAttribute('active') === 'true') {
					accContextBtns.classList.add('visible');
				}
			}
		});

		this.addEventListener('mouseleave', (e) => {
			accContextBtns.classList.remove('visible');
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

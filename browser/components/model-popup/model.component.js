
class ModelPopup extends HTMLElement {

    static get observedAttributes() {
		return [
			'title'
		];
	}

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.render();
	}
	connectedCallback() {

	}
	render() {
		const title = this.hasAttribute('title') ? this.getAttribute('title') : '';
		this.shadowRoot.innerHTML = `
            <link rel='stylesheet' href='${__dirname}/model.component.css'/>
            <div id='BlurBg' style='display:none;'>
            </div>
            <div id="modelPopup" style='display:none;'>
                <div class="modeltitleBar">
                    <span class="modeltitle">${title}</span>
                    <button class="modelClose">x</button>
                </div>
                <div id="modelContent">
                    <slot></slot>
                </div>
            </div>
        `;
		this.shadowRoot.querySelector('.modelClose').addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('close'));
			this.toggle();
		});
	}
	toggle() {
		if(this.shadowRoot.querySelector('#BlurBg').hasAttribute('style')) {
			this.shadowRoot.querySelector('#BlurBg').removeAttribute('style');
			this.shadowRoot.querySelector('#modelPopup').removeAttribute('style');
		} else {
			this.shadowRoot.querySelector('#BlurBg').setAttribute('style', 'display:none;');
			this.shadowRoot.querySelector('#modelPopup').setAttribute('style', 'display:none;');
		}
    }
    
    attributeChangedCallback(attrName, oldVal, newVal){
        this.render();
     }
}

module.exports.ModelPopup = ModelPopup;
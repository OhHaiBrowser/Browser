
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
			<style>
				#BlurBg{
					z-index: 500;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					overflow: hidden;
				}
				
				#modelPopup{
					z-index: 501;
					position: fixed;
					width: 600px;
					height: 400px;
					background: #fff;
					border-radius: 5px;
					left: calc(50% - 300px);
					top: calc(50% - 200px);
					box-shadow: 0px 0px 15px #000;
				}
					.modeltitleBar{
						height: 30px;
						box-sizing: border-box;
						padding: 5px;
						background: var(--main);
						border-top-right-radius: 5px;
						border-top-left-radius: 5px;
					}
						.modeltitle{
							color: #fff;
						}
						.modelClose{
							float: right;
							height: 20px;
							width: 20px;
							border: none;
							border-radius: 20px;
							text-align: center;
							background: transparent;
							color: #fff;
						}
						.modelClose:hover{
							background-color:#f53355;
						}
				
					#modelContent{
						overflow: auto;
						height: calc(100% - 30px);
						border-bottom-left-radius: 5px;
						border-bottom-right-radius: 5px;
					}
			</style>
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
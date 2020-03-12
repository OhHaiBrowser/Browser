
class BlurPopup extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
            <div id='BlurBg'>
            </div>
            <div id="modelPopup">
                <div class="modeltitleBar">
                    <span class="modeltitle">title</span>
                    <button class="modelClose">x</button>
                </div>
                <div id="modelContent"></div>
            </div>
        `;
	}
}
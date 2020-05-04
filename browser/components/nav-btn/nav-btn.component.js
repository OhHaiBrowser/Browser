
class NavBtn extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.render();
	}
	connectedCallback() {

	}
	render() {
		let title = this.hasAttribute('title') ? this.getAttribute('title') : '';
		let icon = this.hasAttribute('icon') ? this.getAttribute('icon') : '';
		let value = this.hasAttribute('value') ? this.getAttribute('value') : '';
        
		this.shadowRoot.innerHTML = `
            <style>
            .navBtn {
                display: inline-block;
                -webkit-app-region: no-drag;
                width: 28px;
                height: 28px;
                margin-left: 2px;
                margin-right: 2px;
                border: none;
                border-radius: 4px;
                outline: none;
                background-color: transparent;
                font-size: 24px;
                line-height: 24px;
                padding: 0;
                color: var(--controls);
                text-align: center;
            }
                .navBtn:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                    cursor: pointer;
                }
            </style>
            <button title='${title}' class='navBtn'>
                ${value !== '' ? `<span>${value}</span>` : ''}
            </button>
        `;
		this.shadowRoot.querySelector('.navBtn').addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('click'));
		});
	}
}

module.exports.NavBtn = NavBtn;
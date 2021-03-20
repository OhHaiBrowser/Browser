
export class ResizeWindow extends HTMLElement {
    static get observedAttributes() {return ['aria-selected']}
    constructor(){
        super();

        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .window {
                    display: flex;
                    height: auto;
                    flex: auto;
                    width: 1000px;
                    height: 100%;
                    min-width: 500px;
                }
                    .window > .content {
                        background: #fff;
                        border-radius: 2px;
                        flex: auto;
                        display:flex;
                        flex-direction:column;
                    }
                        .window > .content.active {
                            
                        }

                    .window > .resizer {
                        width: 7px;
                        margin: 0px;
                        transition: background 0.25s;
                    }
                        .window > .resizer:hover {
                            background: rgb(255 255 255 / 65%);
                            cursor: ew-resize;
                        }
            </style>
            <div class='window'>
                <div class='content'>
                    <slot></slot>
                </div>
                <div class='resizer'></div>
            </div>
        `;
        
        const BORDER_SIZE = 7;
        let m_pos;
        const resizeBar = this.shadowRoot.querySelector('.resizer');
        const windowDiv = this.shadowRoot.querySelector('.window');

        const resize = (e) => {
            const dx = e.x - m_pos;
            m_pos = e.x;
            windowDiv.style.width = (parseInt(getComputedStyle(windowDiv, '').width) + dx) + "px";
        };

        const fireEvent = (str) => {
            this.dispatchEvent(new CustomEvent(str));
        }

        resizeBar.addEventListener('mousedown', (e) => {
            if (e.offsetX < BORDER_SIZE) {
                m_pos = e.x;
                window.addEventListener("mousemove", resize, false);
                fireEvent('startDrag');
            }
        }, false);

        window.addEventListener("mouseup", function(){
            window.removeEventListener("mousemove", resize, false);
            fireEvent('endDrag');
        }, false);
    }
    connectedCallback() {
        this.shadowRoot.querySelector('.content').classList.toggle('active', this.getAttribute('aria-selected') === 'true');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'aria-selected':
                this.shadowRoot.querySelector('.content').classList.toggle('active', newValue === 'true');
            break;
        }
    }
}
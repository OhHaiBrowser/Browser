export class FrameControls extends HTMLElement {
    static get observedAttributes() { return ['platform', 'maximized', 'fullscreen']; }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.setupWinControls();
    }
    connectedCallback(){
        
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'platform':

                break;
            case 'maximized':

                break;
            case 'fullscreen':

                break
        }
    }
    setupWinControls() {
        this.shadowRoot.innerHTML = `
        <style>
            @font-face {
                font-family: Segoe MDL2 Assets;
                src: url("../../assets/fonts/SegMDL2.ttf");
            }

            #window-controls {
                display: grid;
                grid-template-columns: repeat(3, 46px);
                height: 30px;
                font-size: 10px;
                color: #000;
                position: absolute;
                top: 0;
                right: 0;
                -webkit-app-region: no-drag;
            }
                .button {
                    grid-row: 1 / span 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    user-select: none;
                    cursor: default;
                    font-family: "Segoe MDL2 Assets";
                }

                #left-button {
                    grid-column: 1;
                }
                #center-button {
                    grid-column: 2;
                }
                #right-button {
                    grid-column: 3;
                }
            
                .button:hover {
                    background: rgba(0,0,0,0.1);
                }
                .button:active {
                    background: rgba(0,0,0,0.2);
                }
            
                #right-button:hover {
                    background: #E81123 !important;
                }
                #right-button:active {
                    background: #f1707a !important;
                    color: #000;
                }
        </style>
        <div id="window-controls">
            <div class="button" id="left-button">&#xE921;</div>
            <div class="button" id="center-button">&#xE922;</div>
            <div class="button" id="right-button">&#xE8BB;</div>
        </div>
        `;
        this.shadowRoot.getElementById('left-button').addEventListener('click', () => {
            this.dispatchEvent(new Event('minimise', {bubbles: true, composed: true}));
        });
        const centerBtn = this.shadowRoot.getElementById('center-button');
        centerBtn.addEventListener('click', () => {
            if(this.windowMaximised){
                this.dispatchEvent(new Event('restore', {bubbles: true, composed: true}));
                centerBtn.innerHTML = '&#xE922;';
                this.windowMaximised = false;
            }else{
                this.dispatchEvent(new Event('maximise', {bubbles: true, composed: true}));
                centerBtn.innerHTML = '&#xE923;';
                this.windowMaximised = true;
            }
        });
        this.shadowRoot.getElementById('right-button').addEventListener('click', () => {
            this.dispatchEvent(new Event('close', {bubbles: true, composed: true}));
        });   
    }
}
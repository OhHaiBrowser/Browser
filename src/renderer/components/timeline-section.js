export class TimelineSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .section {
                    display:flex;
                    flex-direction: column;
                    user-select:none;
                }
                    .section > .heading {
                        padding: 15px 0;
                        display: flex;
                        flex-direction: row;
                    }
                        .section > .heading > .title {
                            display: inline-block;
                            color: #172467;
                            font-size: 20px;
                            line-height: 27px;
                            margin: 0;
                            flex: auto;
                        }
                        .section > .heading > .actions {
                            display:flex;
                            flex-direction:row;
                            flex:auto;
                            justify-content: flex-end;
                        }                        
                    .section > .content {
                        flex: auto;
                    }
            </style>
            <div class="section">
                <div class='heading'>
                    <h2 class="title"></h2>
                    <div class='actions'>
                        <slot name='action-btns'></slot>
                    </div>
                </div>
                <div class='content'>
                    <slot></slot>
                </div>
            </div>
        `;
    }
    connectedCallback() {
        this.shadowRoot.querySelector('.heading > .title').innerHTML = this.getAttribute('title');

    }
}
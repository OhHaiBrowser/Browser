export class BookmarksList extends HTMLElement {
    #favList = [];
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = `
            <style>
                #favList {
                    display:grid;
                    grid-template-columns: repeat(6, 1fr);
                    grid-column-gap: 10px;
                    grid-row-gap: 10px;
                }

                    .favItem {
                        display: flex;
                        background: var(--controls-default);
                        box-sizing: border-box;
                        border-radius: 2px;
                        transition: background 0.25s;
                        align-items: center;
                        justify-content: center;
                        aspect-ratio: 1 / 1;
                    }   
                        .favItem:hover{
                            background: var(--controls-hover);
                        }
                        .favItem:active {
                            background: var(--controls-active);
                        }
                    
                        .favItem > img {
                            width: 20px;
                            box-sizing: border-box;
                        }
            </style>
            <div id="favList">

            </div>
            <template>
                <div class='favItem'>
                    <img/ id='fav_img'>
                </div>
            </template>
        `;
    }
    load(list){
        this.#favList = list;
        list.forEach(item => {
            var clone = document.createElement('div');
            clone.classList.add('favItem');
            clone.innerHTML = `<img/ id='fav_img'>`;
            clone.querySelector('#fav_img').src =  'assets/favicon_default.png';

            this.dispatchEvent(new CustomEvent('new-item', {detail: {el: clone }}));
            this.shadowRoot.getElementById('favList').appendChild(clone);
        });
    }
    add(item) {
        
    }
    remove(item) {

    }
    export() {

    }
}
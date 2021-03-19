class NanoTabs {
    events = [];
    constructor(tabBar_id, tabContent_id, opts = {}) {
        this.tabBar = document.getElementById(tabBar_id);
        this.tabContent = document.getElementById(tabContent_id);
        this.tabTemplate = this.tabBar.querySelector('template');
        this.contentTemplate = this.tabContent.querySelector('template');
        
        this.tabBar.setAttribute('role', 'tablist');
        this.tabBar.setAttribute('aria-label', 'Tabs list');

        this.tabList = document.createElement('div');
        this.tabList.setAttribute('role', 'tablist');
        this.tabList.setAttribute('aria-label', 'Tabs list');
        this.tabList.classList.add('nanotabs_tabList');
        let tabFocus = 0;
        this.tabList.addEventListener('keydown', e => {
            const tabs = this.tabList.querySelectorAll('[role="tab"]');
            if (e.keyCode === 39 || e.keyCode === 37) {
                tabs[tabFocus].setAttribute('tabindex', -1);
                if (e.keyCode === 39) {
                    tabFocus++;
                    if (tabFocus >= tabs.length) {
                        tabFocus = 0;
                    }
                } else if (e.keyCode === 37) {
                    tabFocus--;
                    if (tabFocus < 0) {
                      tabFocus = tabs.length - 1;
                    }
                }
                tabs[tabFocus].setAttribute("tabindex", 0);
                tabs[tabFocus].focus();
            }
        });

        this.tabBar.appendChild(this.tabList);

        let addBtn = document.createElement('button');
        addBtn.addEventListener('click', () => {
            this.addTab({selected: true});
        });
        addBtn.textContent = '+';
        addBtn.classList.add('nanotabs_addBtn');

        if(opts.hasOwnProperty('showAddBtn')){
            if(opts.showAddBtn){
                this.tabBar.appendChild(addBtn);
            }
        } else {
            this.tabBar.appendChild(addBtn);
        } 
    }
    // == Tab functions ==========================================================
    /**
     * Returns count of current tabs
     */
    get tabcount() {
        return this.tabList.querySelectorAll('[role="tab"]').length;
    }
    /**
     * 
     * @param {Object} opts Options passed to new tab
     */
    addTab(opts = {}) {
        const uId= ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));        
        let newT = this.tabTemplate.content.cloneNode(true);
        let newC = this.contentTemplate.content.cloneNode(true);
        // new tab
        let newTab = newT.firstElementChild;
        newTab.id  = `t_${uId}`;
        newTab.setAttribute('role', 'tab');
        newTab.setAttribute('aria-selected', false);
        newTab.setAttribute('aria-controls', `c_${uId}`);
        newTab.setAttribute('tabindex', 1);
        newTab.addEventListener('click', (e) => {
            this.selectTab(`t_${uId}`);
        });
        newTab.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.events.filter(ev => ev.event === 'tab-context-click').forEach(ev => ev.func(newTab, newContent));
        });

        // new content
        let newContent = newC.firstElementChild;
        newContent.id  = `c_${uId}`;
        newContent.setAttribute('role', 'tabpanel');
        newContent.setAttribute('tabindex', 0);
        newContent.setAttribute('aria-labelledby', `t_${uId}`);
        newContent.setAttribute('hidden', true);
        
        this.tabList.appendChild(newT);
        this.tabContent.appendChild(newC);
        this.events.filter(e => e.event === 'tab-added').forEach(e => e.func(newTab, newContent));

        this.selectTab(`t_${uId}`, true);

        return {tab: newTab, content: newContent};
    }
    /**
     * 
     * @param {string} t_id id of tab to remove
     */
    removeTab(t_id) {
        event.stopPropagation();
        const targetTab = this.tabList.querySelector(`#${t_id}`);
        const targetContent = this.tabContent.querySelector(`[aria-labelledby="${t_id}"]`);

        if (targetTab.getAttribute('aria-selected') === 'true') {
            //select next tab
            if(targetTab.nextElementSibling){
                this.selectTab(targetTab.nextElementSibling.id);
            } else if (targetTab.previousElementSibling) {
                this.selectTab(targetTab.previousElementSibling.id);
            }
        }

        this.tabList.removeChild(targetTab);
        this.tabContent.removeChild(targetContent);

        this.events.filter(e => e.event === 'tab-removed').forEach(e => e.func());

        if(this.count === 0) {
            this.events.filter(e => e.event === 'tab-allRemoved').forEach(e => e.func());
        }
    }
    /**
     * 
     * @param {string} t_id id of the tab you want to select
     * @param {boolean} muffleEvent send selected event after tab selected?
     */
    selectTab(t_id, muffleEvent = false) {
        const targetTab = this.tabList.querySelector(`#${t_id}`);
        const targetContent = this.tabContent.querySelector(`[aria-labelledby="${t_id}"]`);

        if (targetTab.getAttribute('aria-selected') !== 'true')  {
            this.tabList.querySelectorAll('[aria-selected="true"]').forEach(t => t.setAttribute("aria-selected", false));
            targetTab.setAttribute("aria-selected", true);
    
            this.tabContent.querySelectorAll('[role="tabpanel"]').forEach(p => p.setAttribute("hidden", true));
            targetContent.removeAttribute('hidden');
            
            if (!muffleEvent) this.events.filter(e => e.event === 'tab-selected').forEach(e => e.func(targetTab, targetContent));
        }
    }
    // == Group functions ========================================================
    addGroup(opts = {}) {
        const uId= ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); 
        const groupColor = (() => { var letters = '0123456789ABCDEF'; var color = '#'; for (var i = 0; i < 6; i++) { color += letters[Math.floor(Math.random() * 16)]; } return color; });
        const thisGroupColor = groupColor();
        const groupOuterTemplate = document.createElement('details');
        const groupBadgeTemplate = document.createElement('summary');
        const groupInnerTemplate = document.createElement('div');

        groupOuterTemplate.id = `g_${uId}`;
        groupOuterTemplate.classList.add('nanotabs_group');

        groupBadgeTemplate.classList.add('nanotabs_groupbadge');
        groupBadgeTemplate.style.background = thisGroupColor;
        if(opts.hasOwnProperty('name')){ 
            groupBadgeTemplate.textContent = opts.name;
        } else {
            groupBadgeTemplate.textContent = 'New group';
        }

        groupInnerTemplate.style.borderColor = thisGroupColor;
        groupInnerTemplate.classList.add('nanotabs_groupcontainer');

        groupOuterTemplate.appendChild(groupBadgeTemplate);
        groupOuterTemplate.appendChild(groupInnerTemplate);

        this.tabList.appendChild(groupOuterTemplate);
        this.events.filter(e => e.event === 'group-added').forEach(e => e.func());
    }
    removeGroup(g_id) {
        event.stopPropagation();
        const targetGroup = this.tabList.querySelector(`#${g_id}`);
        const groupTabs = targetGroup.querySelectorAll('div > [role="tab"]');

        if(groupTabs.length > 0) {

        }

        this.tabList.removeChild(targetGroup);
        this.events.filter(e => e.event === 'group-removed').forEach(e => e.func());
    }
    addTabToGroup(g_id, t_id) {

    }
    removeTabFromGroup(g_id, t_id) {

    }
    // == Global functions ==================================================
    /**
     * 
     * @param {'tab-selected'|'tab-added'|'tab-context-click'|'tab-removed'|'tab-allRemoved'|'group-added'|'group-removed'} event name of event
     * @param {void} func event function
     */
    on(event, func){
        this.events.push({event, func})
    }
}
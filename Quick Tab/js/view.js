function Manager()
{
    this.help = new Help();
    this.search = new Search(this);

    this.tabReference = document.querySelector('#tabs');
    this.tabArray = this.generateList();
    this.selectedTab = -1;

    this.tabLock = false;

    this.help.show();

    // Block up and down arrows in search box to prevent repositioning of carret to beginning/end
    this.search.searchInputReference.addEventListener('keydown', function(e) {
        keyCode = e.keyCode;

        if(
            keyCode == 38 ||					   //Up
            keyCode == 40   					   //Down
        ){
            e.preventDefault();
        }
    }.bind(this));
    
    //User pressed a key in the search box
    this.search.searchInputReference.addEventListener('keyup', function(e) {
        if(this.search.isValidSearchChar(e)) {
            this.search.searchInputKeyup(e, this.tabArray);
        }
    }.bind(this));

    //User clicked the clear search button
    this.search.searchClearReference.addEventListener('mousedown', function(e) {
        this.search.clear(this.tabArray);
    }.bind(this));
}
	
Manager.prototype.generateList = function()
{
	var tabArray = [];
	chrome.tabs.query({}, function(tabs) {
		for(var i=0; i<tabs.length; i++) {
            //Create an object for each tab
            var tab = new Tab(tabs[i].id, tabs[i].windowId, tabs[i].title, tabs[i].url, tabs[i].favIconUrl, this);
			//Add the object to the tab array
			tabArray.push(tab);
			//Add to the tabs view
			this.tabReference.appendChild(tab.view);
		}
    }.bind(this));

	return tabArray;
};

Manager.prototype.setSelectedTab = function(tabId)
{
    if (!this.tabLock) {

        var i = 0;
        while (i < this.tabArray.length) {
            if (this.tabArray[i].id == tabId) {
                this.selectedTab = i;
                break;
            }
            i++;
        }
    }
};

Manager.prototype.resetSelectedTab = function() {
    if (!this.tabLock) {
        this.selectedTab = -1;
    }
};

Manager.prototype.moveSelectedTab = function(down)
{
    var visibleTabs = [];
    var currentTab = -1;

    for(var i=0; i<this.tabArray.length; i++) {
        if(this.tabArray[i].isVisible)
            visibleTabs.push(i);

        if(this.selectedTab == i)
            currentTab = visibleTabs.length - 1;
    }

    if (down) {
        this.selectedTab = visibleTabs[Math.min(visibleTabs.length - 1, currentTab + 1)];
    } else {
        this.selectedTab = visibleTabs[Math.max(0, currentTab-1)];
    }

    this.updateViewOffset();
    this.updateSelectedTab();
    this.tabLock = true;
};

Manager.prototype.updateViewOffset = function()
{
    var top = document.body.scrollTop;
    var bottom = top + window.innerHeight;

    var bounds = this.tabArray[this.selectedTab].view.getBoundingClientRect();
    var tabTop = bounds.top + window.pageYOffset - document.documentElement.clientTop;
    var tabBottom = bounds.bottom + window.pageYOffset - document.documentElement.clientTop;
    var moveDistance = tabBottom - tabTop;

    if (tabTop - top < moveDistance * 2) {
        document.body.scrollTop -= moveDistance;
    }

    if (bottom - tabBottom < moveDistance * 2) {
        document.body.scrollTop += moveDistance;
    }
};

Manager.prototype.updateSelectedTab = function()
{
    for(var i=0; i<this.tabArray.length; i++) {
        if (i == this.selectedTab)
            this.tabArray[i].view.classList.add('tabSelected');
        else
            this.tabArray[i].view.classList.remove('tabSelected');
    }
};


Manager.prototype.switchToSelectedTab = function()
{
    this.tabArray[this.selectedTab].switchTo();
};

Manager.prototype.selectFirstTab = function()
{
    for(var i=0; i<this.tabArray.length; i++) {
        if (this.tabArray[i].isVisible) {
            this.selectedTab = i;
            this.updateSelectedTab();
            break;
        }
    }
};

window.onload = function()
{
    document.onmousemove = function() {
        tabManager.tabLock = false;
    };

	document.oncontextmenu = function(e) {
        e.preventDefault();
    };

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
            case 38:
                tabManager.moveSelectedTab(false);
                e.preventDefault();
                break;
            case 39:
            case 40:
                tabManager.moveSelectedTab(true);
                e.preventDefault();
                break;
            case 13:
                tabManager.switchToSelectedTab();
                break;
            case 27:
                window.close();
                break;
        }

    };

    if (typeof localStorage['popup.width'] == 'undefined') {
        document.body.style.width = '400px';
    } else {
        document.body.style.width = localStorage['popup.width'] * 200 + 'px';
    }

	var tabManager = new Manager();
};
function Manager()
{
    this.help = new Help();
    this.search = new Search();

    this.tabReference = document.querySelector('#tabs');
    this.tabArray = this.generateList();
    this.selectedTab = -1;

    this.help.show();

    //User pressed a key in the search box
    this.search.searchInputReference.addEventListener('keydown', function(e) {
        if(!this.search.isValidSearchChar(e))
            e.preventDefault();
        else
            this.search.searchInputKeydown(e, this.tabArray);
    }.bind(this));

    //User clicked the clear search button
    this.search.searchClearReference.addEventListener('mousedown', function(e) {
        this.search.clear(this.tabArray);
    }.bind(this));
}
	
Manager.prototype.generateList = function()
{
	var tabArray = [];
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for(var i=0; i<tabs.length; i++) {
            //Create an object for each tab
            var tab = new Tab(tabs[i].id, tabs[i].title, tabs[i].url, tabs[i].favIconUrl, this);
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
    var i=0;
    while(i<this.tabArray.length) {
        if(this.tabArray[i].id == tabId) {
            this.selectedTab = i;
            break;
        }
        i++;
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

    this.selectedTab = down ? visibleTabs[Math.min(visibleTabs.length-1, currentTab+1)]
                            : visibleTabs[Math.max(0, currentTab-1)];

    this.updateSelectedTab();
};

Manager.prototype.updateSelectedTab = function()
{
    for(var i=0; i<this.tabArray.length; i++) {
        if(i == this.selectedTab)
            this.tabArray[i].view.classList.add('tabSelected');
        else
            this.tabArray[i].view.classList.remove('tabSelected');
    }
};

window.onload = function()
{
	document.oncontextmenu = function(e) {
        e.preventDefault();
    };

    document.onkeydown = function(e) {;
        if(e.keyCode == 38)
            tabManager.moveSelectedTab(false);
        if(e.keyCode == 40)
            tabManager.moveSelectedTab(true);
    };

    document.onmouseover = function(e) {

    };

	var tabManager = new Manager();
};
function Manager()
{
    this.tabReference = document.querySelector('#tabs');

    this.help = new Help();
    this.search = new Search();

    this.tabArray = this.generateList();

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
			tabArray[tabs[i].id] = new Tab(tabs[i].id, tabs[i].title, tabs[i].url, tabs[i].favIconUrl);
			//Add to the tabs view
			this.tabReference.appendChild(tabArray[tabs[i].id].view);
		}
    }.bind(this));

	return tabArray;
};

window.onload = function()
{
	document.oncontextmenu = function() { return false };
	var tabManager = new Manager();
};
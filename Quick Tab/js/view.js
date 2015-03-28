var Manager = Class.create
({
	initialize : function()
	{	
		this.help = new Help();
		this.search = new Search();

		this.tabArray = this.generateList();


        this.help.show();

		//User pressed a key in the search box
		$('searchInput').addEventListener('keydown', function(e) {
			this.search.searchInputKeydown(e, this.tabArray);
		}.bind(this));

		$('searchInput').addEventListener('keypress', function(e){
			if(!this.search.isValidSearchChar(e, 0))
				e.preventDefault();
		}.bind(this));

		//User clicked the clear search button
		$('searchClear').addEventListener('mousedown', function(e) {
			this.search.clear(this.tabArray);
		}.bind(this));

		//User clicked within the tab list
		$('tabs').addEventListener('mousedown', function(e) {

			//Go up the DOM until the actual tab element is found
			var el = e.target;
			while(el.className != 'tab')
				el = el.parentNode;
			
			//Get the ID for the tab
			var tabId = parseInt(el.id.replace('tab-', ''));

			switch(e.which)
			{
				case 1:
					//Left click, switch to the tab
					this.switchTab(tabId);
					window.close();
					break;
				case 3:
					//Right click, close the tab
					this.closeTab(tabId);
					break;
			}
		}.bind(this));
	},
	
	generateList : function()
	{
		var tabArray = new Array();
		chrome.tabs.getAllInWindow(null, function(tabs)
		{
			for(var i=0; i<tabs.length; i++)
			{
				//Create an object for each tab
				tabArray[tabs[i].id] = new Tab(tabs[i].id, tabs[i].title, tabs[i].url, tabs[i].favIconUrl);
				//Add to the tabs view		
				$('tabs').appendChild(tabArray[tabs[i].id].view);
			}
		});
		
		return tabArray;
	},
	
	closeTab : function(tabId)
	{
		//Remove the tab
		chrome.tabs.remove(tabId);
	
		//Remove the view
		this.tabArray[tabId].close();
	
		//Remove the tab from the tab list
		this.tabArray.splice(tabId, 1);
	},
	
	switchTab : function(tabId)
	{
		chrome.tabs.update(
			tabId,
			{selected: true}
		);
	}
});

window.onload = function() {
	document.oncontextmenu = function() { return false };
	var tabManager = new Manager();
};
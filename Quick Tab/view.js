var TabView = Class.create
({
	initialize : function(delegate)
	{
		this.delegate = delegate;
		this.reference = this.buildTabView();
	},
	
	buildTabView : function()
	{	
		var favImageView = document.createElement('img');
		favImageView.src = this.delegate.fav;
		
		var favView = document.createElement('div');
		favView.className = 'favicon';
		favView.appendChild(favImageView);

		var titleView = document.createElement('div');
		titleView.className = 'title';
		titleView.appendChild(document.createTextNode(this.delegate.title));

		var view = document.createElement('div');
		view.className = 'tab';
		view.id = 'tab-' + this.delegate.id;
		view.appendChild(favView);
		view.appendChild(titleView);
		
		return view;
	}, 
});

var Tab = Class.create
({
	initialize : function(id, title, url, fav)
	{
		//If there is no favicon for the page use the "blank" one
		if (
			fav == undefined ||
			fav == "" ||
			fav == "chrome://theme/IDR_EXTENSIONS_FAVICON" ||
			fav == "chrome://theme/IDR_EXTENSIONS_FAVICON@2x"
		)
			fav = "images/blank.png";
	
		//Create the properties
		this.id = id;
		this.title = title;
		this.url = url;
		this.fav = fav;
		this.view = new TabView(this);
	
	},
		
	hideView : function()
	{
		$(this.view.reference).hide();
	},
	
	showView : function()
	{
		$(this.view.reference).show();
	},
	
	closeView : function()
	{
		$(this.view.reference).remove();
	}
});

var Help = Class.create
({
	initialize : function()
	{
		//Show help if it's a fresh install
		if(localStorage.getItem('help_closed') == undefined)
			this.showView();
	},
	
	showView : function()
	{
		$('help').show();
		$('helpButton').onclick = this.hideView;
	},

	hideView : function()
	{
		$('help').hide();
		localStorage.setItem('help_closed', true);
	}
});

var Search = Class.create
({
	initialize : function()
	{

	},
	
	clear : function(tabArray)
	{
		//Focus the search box and remove it's value
		$('searchInput').focus();
		$('searchInput').value = '';
		//Hide the clear button
		$('searchClear').hide();
		//Show all tabs
		tabArray.each(function(tab) {
			tab.view.reference.show();
		});
		//Hide the no tabs matched notice
		$('noTabs').hide();
	},
	
	query : function(term, tabArray)
	{	
		//The term that must be matched
		var regex = new RegExp('(' + term + ')', 'gi');
		var tabCounter = 0;
	
		//Match against each tab
		tabArray.each(function(tab) {
			if(tab.title.match(regex) || tab.url.match(regex))
			{
				tab.showView();
				tabCounter++;
			}
			else
				tab.hideView();
		});
		
		//No tabs matched message
		if(tabCounter == 0)
			$('noTabs').show();
		else
			$('noTabs').hide();
	},
	
	searchInputKeydown : function(e, tabArray)
	{
		var term;

		if(e.keyCode == 8)
			term = $('searchInput').value.substring(0, $('searchInput').value.length - 1);
		else
			term = $('searchInput').value + String.fromCharCode(e.keyCode);
		
		if(term.length != 0)
		{
			$('searchClear').show();
			this.query(term, tabArray);
		}
		else
			this.clear();
	}
});

var Manager = Class.create
({
	initialize : function()
	{	
		this.help = new Help();
		this.search = new Search();

		this.tabArray = this.generateList();


		//User pressed a key in the search box
		$('searchInput').addEventListener('keydown', function(e) {
			this.search.searchInputKeydown(e, this.tabArray);
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
					e.preventDefault();
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
				$('tabs').appendChild(tabArray[tabs[i].id].view.reference);
			}
		});
		
		return tabArray;
	},
	
	closeTab : function(tabId)
	{
		//Remove the tab
		chrome.tabs.remove(tabId);
	
		//Remove the view
		this.tabArray[tabId].closeView();
	
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

window.onload = function() { var tabManager = new Manager(); }
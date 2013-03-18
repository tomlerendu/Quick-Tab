var tabArray = new Array();
/*
	tabArray is a list of tab objects, where each
	object has the properties:
	
	--------------------
	     tabObject
	--------------------
	+ id
	+ url
	+ title
	+ favicon
	+ viewReference
	- hideView
	- showView
	- closeView
*/

function tab(id, title, url, fav)
{
	//If there is no favicon for the page use the "blank" one
	if (fav == undefined || fav == "" || fav == "chrome://theme/IDR_EXTENSIONS_FAVICON") 
		fav = "images/blank.png";
	
	//Create the view and bind the mouse events to it
	var tabView = $(
		'<div class="tab">' +
			'<div class="favicon"><img src="' + fav + '" /></div>' +
			'<div class="title">' + title + '</div>' +
		'</div>'
	)
	.bind('mousedown', function(e) {
		if(e.which == 1)
			//Left click, switch to the tab
			switchTab(id);
		else if(e.which == 3)
		{
			//Right click, close the tab
			closeTab(id);
			e.preventDefault();
		}
	});
	
	
	//Create the properties
	this.id = id;
	this.title = title;
	this.url = url;
	this.fav = fav;
	this.viewReference = tabView;
	
	this.hideView = function()
	{
		$(this.viewReference).hide();
	};
	
	this.showView = function()
	{
		$(this.viewReference).show();
	};
	
	this.closeView = function()
	{
		$(this.viewReference).slideUp(100, function() {
			$(this.viewReference).remove();
		});
	}
}

$(document).ready(function() {

	//Shows help if it's a fresh install
	showHelp();
	
	//Creates the tab list
	generateList();
	
	//If something is typed in the search box
	$('#search > input').bind('keyup', function() {
		doSearch($(this).val());
	});
	
	//If the clear search box button is pressed
	$('#search > #clear').bind('mousedown', function() {
		clearSearch();
	});
	
	$('#help > button').bind('click', function() {
		hideHelp();
	});
});

function clearSearch()
{
	//Focus the search box and remove it's value
	$('#search > input').focus().val('');
	//Hide the clear button
	$('#clear').hide()
	//Show all tabs
	$('#tabs > .tab').show();
}

function doSearch(term)
{
	// TODO: this bit should be moved
	if(term == undefined || term == '')
		$('#clear').hide();
	else
		$('#clear').show();
		
	//The term that must be matched
	var regex = new RegExp('(' + term + ')', 'gi');
	var tabCounter = 0;
	
	//Match against each tab
	for(var i in tabArray)
	{
		if(tabArray[i].title.match(regex) || tabArray[i].url.match(regex))
		{
			tabArray[i].showView();
			tabCounter++;
		}
		else
			tabArray[i].hideView();
	}
	
	//No tabs matched message
	if(tabCounter == 0)
		$('#notabs').show()
	else
		$('#notabs').hide()
}

function switchTab(tabId)
{
	chrome.tabs.update(
		tabId,
		{selected: true}
	);
	
	//Close the browser action
	window.close();
}

function closeTab(tabId)
{
	//Remove the tab
	chrome.tabs.remove(tabId);
	
	//Remove the view
	tabArray[tabId].closeView();
	
	//Remove the tab from the tab list
	tabArray.splice(tabId, 1);
}

function generateList()
{
	chrome.tabs.getAllInWindow(null, function(tabs)
	{
		for(var i=0; i<tabs.length; i++)
		{
			//Create an object for each tab
			tabArray[tabs[i].id] = new tab(tabs[i].id, tabs[i].title, tabs[i].url, tabs[i].favIconUrl);
			//Add to the tabs view		
			$('#tabs').append(tabArray[tabs[i].id].viewReference);
		}
	});
}

function showHelp()
{
	if(localStorage['help_closed'] == undefined)
		$('#help').css('display', 'block');
}

function hideHelp()
{
	$('#help').css('display', 'none');
	localStorage['help_closed'] = true;
}
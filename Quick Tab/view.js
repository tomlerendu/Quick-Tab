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
	//Focus the search box and remove it's
	$('#search > input').focus().val('');
	//Hide the clear button
	$('#clear').css('display', 'none');
	//Show all tabs
	$('#tabs > .tab').css('display', 'block');
}

function doSearch(term)
{
	// TODO: this bit should be moved
	if(term == undefined || term == '') $('#clear').css('display', 'none');
	else $('#clear').css('display', 'block');
		
	//The term that must be matched
	var regex = new RegExp('(' + term + ')', 'gi');

	var tabCounter = 0;
	
	//Match against each tab
	$('#tabs > .tab').each(function() {
		if(!$(this).data('title').match(regex))
			$(this).css('display', 'none');
		else
		{
			$(this).css('display', 'block');
			tabCounter++;
		}
	});
	
	if(tabCounter == 0)
		$('#notabs').css('display', 'block');
	else
		$('#notabs').css('display', 'none');
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
	
	//Remove the tab from the list
	//TODO: optimise how this is done
	$('#tabs > .tab').each(function() {
		if($(this).data('id') == tabId)
		{
			$(this).slideUp(100, function() {
				$(this).remove();
			});
		}
			
	});
}

function generateTabView(id, title, url, fav)
{
	//If there is no favicon for the page use the "blank" one
	if (fav == undefined || fav == "") 
		fav = "images/blank.png";
	
	//Create the HTML and associate the tab ID and title with it		
	var tabView = $(
		'<div class="tab">' +
			'<div class="favicon"><img src="' + fav + '" /></div>' +
			'<div class="title">' + title + '</div>' +
		'</div>'
	)
	.data('id', id)
	.data('title', title);
	
	//Add to the tab list		
	$('#tabs').append(tabView);
}

function generateList()
{
	chrome.tabs.getAllInWindow(null, function(tabs)
	{
		//Create the HTML for each tab
		for(var i=0; i<tabs.length; i++)
			generateTabView(tabs[i].id, tabs[i].title, tabs[i].url, tabs[i].favIconUrl);
		
		//Mouse events for each tab
		$('#tabs').children()
		
			//Switch tab
			.bind('mousedown', function(e) {
				//Left mouse only
				if(e.which == 1)
					switchTab($(this).data('id'));
			})
			
			//Close tab
			.bind('contextmenu', function(e) {
				closeTab($(this).data('id'));
				e.preventDefault();
			});
	});
}

function showHelp()
{
	if(localStorage['help_closed'] == undefined)
	{
		$('#help').css('display', 'block');
	}
}

function hideHelp()
{
	$('#help').css('display', 'none');
	localStorage['help_closed'] = true;
}
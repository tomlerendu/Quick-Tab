$(document).ready(function()
{
	//Creates the tab list
	generateList();
	
	//If something is typed in the search box
	$('#search > input').bind('keyup', function() {
		doSearch($(this).val());
	});
	
	//If the clear search box button is pressed
	$('#search > #clear').bind('mousedown', function(){
		clearSearch();
	});
});

function clearSearch()
{
	//Focus the search box and remove it's
	$('#search > input').focus().val('');
	//Hide the clear button
	$('#clear').css('display','none');
}

function doSearch(term)
{
	// TODO: this bit should be moved
	if(term == undefined || term == '') $('#clear').css('display','none');
	else $('#clear').css('display','block');
	
	//The term that must be matched
	var regex = new RegExp('(' + term + ')', 'gi');
	
	//Match against each tab
	$('#tabs > .tab').foreach(function() {
		if($(this).data('title').match(regex))
		{
			
		} 
	});
}

function switchTab(tabId)
{
	chrome.tabs.update(
		tabId,
		{selected: true}
	);
	
	window.close();
}

function generateTabView(id, title, url, fav)
{
	if (fav == undefined || fav == "") 
		fav = "images/blank.png";
			
	var tabView = $(
		'<div class="tab">' +
			'<div class="favicon"><img src="' + fav + '" /></div>' +
			'<div class="title">' + title + '</div>' +
		'</div>'
	)
	.data('id', id)
	.data('title', title);
			
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
			.bind('mousedown', function() {
				switchTab($(this).data('id'));
			})
			//Close tab
			.bind('contextmenu', function() {
			
				chrome.tabs.remove($(this).data('id'));
				$(this).slideUp(100, function() {
					$(this).remove();
				});
				return false;
				
			});
	});
}
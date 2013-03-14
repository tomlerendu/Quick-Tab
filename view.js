window.onload = function()
{
	generateList();
}

function switchToTab(tabId)
{
	chrome.tabs.update(
		swichTabId,
		{selected: true}
	);
	
	window.close();
}

function closeTab(tabId)
{
	
}

function createTab(id, title, url, fav)
{
	
}

function generateList()
{
	chrome.tabs.getAllInWindow(null, function(tabs)
	{
		for(var i=0; i<tabs.length; i++)
		{
			createTab(tabs[i].id, tabs[i].title, tabs[i].url, tabs[i].favicon);
		}
	});
}
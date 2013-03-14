$(document).ready(function()
{
	generateList();
});

function switchToTab(tabId)
{
	chrome.tabs.update(
		tabId,
		{selected: true}
	);
	
	window.close();
}

function closeTab(tabId)
{
	
}

function generateList()
{
	chrome.tabs.getAllInWindow(null, function(tabs)
	{
		for(var i=0; i<tabs.length; i++)
		{
			var tabView = 
						$('<div class="tab"><div class="favicon"></div>'
						 +'<div class="title">'+tabs[i].title+'</div></div>')
						.data('id', tabs[i].id)
						.data('title', tabs[i].title)
						.data('url', tabs[i].url);
			
			$('#tabs').append(tabView);
		}
		
		$('#tabs').children().bind('click', function()
		{
			switchToTab($(this).data('id'));
		});
	});
}
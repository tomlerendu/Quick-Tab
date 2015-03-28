function Search()
{
    this.searchInputReference = document.querySelector('#searchInput');
    this.searchClearReference = document.querySelector('#searchClear');
    this.noTabsReference = document.querySelector('#noTabs');
}

Search.prototype.clear = function(tabArray)
{
    //Focus the search box and remove it's value
    this.searchInputReference.focus();
    this.searchInputReference.value = '';
    //Hide the clear button
    this.searchClearReference.classList.add('hidden');
    //Show all tabs
    for(var tab in tabArray)
        tabArray[tab].visible(true);
    //Hide the no tabs matched notice
    this.noTabsReference.classList.add('hidden');
};


Search.prototype.query = function(term, tabArray)
{
    //The term that must be matched
    var regex = new RegExp('(' + term + ')', 'gi');
    var tabCounter = 0;

    //Match against each tab
    for(var tab in tabArray) {
        if(tabArray[tab].title.match(regex) || tabArray[tab].url.match(regex)) {
            tabArray[tab].visible(true);
            tabCounter++;
        }
        else
            tabArray[tab].visible(false);
    }

    //No tabs matched message
    if(tabCounter == 0)
        this.noTabsReference.classList.remove('hidden');
    else
        this.noTabsReference.classList.add('hidden');
};

Search.prototype.searchInputKeydown = function(e, tabArray)
{
    if(!this.isValidSearchChar(e, 0))
        return;

    var term;

    if (e.keyCode == 13) {
        // enter
        var el = $$('.tab').find(function(el) { return el.visible(); });
        var tabId = parseInt(el.id.replace('tab-', ''));
        if (tabId) {
            chrome.tabs.update(tabId, {selected: true});
            window.close();
        }
        return;
    } else if (e.keyCode == 8) {
        term = this.searchInputReference.value.substring(0, this.searchInputReference.value.length - 1);
    }
    else {
        console.log(typeof String.fromCharCode(e.keyCode));
        term = this.searchInputReference.value.concat(String.fromCharCode(e.keyCode));
    }

    if(term.length != 0)
    {
        this.searchClearReference.classList.remove('hidden');
        this.query(term, tabArray);
    }
    else
        this.clear(tabArray);
};

Search.prototype.isValidSearchChar = function(e, modifier)
{
    //The key pressed event has key codes that are 32 higher than the key down event
    keyCode = e.keyCode - modifier;

    if(
        (keyCode >= 48 && keyCode <= 57) ||    //Numbers
        (keyCode >= 65 && keyCode <= 90) ||    //Alphabet
        (keyCode >= 96 && keyCode <= 105) ||   //Num keys
         keyCode == 32 ||					   //Space bar
         keyCode == 8  ||					   //Backspace
         keyCode == 13
    )
        return true;

    return false;
};
function Search(delegate)
{
    this.delegate = delegate;
    this.searchInputReference = document.querySelector('#searchInput');
    this.searchClearReference = document.querySelector('#searchClear');
    this.noTabsReference = document.querySelector('#noTabs');
}

Search.prototype.clear = function(tabArray)
{
    //Focus the search box and remove it's value
    this.searchInputReference.value = '';

    //Wait 0.5s before giving focus to the search box
    //to account for the mouse up event
    setTimeout(function() {
        this.searchInputReference.focus();
    }.bind(this), 500);

    //Hide the clear button
    this.searchClearReference.classList.add('hidden');
    //Show all tabs
    for(var i=0; i<tabArray.length; i++)
        tabArray[i].visible(true);
    //Hide the no tabs matched notice
    this.noTabsReference.classList.add('hidden');
};


Search.prototype.query = function(term, tabArray)
{
    //Remove unneeded spaces
    term = term.replace(/  +/g, " ");
    //allow searching for parts of expressions. Space is delimiter.
    term = term.split(" ").join(".*?");
    //The term that must be matched
    var regex = new RegExp('(' + term + ')', 'gi');
    var tabCounter = 0;

    //Match against each tab
    for(var i=0; i<tabArray.length; i++) {
        if(tabArray[i].title.match(regex) || tabArray[i].url.match(regex)) {
            tabArray[i].visible(true);
            tabCounter++;
        }
        else
            tabArray[i].visible(false);
    }

    //No tabs matched message
    if(tabCounter == 0) {
        this.noTabsReference.classList.remove('hidden');
    } else {
        this.noTabsReference.classList.add('hidden');
        this.delegate.selectFirstTab();
    }
};

Search.prototype.searchInputKeyup = function(e, tabArray)
{
    if(!this.isValidSearchChar(e, 0))
        return;

    var term = this.searchInputReference.value;

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
    keyCode = e.keyCode;

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
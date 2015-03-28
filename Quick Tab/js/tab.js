function Tab(id, title, url, favIcon)
{
    //If there is no favicon for the page use the "blank" one
    if (
        favIcon == undefined ||
        favIcon == "" ||
        favIcon == "chrome://theme/IDR_EXTENSIONS_FAVICON" ||
        favIcon == "chrome://theme/IDR_EXTENSIONS_FAVICON@2x"
    )
        favIcon = "images/blank.png";

    //Create the properties
    this.id = id;
    this.title = title;
    this.url = url;
    this.favIcon = favIcon;
    this.view = this.buildView();
}

Tab.prototype.buildView = function()
{
    var favImageView = document.createElement('img');
    favImageView.src = this.favIcon;

    var favView = document.createElement('div');
    favView.className = 'favicon';
    favView.appendChild(favImageView);

    var titleView = document.createElement('div');
    titleView.className = 'title';
    titleView.appendChild(document.createTextNode(this.title));

    var view = document.createElement('div');
    view.className = 'tab';
    view.id = 'tab-' + this.id;
    view.appendChild(favView);
    view.appendChild(titleView);

    return view;
};

Tab.prototype.visible = function(visible)
{
    if(visible)
        this.view.classList.remove('hidden');
    else
        this.view.classList.add('hidden');
};

Tab.prototype.close = function()
{
    this.view.parentNode.removeChild(this.view);
};

window.onload = function() {

    //Clicking the "Configure shortcut" button
    document.querySelector('#shortcutLink').addEventListener('click', function() {
        settings.openLink('chrome://extensions/configureCommands');
    });

    document.querySelector('#githubLink').addEventListener('click', function() {
        settings.openLink('https://github.com/tomlerendu/Quick-Tab/issues/new');
    });

    document.querySelector('.popupWidth').addEventListener('change', function(e) {
        localStorage['popup.width'] = e.target.value;
    });

    var settings = new Settings();
    settings.displayKeyboardShortcut();
    settings.setupWidthSlider();
};

function Settings()
{
    setInterval(this.displayKeyboardShortcut, 1000);
}

Settings.prototype.setupWidthSlider = function()
{
    var selected = localStorage['popup.width'];

    if (typeof localStorage['popup.width'] == 'undefined') {
        document.querySelector('.popupWidth').value = 2;
    } else {
        document.querySelector('.popupWidth').value = selected;
    }
};

Settings.prototype.displayKeyboardShortcut = function()
{
    chrome.commands.getAll(function(commands){

        var foundShortcut = false;

        for(command in commands) {
            if(commands[command]['name'] == '_execute_browser_action' && commands[command]['shortcut'] != '') {
                document.querySelector('#keyboardShortcut').innerText = commands[command]['shortcut'];
                foundShortcut = true;
                break;
            }
        }

        if (!foundShortcut) {
            document.querySelector('#keyboardShortcut').innerText = '[Not set]';
        }

    }.bind(this));
};


Settings.prototype.openLink = function(link)
{
    chrome.tabs.create({
        url: link
    });
};
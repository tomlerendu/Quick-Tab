window.onload = function() {

    //Clicking the "Configure shortcut" button
    document.querySelector('#shortcutLink').addEventListener('click', function() {
        settings.setKeyboardShortcut();
    });

};

function Settings()
{
    this.keyboardShortcut = null;

    setInterval(this.checkKeyboardShortcut, 1000);
}

Settings.prototype.checkKeyboardShortcut = function()
{
    var self = this;

    chrome.commands.getAll(function(commands){
        for(command in commands) {
            if(commands[command]['name'] == '_execute_browser_action') {
                self.keyboardShortcut = commands[command]['shortcut'];
                break;
            }
        }
    }.bind(this));
};

Settings.prototype.shouldShowHelp = function(version)
{
    return true;
};

Settings.prototype.getKeyboardShortcut = function()
{
    return this.keyboardShortcut;
};

Settings.prototype.setKeyboardShortcut = function()
{
    chrome.tabs.create({
        url: 'chrome://extensions/configureCommands'
    });
};

var settings = new Settings();
console.log(settings.getKeyboardShortcut());
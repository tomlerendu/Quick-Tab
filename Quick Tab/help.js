function Help()
{
    this.reference = document.querySelector('#help');
    this.buttonReference = document.querySelector('#helpButton');
}

Help.prototype.show = function()
{
    if(localStorage.getItem('help') == null) {
        this.reference.classList.remove('hidden');
        this.buttonReference.addEventListener('click', function(event) {
            this.hide();
        }.bind(this));
    }
};

Help.prototype.hide = function()
{
    this.reference.classList.add('hidden');
    localStorage.setItem('help', true);
};
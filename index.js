var crel = require('crel'),
    DefaultStyle = require('default-style'),
    EventEmitter = require('events').EventEmitter,
    style = new DefaultStyle('.rating.empty .item {color: gray;} .rating .item {font-size: 1.5em; color: gold;} .rating .item:after {content: "\\2605";} .rating .item.selected ~ .item { color: gray; }'),
    matches;

function closest(target, query){
    if(!matches){
        matches = target.matches ||
            target.matchesSelector ||
            target.webkitMatchesSelector ||
            target.mozMatchesSelector ||
            target.msMatchesSelector ||
            function(){
                throw 'This browser does not support Element.matches()';
            };
    }

    while(
        target &&
        target.ownerDocument &&
        !matches.call(target, query)
    ){
        target = target.parentNode;
    }

    return (target !== window.document && matches.call(target, query)) ? target : null;
}

function Rating(options) {
    this._items = [1, 2, 3, 4, 5];
    this._renderedItems = [];

    if(!options){
        options = {};
    }

    this.element = options.element;
    this.itemsElement = options.itemsElement;
    this.itemTemplate = options.itemTemplate;

    if(options.items != null){
        this._items = options.items;
    }

    if(options.value != null){
        this._currentIndex = this._items.indexOf(options.value);
    }

    if (options.removeDefaultStyle === true) {
        style.remove();
    }

    this._render();

    if(options.enabled != null){
        this.enabled(options.enabled);
    }
}


Rating.prototype = Object.create(EventEmitter.prototype);
Rating.prototype.constructor = Rating;

Rating.prototype._enabled = true;
Rating.prototype.enabled = function(value){
    if(!arguments.length){
        return this._enabled;
    }

    this._enabled = value;
    return this;
};

Rating.prototype._value = null;
Rating.prototype.value = function(value){
    if(!arguments.length){
        return this._value;
    }

    var index = this._items.indexOf(value);

    if((value !== null && index === -1) || index === this._currentIndex){
        return this;
    }

    return this._selectedIndex(index);
};

Rating.prototype.items = function(value){
    if(!arguments.length){
        return this._items.slice();
    }

    if(!Array.isArray(value)){
        throw 'items must be an array';
    }

    this._removeRenderedItems();
    this._items = value.slice();
    this._renderItems();
    this._update();
    this.emit('items', value);
    return this;
};


Rating.prototype._currentIndex = -1;
Rating.prototype._selectedIndex = function(value){
    if(!arguments.length){
        return this._currentIndex;
    }

    if(value === this._currentIndex){
        return this;
    }

    this._currentIndex = value;
    this._update();
    return this;
};

Rating.prototype._disableRenderedElement = function() {
    this.itemsElement.setAttribute('disabled', 'disabled');
};

Rating.prototype._enableRenderedElement = function() {
    this.itemsElement.removeAttribute('disabled');
};

Rating.prototype._update = function() {
    this._value = this._items[this._currentIndex];

    if(this._enabled){
        this._enableRenderedElement();
    } else {
        this._disableRenderedElement();
    }

    if(this._selectedElement){
        this._selectedElement.classList.remove('selected');
    }

    if(this._currentIndex === -1){
        this._setAsEmpty();
    } else {
        this._setHasValue();
    }

    this._selectedElement = this._renderedItems[this._currentIndex];

    if(this._selectedElement){
        this._selectedElement.classList.add('selected');
    }

    this.emit('value', this._value);
};

Rating.prototype._appendRenderedItem = function(item) {
    crel(this.itemsElement, item);
};

Rating.prototype._removeRenderedItems = function() {
    while(this._renderedItems.length){
        this._removeRenderedItem(this._renderedItems.pop());
    }
};

Rating.prototype._removeRenderedItem = function(item) {
    this.itemsElement.removeChild(item);
};

Rating.prototype._renderItem = function() {
    return this.itemTemplate.cloneNode(true);
};

Rating.prototype._renderItems = function() {
    var items = this.items();

    for (var i = 0; i < items.length; i++) {
        var item = this._renderItem(i);
        this._appendRenderedItem(item);
        this._renderedItems.push(item);
    }
};

Rating.prototype._click = function(event){
    if(!this._enabled){
        return;
    }

    var item = closest(event.target, '.rating .item');

    if(item){
        this._selectedIndex(this._renderedItems.indexOf(item));
    }
};

Rating.prototype._bindEvents = function() {
    this._clickHandeler = this._click.bind(this);

    this.itemsElement.addEventListener('click', this._clickHandeler);
};

Rating.prototype._debind = function() {
    this.itemsElement.removeEventListener('click', this._clickHandeler);
};

Rating.prototype.destroy = function(){
    this._debind();
    this.emit('destroy');
};

Rating.prototype._setAsEmpty = function() {
    this.itemsElement.classList.add('empty');
};

Rating.prototype._setHasValue = function() {
    this.itemsElement.classList.remove('empty');
};

Rating.prototype._render = function() {
    if(!this.element){
        this.element = crel('span', {class: 'rating'});
    }

    if(!this.itemsElement){
        this.itemsElement = this.element;
    }

    this._setAsEmpty();

    if(!this.itemTemplate){
        this.itemTemplate = crel('span', {class: 'item', });
    }

    this._renderItems();

    this._bindEvents();

    this._update();
};

module.exports = Rating;
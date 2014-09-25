# rating-control

A simple rating control

Basic demo [here](http://requirebin.com/?gist=0275fc20dc656815d94d)

Complex demo [here](http://requirebin.com/?gist=ec110b224eb87dc1a47c)

## Installation

    npm i rating-control

## Usage

    var Rating = require('rating-control');
        rating = new Rating();

    window.document.body.appendChild(rating.element);


## Constuctor Options

The constructor can take an options object that can have the following properties

    {
        element,   // top level element to insert itemsElement into
        itemsElement,   // element to insert the actual items into
        itemTemplate,   // template element to be cloned for each item
        items,   // array of item values to be represented
        value,   // starting value
        enabled,   // enabled state
        removeDefaultStyle   // do not include the default styling of the control
    }


## API

### Value

The current value of the control

#### get

    rating.value(); // gets the value

#### set

    rating.value(123); // sets the value to 123

#### event

    rating.on('value', function(value){
        // triggered when the value changes
        // parameter `value` is the updated value
    });


### Items

The array of item values to be represented

#### get

    rating.items(); // gets the items array

#### set

    rating.items([1, 2, 3]); // sets the items array to [1, 2, 3]

#### event

    rating.on('items', function(items){
        // triggered when the items array changes
        // parameter `items` is the updated items
    });


### Enabled

Can the value be changed by a click event (programmatic access still works)

#### get

    rating.enabled(); // gets the enabled state

#### set

    rating.enabled(false); // sets the enabled state to false

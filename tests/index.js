var Rating = require('rating-control'),
    crel = require('crel');

function setupLog(control){
    control.on('value', function(){
        console.log(arguments);
    });
}




var rating = new Rating();
window.document.body.appendChild(rating.element);
setupLog(rating);




var rating2 = new Rating({
    value:'apple',
    items: ['banana', 'apple', 'orange'],
    itemTemplate: crel('div', {class: 'item'}, crel('div'), crel('div')),
    element: crel('div', {class: 'rating foo'})
});

window.document.body.appendChild(rating2.element);
setupLog(rating2);



var rating3Template = crel('div', {class: 'item'}, crel('div'), crel('div')),
    rating3ItemsElement,
    rating3Element = crel('div', {class: 'rating bar'},
        crel('section',
            rating3ItemsElement = crel('div')
        )
    );

window.document.body.appendChild(rating3Element);

var rating3 = new Rating({
    value:'apple',
    items: ['banana', 'apple', 'orange'],
    itemTemplate: rating3Template,
    itemsElement: rating3ItemsElement,
    element: rating3Element
});

setupLog(rating3);
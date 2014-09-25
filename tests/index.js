var Rating = require('../'),
    rating = new Rating({readOnly: true, value: 3});

window.rating = rating;

window.document.body.appendChild(rating.element);


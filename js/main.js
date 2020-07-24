'use strict';

var pinParams = {
    PIN_SIZE_WIDTH: 50,
    PIN_SIZE_HEIGHT: 70,

    MAIN_SIZE_WIDTH: 65,
    MAIN_SIZE_HEIGHT: 84,

    LIMIT: 8,

    MIN_Y: 130,
    MAX_Y: 630
};

var offerOptions = {
    TITLE: [
        'Первый заголовок',
        'Второй заголовок',
        'Третий заголовок',
        'Четвертый заголовок'
    ],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    ROOM_TYPE: ['palace', 'flat', 'house', 'bungalo'],
    CHECKIN: ['12:00', '13:00', '14:00'],
    CHECKOUT: ['12:00', '13:00', '14:00'],
    DESRIPTION: [
        'Первое описание',
        'Второе описание',
        'Третье описание',
        'Четвертое писание'
    ],
    PHOTOS: [
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ]
};

var offerTypeTranslation = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
};

var
    rooms = ['комната', 'комнаты', 'комнат'],
    guests = ['гостя', 'гостей', 'гостей'];

var cardFilter = document.querySelector('.map__filters-container');

var mapPinMain = document.querySelector('.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card');
var mapMain = document.querySelector('.map');
var faded = mapMain.classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var pins = [];

/**
 * получаю случайное число
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * перемешиваю массив и получаю случайное количество элементов из него
 * @param {array} arr исходный массив
 * @returns {array}
 */
function shuffleArray(arr) {
    var j;
    var temp;

    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr.slice(0, getRandomNumber(0, (arr.length + 1)));
}

/**
 * получаю случайный элемент из массива
 * @param {array} arr - обрабатываемый массив
 * @return {any} - полученный элемент массива
 */
function getRandomElement(arr) {
    var arrayElement = Math.floor(Math.random() * arr.length);

    return arr[arrayElement];
}

/**
 * склонение слов
 * @param {number} num - число, в зависимости от которого будем склонять
 * @param {array} expressions - массив
 * @return {string}
 */
function declension(num, expressions) {
    var result;
    var count = num % 100;
    if (count >= 5 && count <= 20) {
        result = expressions['2'];
    } else {
        count = count % 10;
        if (count === 1) {
            result = expressions['0'];
        } else if (count >= 2 && count <= 4) {
            result = expressions['1'];
        } else {
            result = expressions['2'];
        }
    }
    return result;
}

function getRandomOffer() {
    for (var i = 0; i < pinParams.LIMIT; i++) {
        var
            locationX = getRandomNumber(0 + pinParams.PIN_SIZE_WIDTH, mapMain.clientWidth - pinParams.PIN_SIZE_WIDTH),
            locationY = getRandomNumber(pinParams.MIN_Y, pinParams.MAX_Y);

        var offer = {
            author: {
                avatar: 'img/avatars/user0' + (i + 1) + '.png'
            },

            offer: {
                title: 'Заголовок предложения',
                adress: '600, 350',
                price: 1,
                type: getRandomElement(offerOptions.ROOM_TYPE),
                rooms: getRandomNumber(1, 4),
                guests: getRandomNumber(1, 4),
                checkin: getRandomElement(offerOptions.CHECKIN),
                checkout: getRandomElement(offerOptions.CHECKOUT),
                features: shuffleArray(offerOptions.FEATURES),
                description: getRandomElement(offerOptions.DESRIPTION),
                photos: shuffleArray(offerOptions.PHOTOS)
            },

            location: {
                x: locationX,
                y: locationY
            }
        };

        pins.push(offer);
    }

    return pins;
}

function createOffer(offer) {
    var
        offerPin = mapPinTemplate.cloneNode(true),
        image = offerPin.querySelector('img');

    offerPin.style.left = (offer.location.x - pinParams.PIN_SIZE_WIDTH / 2) + 'px';
    offerPin.style.top = (offer.location.y - pinParams.PIN_SIZE_HEIGHT) + 'px';
    image.src = offer.author.avatar;
    image.alt = offer.offer.title;


    renderCard(offer);
    return offerPin;
}

function createPins() {
    var
        pinsFragment = document.createDocumentFragment(),
        offer;

    getRandomOffer();

    pins.forEach(el => {
        offer = createOffer(el);
        pinsFragment.appendChild(offer);
    });

    return pinsFragment;
}

/**
 * создаю отображение удобств
 * @param {array} features - массив со всеми видами удобств
 * @return {node}
 */
function createFeatures(features) {
    var featuresFragment = document.createDocumentFragment();
    var featuresElement;

    for (var q = 0; q < features.length; q++) {
        featuresElement = document.createElement('li');
        featuresElement.className = 'popup__feature popup__feature--' + features[q];

        featuresFragment.appendChild(featuresElement);
    }

    return featuresFragment;
}

/**
 * создаю отображение фотографий отеля
 * @param {array} photos - массив со всеми фотографиями
 * @return {node}
 */
function createPhotos(photos) {
    var photosFragment = document.createDocumentFragment();
    var photosTemplate;
    var photosElement;
    var photoImg;

    for (var w = 0; w < photos.length; w++) {
        photosTemplate = cardTemplate.content.querySelector('.popup__photos');
        photosElement = photosTemplate.cloneNode(true);
        photoImg = photosElement.querySelector('img');

        photoImg.src = photos[w];
        photoImg.width = 45;
        photoImg.height = 40;
        photoImg.alt = 'offer image';

        photosFragment.appendChild(photosElement);
    }

    return photosFragment;
}

function renderCard(card) {
    var
        cardFragment = document.createDocumentFragment(),
        cardElement = cardTemplate.content.querySelector('.map__card').cloneNode(true);

    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = offerTypeTranslation[card.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' ' + declension(card.offer.rooms, rooms) + ' для ' + card.offer.guests + ' ' + declension(card.offer.guests, guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = card.offer.description;
    cardElement.querySelector('.popup__features').innerHTML = '';
    cardElement.querySelector('.popup__features').appendChild(createFeatures(card.offer.features));
    cardElement.querySelector('.popup__photos').innerHTML = '';
    cardElement.querySelector('.popup__photos').appendChild(createPhotos(card.offer.photos));

    cardFragment.appendChild(cardElement);
    mapMain.insertBefore(cardFragment, cardFilter);

    return cardElement;
}

mapPins.appendChild(createPins());

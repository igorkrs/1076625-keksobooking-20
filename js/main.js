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

var OFFER_PRICE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
};

var
    rooms = ['комната', 'комнаты', 'комнат'],
    guests = ['гостя', 'гостей', 'гостей'];

var Keycode = {
    ENTER: 13,
    ESC: 27
};

var cardFilter = document.querySelector('.map__filters-container');

var mapPinMain = document.querySelector('.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card');
var mapMain = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pins = [];

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormRoomsNumber = adForm.querySelector('#room_number');
var adFormGuestsNumber = adForm.querySelector('#capacity');
var guestsOptions = adFormGuestsNumber.querySelectorAll('option');
var adFormTitle = adForm.querySelector('#title');
var adFormTimeIn = adForm.querySelector('#timein');
var adFormTimeOut = adForm.querySelector('#timeout');
var adFormPrice = adForm.querySelector('#price');
var adFormType = adForm.querySelector('#type');
var resetButton = adForm.querySelector('.ad-form__reset');
var mapFilters = document.querySelector('.map__filters');
var mapFiltersSelect = mapFilters.querySelectorAll('select');
var mapFiltersFeatures = mapFilters.querySelectorAll('input');

var isFirstLoad = true;
var isActivate = false;

var addressInput = adForm.querySelector('#address');
adForm.querySelector('#address').setAttribute('readonly', 'readonly');
var adFormTimeContainer = adForm.querySelector('.ad-form__element--time');

var guestsParams = {
    ANY: guestsOptions[0],
    ONE_GUEST: guestsOptions[1],
    TWO_GUESTS: guestsOptions[2],
    NOT_FOR_GUESTS: guestsOptions[3],
};
var guestsIndex = {
    ONE: 2,
    NO_ONE: 3
};

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
    var
        result,
        count = num % 100;

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
    var
        featuresFragment = document.createDocumentFragment(),
        featuresElement;

    features.forEach(element => {
        featuresElement = document.createElement('li');
        featuresElement.className = 'popup__feature popup__feature--' + element;

        featuresFragment.appendChild(featuresElement);
    });

    return featuresFragment;
}

/**
 * создаю отображение фотографий отеля
 * @param {array} photos - массив со всеми фотографиями
 * @return {node}
 */
function createPhotos(photos) {
    var
        photosFragment = document.createDocumentFragment(),
        photosTemplate,
        photosElement,
        photoImg;

    photos.forEach(el => {
        photosTemplate = cardTemplate.content.querySelector('.popup__photos');
        photosElement = photosTemplate.cloneNode(true);
        photoImg = photosElement.querySelector('img');

        photoImg.src = el;
        photoImg.width = 45;
        photoImg.height = 40;
        photoImg.alt = 'offer image';

        photosFragment.appendChild(photosElement);
    });

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

/**
 * устанавливаю элементам массива атрибут disabled
 * @param {node} elem - элемент массива
 */
function setDisableAttribute(elem) {
    elem.setAttribute('disabled', 'disabled');
}

function removeDisableAttribute(elem) {
    elem.removeAttribute('disabled');
}

adFormFieldsets.forEach(setDisableAttribute);
mapFiltersSelect.forEach(setDisableAttribute);
mapFiltersFeatures.forEach(setDisableAttribute);

function activatePage() {
    mapMain.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(removeDisableAttribute);
    mapFiltersSelect.forEach(removeDisableAttribute);
    mapFiltersFeatures.forEach(removeDisableAttribute);
}

function enablePageByMouse() {
    if (isFirstLoad ? !isActivate : !isActivate) {
        if (isFirstLoad) {
            isFirstLoad = false;
            mapPins.appendChild(createPins());
        }
        isActivate = true;
        activatePage();
    }

    writeAddress();
}

function enablePageByKey(evt) {
    if (isFirstLoad ? !isActivate : !isActivate) {
        if (isFirstLoad) {
            isFirstLoad = false;
            mapPins.appendChild(createPins());
        }

        if (evt.keyCode === Keycode.ENTER) {
            isActivate = true;
            activatePage();
        }
    }

    writeAddress();
}

function writeInactiveAdress() {
    addressInput.value = Math.round(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.round(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2);
}

function writeAddress() {
    addressInput.value = Math.round(mapPinMain.offsetLeft + pinParams.MAIN_SIZE_WIDTH / 2) + ', ' + Math.round(mapPinMain.offsetTop + pinParams.MAIN_SIZE_HEIGHT);
}

adFormTitle.addEventListener('invalid', function () {
    if (adFormTitle.validity.tooShort) {
        adFormTitle.setCustomValidity('Минимальная длина — 30 символов.');
    } else if (adFormTitle.validity.tooLong) {
        adFormTitle.setCustomValidity('Максимальная длина — 100 символов.');
    } else if (adFormTitle.validity.valueMissing) {
        adFormTitle.setCustomValidity('Обязательное текстовое поле.');
    } else {
        adFormTitle.setCustomValidity('');
    }
});

adFormPrice.placeholder = OFFER_PRICE.flat;

function setTypeOrPrice() {
    var typeValue = adFormType.value;
    var priceValue = adFormPrice.value;

    switch (typeValue) {
        case 'bungalo':
            adFormPrice.placeholder = OFFER_PRICE.bungalo;
            if (OFFER_PRICE.bungalo > priceValue) {
                adFormPrice.setCustomValidity('Минимальная цена за ночь 0');
            } else {
                adFormPrice.setCustomValidity('');
            }
            break;
        case 'flat':
            adFormPrice.placeholder = OFFER_PRICE.flat;
            if (OFFER_PRICE.flat > priceValue) {
                adFormPrice.setCustomValidity('Минимальная цена за ночь 1 000');
            } else {
                adFormPrice.setCustomValidity('');
            }
            break;
        case 'house':
            adFormPrice.placeholder = OFFER_PRICE.house;
            if (OFFER_PRICE.house > priceValue) {
                adFormPrice.setCustomValidity('Минимальная цена 5 000');
            } else {
                adFormPrice.setCustomValidity('');
            }
            break;
        case 'palace':
            adFormPrice.placeholder = OFFER_PRICE.palace;
            if (OFFER_PRICE.palace > priceValue) {
                adFormPrice.setCustomValidity('Минимальная цена 10 000');
            } else {
                adFormPrice.setCustomValidity('');
            }
            break;
    }
}

adFormTimeContainer.addEventListener('change', function (evt) {
    var targetValue = evt.target.value;

    switch (targetValue) {
        case adFormTimeIn.value:
            adFormTimeOut.value = adFormTimeIn.value;
            break;
        case adFormTimeOut.value:
            adFormTimeIn.value = adFormTimeOut.value;
            break;
    }
});

function setDefaultRoomsStatus() {
    adFormGuestsNumber.selectedIndex = guestsIndex.ONE;
    guestsParams.ANY.disabled = true;
    guestsParams.ONE_GUEST.disabled = true;
    guestsParams.TWO_GUESTS.disabled = false;
    guestsParams.NOT_FOR_GUESTS.disabled = true;
}

setDefaultRoomsStatus();

adFormRoomsNumber.addEventListener('change', function () {
    var roomsNumber = adFormRoomsNumber.value;

    switch (roomsNumber) {
        case '1':
            adFormGuestsNumber.selectedIndex = guestsIndex.ONE;
            guestsParams.ANY.disabled = true;
            guestsParams.ONE_GUEST.disabled = true;
            guestsParams.TWO_GUESTS.disabled = false;
            guestsParams.NOT_FOR_GUESTS.disabled = true;
            break;
        case '2':
            adFormGuestsNumber.selectedIndex = guestsIndex.ONE;
            guestsParams.ANY.disabled = true;
            guestsParams.ONE_GUEST.disabled = false;
            guestsParams.TWO_GUESTS.disabled = false;
            guestsParams.NOT_FOR_GUESTS.disabled = true;
            break;
        case '3':
            adFormGuestsNumber.selectedIndex = guestsIndex.ONE;
            guestsParams.ANY.disabled = false;
            guestsParams.ONE_GUEST.disabled = false;
            guestsParams.TWO_GUESTS.disabled = false;
            guestsParams.NOT_FOR_GUESTS.disabled = true;
            break;
        default:
            adFormGuestsNumber.selectedIndex = guestsIndex.NO_ONE;
            guestsParams.ANY.disabled = true;
            guestsParams.ONE_GUEST.disabled = true;
            guestsParams.TWO_GUESTS.disabled = true;
            guestsParams.NOT_FOR_GUESTS.disabled = false;
    }
});

adFormType.addEventListener('change', setTypeOrPrice);
adFormPrice.addEventListener('change', setTypeOrPrice);

mapPinMain.addEventListener('mousedown', enablePageByMouse);
mapPinMain.addEventListener('keydown', enablePageByKey);
writeInactiveAdress();

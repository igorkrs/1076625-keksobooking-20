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

var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapMain = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pins = [];
mapMain.classList.remove('map--faded');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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

function getRandomElement(arr) {
  var arrayElement = Math.floor(Math.random() * arr.length);

  return arr[arrayElement];
}

function getRandomOffer() {
  for (var i = 0; i < pinParams.LIMIT; i++) {
    var
      locationX = getRandomNumber(0 + pinParams.PIN_SIZE_WIDTH, mapMain.clientWidth - pinParams.PIN_SIZE_WIDTH);
    var locationY = getRandomNumber(pinParams.MIN_Y, pinParams.MAX_Y);

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
    offerPin = mapPinTemplate.cloneNode(true);
  var image = offerPin.querySelector('img');

  offerPin.style.left = (offer.location.x - pinParams.PIN_SIZE_WIDTH / 2) + 'px';
  offerPin.style.top = (offer.location.y - pinParams.PIN_SIZE_HEIGHT) + 'px';
  image.src = offer.author.avatar;
  image.alt = offer.offer.title;

  return offerPin;
}

function createPins() {
  var
    pinsFragment = document.createDocumentFragment();
  var offer;

  getRandomOffer();

  pins.forEach(function (el) {
    offer = createOffer(el);
    pinsFragment.appendChild(offer);
  });

  return pinsFragment;
}

mapPins.appendChild(createPins());

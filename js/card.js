'use strict';

(function () {
    var
        Keycode = {
            ENTER: 13,
            ESC: 27
        },

        offerOptions = {
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
        },

        rooms = ['комната', 'комнаты', 'комнат'],
        guests = ['гостя', 'гостей', 'гостей'],
        cardFilter = document.querySelector('.map__filters-container'),
        cardTemplate = document.querySelector('#card'),

        offerTypeTranslation = {
            'flat': 'Квартира',
            'bungalo': 'Бунгало',
            'house': 'Дом',
            'palace': 'Дворец'
        };

    function getRandomOffer() {
        for (var i = 0; i < window.pin.pinParams.LIMIT; i++) {
            var
                locationX = window.utils.getRandomNumber(0 + window.pin.pinParams.PIN_SIZE_WIDTH, window.map.mapMain.clientWidth - window.pin.pinParams.PIN_SIZE_WIDTH),
                locationY = window.utils.getRandomNumber(window.pin.pinParams.MIN_Y, window.pin.pinParams.MAX_Y);

            var offer = {
                author: {
                    avatar: 'img/avatars/user0' + (i + 1) + '.png'
                },

                offer: {
                    title: 'Заголовок предложения',
                    adress: '600, 350',
                    price: window.utils.getRandomNumber(1, 5000),
                    type: window.utils.getRandomElement(offerOptions.ROOM_TYPE),
                    rooms: window.utils.getRandomNumber(1, 4),
                    guests: window.utils.getRandomNumber(1, 4),
                    checkin: window.utils.getRandomElement(offerOptions.CHECKIN),
                    checkout: window.utils.getRandomElement(offerOptions.CHECKOUT),
                    features: window.utils.shuffleArray(offerOptions.FEATURES),
                    description: window.utils.getRandomElement(offerOptions.DESRIPTION),
                    photos: window.utils.shuffleArray(offerOptions.PHOTOS)
                },

                location: {
                    x: locationX,
                    y: locationY
                }
            };

            window.pin.pins.push(offer);
        }

        return window.pin.pins;
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

    function removeCard() {
        var mapCard = document.querySelector('.map__card');

        if (mapCard) {
            mapCard.remove();
        }
    }

    function onEscDown(evt, func) {
        if (evt.keyCode === Keycode.ESC) {
            func(evt);
        }
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
        cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' ' + window.utils.declension(card.offer.rooms, rooms) + ' для ' + card.offer.guests + ' ' + window.utils.declension(card.offer.guests, guests);
        cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
        cardElement.querySelector('.popup__description').textContent = card.offer.description;
        cardElement.querySelector('.popup__features').innerHTML = '';
        cardElement.querySelector('.popup__features').appendChild(createFeatures(card.offer.features));
        cardElement.querySelector('.popup__photos').innerHTML = '';
        cardElement.querySelector('.popup__photos').appendChild(createPhotos(card.offer.photos));

        var closeCardButton = cardElement.querySelector('.popup__close');

        function closeCard() {
            cardElement.remove();

            closeCardButton.addEventListener('click', closeCard);
            document.removeEventListener('keydown', onCardEsc);
        }

        function onCardEsc(evt) {
            onEscDown(evt, closeCard);
        }

        // закрытие карточки по клику
        closeCardButton.addEventListener('click', closeCard);
        // закрытие карточки по нажатию ESC
        document.addEventListener('keydown', onCardEsc);

        cardFragment.appendChild(cardElement);
        window.map.mapMain.insertBefore(cardFragment, cardFilter);

        return cardElement;
    }

    window.card = {
        Keycode: Keycode,
        getRandomOffer: getRandomOffer,
        renderCard: renderCard,
        removeCard: removeCard
    };
})();

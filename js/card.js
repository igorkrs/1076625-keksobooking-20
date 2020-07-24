'use strict';

(function () {
    var
        Keycode = {
            ENTER: 13,
            ESC: 27
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
        onEscDown: onEscDown,
        renderCard: renderCard,
        removeCard: removeCard
    };
})();

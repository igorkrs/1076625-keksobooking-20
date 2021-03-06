'use strict';

(function () {
  var Keycode = {
    ENTER: 13,
    ESC: 27
  };

  var rooms = ['комната', 'комнаты', 'комнат'];
  var guests = ['гостя', 'гостей', 'гостей'];
  var cardFilter = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card');

  // перевод названий типа жилья
  var OfferTypeTranslation = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  /**
   * создание отображения удобств
   * @param {array} features массив со всеми видами удобств
   * @return {node}
   */
  function createFeatures(features) {
    var featuresFragment = document.createDocumentFragment();
    var featuresElement;

    features.forEach(function (element) {
      featuresElement = document.createElement('li');
      featuresElement.className = 'popup__feature popup__feature--' + element;

      featuresFragment.appendChild(featuresElement);
    });

    return featuresFragment;
  }

  /**
   * создание отображения фотографий отеля
   * @param {array} photos массив со всеми фотографиями
   * @return {node}
   */
  function createPhotos(photos) {
    var photosFragment = document.createDocumentFragment();
    var photosTemplate;
    var photosElement;
    var photoImg;

    photos.forEach(function (el) {
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

  /**
   * удаление карточки подробной информации
   */
  function removeOffer() {
    var mapCard = document.querySelector('.map__card');

    if (mapCard) {
      mapCard.remove();
    }
  }

  /**
   * функция, которая будет происходить при нажатии на ESC
   * @param {Object} evt
   * @param {any} func
   */
  function onEscDown(evt, func) {
    if (evt.keyCode === Keycode.ESC) {
      func(evt);
    }
  }

  /**
   * отображение карточки подробной информации
   * @param {Object} card
   * @return {node}
   */
  function renderOffer(card) {
    var cardFragmentElement = document.createDocumentFragment();
    var cardElement = cardTemplate.content.querySelector('.map__card').cloneNode(true);

    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = OfferTypeTranslation[card.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' ' + window.utils.declension(card.offer.rooms, rooms) + ' для ' + card.offer.guests + ' ' + window.utils.declension(card.offer.guests, guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = card.offer.description;
    cardElement.querySelector('.popup__features').innerHTML = '';
    cardElement.querySelector('.popup__features').appendChild(createFeatures(card.offer.features));
    cardElement.querySelector('.popup__photos').innerHTML = '';
    cardElement.querySelector('.popup__photos').appendChild(createPhotos(card.offer.photos));

    var closeCardButtonElement = cardElement.querySelector('.popup__close');

    /**
     * закрытие карточки подробной информации
     */
    function closeOffer() {
      cardElement.remove();
      window.pin.removeActiveClass(cardElement);

      // по клику
      closeCardButtonElement.addEventListener('click', closeOffer);
      // при нажатии на ESC
      document.removeEventListener('keydown', onCardEsc);
    }

    /**
     * закрытие катрочки подробной информации по нажанию на ESC
     * @param {Object} evt
     */
    function onCardEsc(evt) {
      onEscDown(evt, closeOffer);
    }

    // закрытие карточки по клику
    closeCardButtonElement.addEventListener('click', closeOffer);
    // закрытие карточки по нажатию ESC
    document.addEventListener('keydown', onCardEsc);

    cardFragmentElement.appendChild(cardElement);
    window.map.mapMain.insertBefore(cardFragmentElement, cardFilter);

    return cardElement;
  }

  window.card = {
    Keycode: Keycode,
    onEscDown: onEscDown,
    renderOffer: renderOffer,
    removeOffer: removeOffer
  };
})();

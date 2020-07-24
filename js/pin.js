'use strict';

(function() {
  var
    pinParams = {
      // размер метки доступного предложения
      PIN_SIZE_WIDTH: 50,
      PIN_SIZE_HEIGHT: 70,

      // размер перемещаемой метки
      MAIN_SIZE_WIDTH: 65,
      MAIN_SIZE_HEIGHT: 84,

      // минимальная координата по Y
      MIN_Y: 130,
      // максимальная координата по Y
      MAX_Y: 630
    },

    mapPinMain = document.querySelector('.map__pin--main'),
    mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  /**
   * создание меток
   * @param {array} data
   */
  function createPins(data) {
    var
      pinsFragment = document.createDocumentFragment(),
      offer;

    data.forEach(function(el) {
      offer = createOffer(el);
      pinsFragment.appendChild(offer);
    });

    return pinsFragment;
  }

  /**
   * создание копий метки
   * @param {array} data
   */
  function createOffer(data) {
    var
      offerPin = mapPinTemplate.cloneNode(true),
      image = offerPin.querySelector('img');

    offerPin.style.left = (data.location.x - window.pin.pinParams.PIN_SIZE_WIDTH / 2) + 'px';
    offerPin.style.top = (data.location.y - window.pin.pinParams.PIN_SIZE_HEIGHT) + 'px';
    image.src = data.author.avatar;
    image.alt = data.offer.title;

    /**
     * открытие подробной информации при нажатии на метку
     */
    function onPinClick() {
      var mapCard = document.querySelector('.map__card');

      if (mapCard) {
        mapCard.remove();
      }

      window.card.renderCard(data);
    }

    offerPin.addEventListener('click', onPinClick);

    return offerPin;
  }

  /**
   * удаление активного класса у меток
   * @param {HTMLElement} pin
   */
  function removePinActiveClass(pin) {
    var pins = document.querySelectorAll('.map__pin[type="button"]');

    pins.forEach(function(elem) {
      elem.classList.remove('map__pin--active');
    });

    pin.classList.add('map__pin--active');
  }

  window.pin = {
    pinParams: pinParams,
    mapPinMain: mapPinMain,
    removePinActiveClass: removePinActiveClass,
    createOffer: createOffer,
    createPins: createPins
  };
})();

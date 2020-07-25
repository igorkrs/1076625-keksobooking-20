'use strict';

(function () {
  // минимальные цены за тип жилья
  var OfferPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  // место, где находится перетаскиваемая метка по дефолту
  var PinDefault = {
    X: 570,
    Y: 375
  };

  var ad = document.querySelector('.ad-form');
  var adFieldsets = ad.querySelectorAll('fieldset');
  var adFormRoomsNumber = ad.querySelector('#room_number');
  var adFormGuestsNumber = ad.querySelector('#capacity');
  var guestsOptions = adFormGuestsNumber.querySelectorAll('option');
  var adFormTitle = ad.querySelector('#title');
  var adFormTimeIn = ad.querySelector('#timein');
  var adFormTimeOut = ad.querySelector('#timeout');
  var adFormPrice = ad.querySelector('#price');
  var adFormType = ad.querySelector('#type');
  var adFormTimeContainer = ad.querySelector('.ad-form__element--time');
  var addressInput = ad.querySelector('#address');
  var resetButton = ad.querySelector('.ad-form__reset');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersFeatures = mapFilters.querySelectorAll('input');

  var GuestsParams = {
    ANY: guestsOptions[0],
    ONE_GUEST: guestsOptions[1],
    TWO_GUESTS: guestsOptions[2],
    NOT_FOR_GUESTS: guestsOptions[3],
  };

  var GuestsIndex = {
    ONE: 2,
    NO_ONE: 3
  };

  ad.querySelector('#address').setAttribute('readonly', 'readonly');
  adFormPrice.placeholder = OfferPrice.FLAT;

  /**
   * параметры неактивной страницы
   */
  function deactivatePage() {
    ad.reset();
    mapFilters.reset();
    window.filter.removePins();
    window.photoLoad.removePhotos();
    setDefaultRoomsStatus();
    window.map.mapMain.classList.add('map--faded');
    ad.classList.add('ad-form--disabled');
    adFieldsets.forEach(setDisableAttribute);
    window.map.mapFiltersSelect.forEach(setDisableAttribute);
    mapFiltersFeatures.forEach(setDisableAttribute);
    window.card.removeOffer();
    window.pin.mapMain.style.left = PinDefault.X + 'px';
    window.pin.mapMain.style.top = PinDefault.Y + 'px';
    window.map.isActivate = false;
  }

  // действия при нажатии на кнопку "очистить"
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivatePage();
    writeInactiveAdress();
    adFormTitle.style.borderColor = '';
    adFormPrice.style.borderColor = '';
  });

  /**
   * установка элементам массива атрибута disabled
   * @param {node} elem элемент массива
   */
  function setDisableAttribute(elem) {
    elem.setAttribute('disabled', 'disabled');
  }

  /**
   * удаление у элементов массива атрибута disabled
   * @param {node} elem
   */
  function removeDisableAttribute(elem) {
    elem.removeAttribute('disabled');
  }

  adFieldsets.forEach(setDisableAttribute);

  // подсказки полей при неправильно введенных данных
  adFormTitle.addEventListener('invalid', function () {
    if (adFormTitle.validity.tooShort) {
      adFormTitle.setCustomValidity('Минимальная длина — 30 символов.');
      adFormTitle.style.borderColor = '#ff0000';
    } else if (adFormTitle.validity.tooLong) {
      adFormTitle.setCustomValidity('Максимальная длина — 100 символов.');
      adFormTitle.style.borderColor = '#ff0000';
    } else if (adFormTitle.validity.valueMissing) {
      adFormTitle.setCustomValidity('Обязательное текстовое поле.');
      adFormTitle.style.borderColor = '#ff0000';
    } else {
      adFormTitle.setCustomValidity('');
      adFormTitle.style.borderColor = '';
    }
  });

  adFormPrice.addEventListener('invalid', function () {
    if (adFormPrice.validity.valueMissing) {
      adFormPrice.style.borderColor = '#ff0000';
    } else {
      adFormPrice.style.borderColor = '';
    }
  });

  /**
   * выбор типа жилья и минимальной цены
   */
  function setTypeOrPrice() {
    var typeValue = adFormType.value;
    var priceValue = adFormPrice.value;

    switch (typeValue) {
      case 'bungalo':
        adFormPrice.placeholder = OfferPrice.BUNGALO;
        if (OfferPrice.BUNGALO > priceValue) {
          adFormPrice.setCustomValidity('Минимальная цена за ночь 0');
          adFormPrice.style.borderColor = '#ff0000';
        } else {
          adFormPrice.setCustomValidity('');
          adFormPrice.style.borderColor = '';
        }
        break;
      case 'flat':
        adFormPrice.placeholder = OfferPrice.FLAT;
        if (OfferPrice.FLAT > priceValue) {
          adFormPrice.setCustomValidity('Минимальная цена за ночь 1 000');
          adFormPrice.style.borderColor = '#ff0000';
        } else {
          adFormPrice.setCustomValidity('');
          adFormPrice.style.borderColor = '';
        }
        break;
      case 'house':
        adFormPrice.placeholder = OfferPrice.HOUSE;
        if (OfferPrice.HOUSE > priceValue) {
          adFormPrice.setCustomValidity('Минимальная цена 5 000');
          adFormPrice.style.borderColor = '#ff0000';
        } else {
          adFormPrice.setCustomValidity('');
          adFormPrice.style.borderColor = '';
        }
        break;
      case 'palace':
        adFormPrice.placeholder = OfferPrice.PALACE;
        if (OfferPrice.PALACE > priceValue) {
          adFormPrice.setCustomValidity('Минимальная цена 10 000');
          adFormPrice.style.borderColor = '#ff0000';
        } else {
          adFormPrice.setCustomValidity('');
          adFormPrice.style.borderColor = '';
        }
        break;
    }
  }

  // синхронная смена времени отъезда/заезда
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

  /**
   * начальное состояние выбора комнат и гостей
   */
  function setDefaultRoomsStatus() {
    adFormGuestsNumber.selectedIndex = GuestsIndex.ONE;
    GuestsParams.ANY.disabled = true;
    GuestsParams.ONE_GUEST.disabled = true;
    GuestsParams.TWO_GUESTS.disabled = false;
    GuestsParams.NOT_FOR_GUESTS.disabled = true;
  }

  setDefaultRoomsStatus();

  // установка подходящих условий при выборе количества комнат
  adFormRoomsNumber.addEventListener('change', function () {
    var roomsNumber = adFormRoomsNumber.value;

    switch (roomsNumber) {
      case '1':
        adFormGuestsNumber.selectedIndex = GuestsIndex.ONE;
        GuestsParams.ANY.disabled = true;
        GuestsParams.ONE_GUEST.disabled = true;
        GuestsParams.TWO_GUESTS.disabled = false;
        GuestsParams.NOT_FOR_GUESTS.disabled = true;
        break;
      case '2':
        adFormGuestsNumber.selectedIndex = GuestsIndex.ONE;
        GuestsParams.ANY.disabled = true;
        GuestsParams.ONE_GUEST.disabled = false;
        GuestsParams.TWO_GUESTS.disabled = false;
        GuestsParams.NOT_FOR_GUESTS.disabled = true;
        break;
      case '3':
        adFormGuestsNumber.selectedIndex = GuestsIndex.ONE;
        GuestsParams.ANY.disabled = false;
        GuestsParams.ONE_GUEST.disabled = false;
        GuestsParams.TWO_GUESTS.disabled = false;
        GuestsParams.NOT_FOR_GUESTS.disabled = true;
        break;
      default:
        adFormGuestsNumber.selectedIndex = GuestsIndex.NO_ONE;
        GuestsParams.ANY.disabled = true;
        GuestsParams.ONE_GUEST.disabled = true;
        GuestsParams.TWO_GUESTS.disabled = true;
        GuestsParams.NOT_FOR_GUESTS.disabled = false;
    }
  });

  /**
   * определение координат в дефолтном состоянии
   */
  function writeInactiveAdress() {
    addressInput.value = Math.round(window.pin.mapMain.offsetLeft + window.pin.mapMain.offsetWidth / 2) + ', ' + Math.round(window.pin.mapMain.offsetTop + window.pin.mapMain.offsetHeight / 2);
  }

  writeInactiveAdress();

  /**
   * определение координат при перемещении метки
   */
  function writeAddress() {
    addressInput.value = Math.round(window.pin.mapMain.offsetLeft + window.pin.Params.MAIN_SIZE_WIDTH / 2) + ', ' + Math.round(window.pin.mapMain.offsetTop + window.pin.Params.MAIN_SIZE_HEIGHT);
  }

  adFormType.addEventListener('change', setTypeOrPrice);
  adFormPrice.addEventListener('change', setTypeOrPrice);

  /**
   * успешная отправка формы
   */
  function onFormSubmitSuccess() {
    window.success.getMessage();
    deactivatePage();
    writeInactiveAdress();
  }

  /**
   * ошибка при отправке формы
   * @param {string} errorMessage
   */
  function onFormSubmitError(errorMessage) {
    window.error.getMessage(errorMessage);
  }

  /**
   * отправка формы
   * @param {Object} evt
   */
  function onFormSubmit(evt) {
    evt.preventDefault();
    var data = new FormData(ad);
    window.backend.upload(onFormSubmitSuccess, onFormSubmitError, data);
  }

  ad.addEventListener('submit', onFormSubmit);

  window.form = {
    mapFilters: mapFilters,
    mapFiltersFeatures: mapFiltersFeatures,
    ad: ad,
    adFieldsets: adFieldsets,
    writeAddress: writeAddress,
    setDisableAttribute: setDisableAttribute,
    removeDisableAttribute: removeDisableAttribute
  };
})();

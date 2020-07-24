'use strict';

(function () {
    var
        OFFER_PRICE = {
            'bungalo': 0,
            'flat': 1000,
            'house': 5000,
            'palace': 10000
        },

        adForm = document.querySelector('.ad-form'),
        adFormFieldsets = adForm.querySelectorAll('fieldset'),
        adFormRoomsNumber = adForm.querySelector('#room_number'),
        adFormGuestsNumber = adForm.querySelector('#capacity'),
        guestsOptions = adFormGuestsNumber.querySelectorAll('option'),
        adFormTitle = adForm.querySelector('#title'),
        adFormTimeIn = adForm.querySelector('#timein'),
        adFormTimeOut = adForm.querySelector('#timeout'),
        adFormPrice = adForm.querySelector('#price'),
        adFormType = adForm.querySelector('#type'),
        addressInput = adForm.querySelector('#address'),
        resetButton = adForm.querySelector('.ad-form__reset'),
        adFormTimeContainer = adForm.querySelector('.ad-form__element--time'),
        mapFilters = document.querySelector('.map__filters'),
        mapFiltersFeatures = mapFilters.querySelectorAll('input'),

        guestsParams = {
            ANY: guestsOptions[0],
            ONE_GUEST: guestsOptions[1],
            TWO_GUESTS: guestsOptions[2],
            NOT_FOR_GUESTS: guestsOptions[3],
        },

        guestsIndex = {
            ONE: 2,
            NO_ONE: 3
        };

    adForm.querySelector('#address').setAttribute('readonly', 'readonly');
    adFormPrice.placeholder = OFFER_PRICE.flat;

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

    function setTypeOrPrice() {
        var
            typeValue = adFormType.value,
            priceValue = adFormPrice.value;

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

    function writeInactiveAdress() {
        addressInput.value = Math.round(window.pin.mapPinMain.offsetLeft + window.pin.mapPinMain.offsetWidth / 2) + ', ' + Math.round(window.pin.mapPinMain.offsetTop + window.pin.mapPinMain.offsetHeight / 2);
    }

    writeInactiveAdress();

    function writeAddress() {
        addressInput.value = Math.round(window.pin.mapPinMain.offsetLeft + window.pin.pinParams.MAIN_SIZE_WIDTH / 2) + ', ' + Math.round(window.pin.mapPinMain.offsetTop + window.pin.pinParams.MAIN_SIZE_HEIGHT);
    }

    adFormType.addEventListener('change', setTypeOrPrice);
    adFormPrice.addEventListener('change', setTypeOrPrice);

    window.form = {
        mapFilters: mapFilters,
        mapFiltersFeatures: mapFiltersFeatures,
        adForm: adForm,
        adFormFieldsets: adFormFieldsets,
        writeAddress: writeAddress,
        setDisableAttribute: setDisableAttribute,
        removeDisableAttribute: removeDisableAttribute
    };
})();

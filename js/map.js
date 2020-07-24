'use strict';

(function () {
    var
        mapFiltersSelect = window.form.mapFilters.querySelectorAll('select'),
        mapMain = document.querySelector('.map'),
        mapPins = document.querySelector('.map__pins'),

        isFirstLoad = true,
        isActivate = false;

    function activatePage() {
        mapMain.classList.remove('map--faded');
        window.form.adForm.classList.remove('ad-form--disabled');
        window.form.adFormFieldsets.forEach(window.form.removeDisableAttribute);
        mapFiltersSelect.forEach(window.form.removeDisableAttribute);
        window.form.mapFiltersFeatures.forEach(window.form.removeDisableAttribute);
    }

    mapFiltersSelect.forEach(window.form.setDisableAttribute);
    window.form.mapFiltersFeatures.forEach(window.form.setDisableAttribute);

    function enablePageByMouse() {
        if (isFirstLoad ? !isActivate : !isActivate) {
            if (isFirstLoad) {
                isFirstLoad = false;
                mapPins.appendChild(window.pin.createPins());
            }
            isActivate = true;
            activatePage();
        }

        window.form.writeAddress();
    }

    function enablePageByKey(evt) {
        if (isFirstLoad ? !isActivate : !isActivate) {
            if (isFirstLoad) {
                isFirstLoad = false;
                mapPins.appendChild(window.pin.createPins());
            }

            if (evt.keyCode === window.card.Keycode.ENTER) {
                isActivate = true;
                activatePage();
            }
        }

        window.form.writeAddress();
    }

    window.pin.mapPinMain.addEventListener('mousedown', enablePageByMouse);
    window.pin.mapPinMain.addEventListener('keydown', enablePageByKey);

    window.map = {
        mapPins: mapPins,
        mapMain: mapMain,
        mapFiltersSelect: mapFiltersSelect
    };
})();

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

    // перемещение метки
    window.pin.mapPinMain.addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        var startCoords = {
            x: evt.clientX,
            y: evt.clientY
        };

        /**
         * функция перемещения метки при движении мышкой с кликом
         * @param {Object} evtMove - объект при перемещении
         */
        function onMouseMove(evtMove) {
            evtMove.preventDefault();

            var shift = {
                x: startCoords.x - evtMove.clientX,
                y: startCoords.y - evtMove.clientY
            };

            startCoords = {
                x: evtMove.clientX,
                y: evtMove.clientY
            };

            // задаю границы перемещения метки по оси X
            var x = window.pin.mapPinMain.offsetLeft - shift.x;
            if (x < (0 - window.pin.pinParams.MAIN_SIZE_WIDTH / 2)) {
                x = (0 - window.pin.pinParams.MAIN_SIZE_WIDTH / 2);
            } else if (x > (mapMain.clientWidth - window.pin.pinParams.MAIN_SIZE_WIDTH / 2)) {
                x = (mapMain.clientWidth - window.pin.pinParams.MAIN_SIZE_WIDTH / 2);
            }

            // задаю границы перемещения метки по оси Y
            var y = window.pin.mapPinMain.offsetTop - shift.y;
            if (y < (window.pin.pinParams.MIN_Y - window.pin.pinParams.MAIN_SIZE_HEIGHT)) {
                y = window.pin.pinParams.MIN_Y - window.pin.pinParams.MAIN_SIZE_HEIGHT;
            } else if (y > (window.pin.pinParams.MAX_Y - window.pin.pinParams.MAIN_SIZE_HEIGHT)) {
                y = window.pin.pinParams.MAX_Y - window.pin.pinParams.MAIN_SIZE_HEIGHT;
            }

            window.pin.mapPinMain.style.left = x + 'px';
            window.pin.mapPinMain.style.top = y + 'px';

            window.form.writeAddress();
        }

        /**
         * функция отмены возможности перемещения при отпущенной клавише мыши
         * @param {Object} evtUp
         */
        function onMouseUp(evtUp) {
            evtUp.preventDefault();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    window.pin.mapPinMain.addEventListener('mousedown', enablePageByMouse);
    window.pin.mapPinMain.addEventListener('keydown', enablePageByKey);

    window.map = {
        mapPins: mapPins,
        mapMain: mapMain,
        mapFiltersSelect: mapFiltersSelect
    };
})();

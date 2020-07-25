'use strict';

(function () {
  // максимальное число отображаемых меток
  var MAX_PINS = 5;

  var mapFiltersSelect = window.form.mapFilters.querySelectorAll('select');
  var mapMain = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');

  // состояние при первой загрузке страницы
  var isFirstLoad = true;
  // состояние активности страницы
  var isActivate = false;

  /**
   * при успешной загрузке данных с сервера
   * @param {array} data
   */
  function onLoadSuccess(data) {
    window.allPins = data;
    var allPinsSliced = window.allPins.slice(0, MAX_PINS);
    mapPins.appendChild(window.pin.createMarks(allPinsSliced));
  }

  /**
   * ошибка при получении данных с сервера
   * @param {string} errorText
   */
  function onLoadError(errorText) {
    window.error.getMessage(errorText);
  }

  /**
   * параметры страницы при ее активации
   */
  function activatePage() {
    mapMain.classList.remove('map--faded');
    window.form.ad.classList.remove('ad-form--disabled');
    window.form.adFieldsets.forEach(window.form.removeDisableAttribute);
    mapFiltersSelect.forEach(window.form.removeDisableAttribute);
    window.form.mapFiltersFeatures.forEach(window.form.removeDisableAttribute);
  }

  mapFiltersSelect.forEach(window.form.setDisableAttribute);
  window.form.mapFiltersFeatures.forEach(window.form.setDisableAttribute);

  /**
   * однократная активация по клику мыши
   */
  function changeStateToActive() {
    // проверка загрузки страницы, если первая, в глобальной переменной еще нет window.map.isActivate
    // поэтому идет подвязка на локальную переменную isActivate
    if (isFirstLoad ? !isActivate : !window.map.isActivate) {
      if (isFirstLoad) {
        isFirstLoad = false;
      }
      isActivate = true;
      window.map.isActivate = true;
      activatePage();
      window.backend.load(onLoadSuccess, onLoadError);
    }

    window.form.writeAddress();
  }

  /**
   * активация страницы по клику мыши
   */
  function enablePageByMouse() {
    changeStateToActive();
  }

  /**
   * активация страницы по нажатию клавиши
   * @param {Object} evt
   */
  function enablePageByKey(evt) {
    if (evt.keyCode === window.card.KEY_CODES.ENTER) {
      changeStateToActive();
    }
  }

  window.pin.mapMain.addEventListener('mousedown', enablePageByMouse);
  window.pin.mapMain.addEventListener('keydown', enablePageByKey);

  // перемещение метки
  window.pin.mapMain.addEventListener('mousedown', function (evt) {
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

      // обозначение границ перемещения метки по оси X
      var x = window.pin.mapMain.offsetLeft - shift.x;
      if (x < (0 - window.pin.Params.MAIN_SIZE_WIDTH / 2)) {
        x = (0 - window.pin.Params.MAIN_SIZE_WIDTH / 2);
      } else if (x > (mapMain.clientWidth - window.pin.Params.MAIN_SIZE_WIDTH / 2)) {
        x = (mapMain.clientWidth - window.pin.Params.MAIN_SIZE_WIDTH / 2);
      }

      // обозначение границ перемещения метки по оси Y
      var y = window.pin.mapMain.offsetTop - shift.y;
      if (y < (window.pin.Params.MIN_Y - window.pin.Params.MAIN_SIZE_HEIGHT)) {
        y = window.pin.Params.MIN_Y - window.pin.Params.MAIN_SIZE_HEIGHT;
      } else if (y > (window.pin.Params.MAX_Y - window.pin.Params.MAIN_SIZE_HEIGHT)) {
        y = window.pin.Params.MAX_Y - window.pin.Params.MAIN_SIZE_HEIGHT;
      }

      window.pin.mapMain.style.left = x + 'px';
      window.pin.mapMain.style.top = y + 'px';

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

  window.map = {
    mapPins: mapPins,
    mapMain: mapMain,
    mapFiltersSelect: mapFiltersSelect
  };
})();

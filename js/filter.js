'use strict';

(function() {
  // макисмальное число отображаемых предложений
  var MAX_PINS = 5,

    OFFER_VALUE = {
      min: 10000,
      max: 50000
    },

    filtres = document.querySelector('.map__filters'),
    housingType = filtres.querySelector('#housing-type'),
    housingPrice = filtres.querySelector('#housing-price'),
    housingRooms = filtres.querySelector('#housing-rooms'),
    housingGuests = filtres.querySelector('#housing-guests'),
    housingFeatures = filtres.querySelector('#housing-features'),
    featuresArray = Array.from(housingFeatures.querySelectorAll('[name="features"]'));

  /**
   * удаление всех меток
   */
  function removePins() {
    var allPinsElem = document.querySelectorAll('.map__pin[type="button"]');

    allPinsElem.forEach(function(it) {
      it.remove();
    });
  }

  /**
   * отображение метки согласно заданным параметрам
   */
  var updatePins = window.debounce(function() {
    var allPins = window.allPins;

    /**
     * фильтрация по параметрам (тип жилья, число комнат, число гостей)
     * @param {string} offerValue значение на карточке
     * @param {string} filterValue значение на фильтре
     * @return {string}
     */
    function filterByParams(offerValue, filterValue) {
      return filterValue === 'any' || offerValue.toString() === filterValue.toString();
    }

    /**
     * фильтрация по цене
     * @param {string} offerValue
     * @param {string} filterValue
     * @return {boolean}
     */
    function filterByPrice(offerValue, filterValue) {
      switch (filterValue) {
        case 'low':
          return offerValue < OFFER_VALUE.min;
        case 'middle':
          return offerValue >= OFFER_VALUE.min && offerValue < OFFER_VALUE.max;
        case 'high':
          return offerValue >= OFFER_VALUE.max;
      }
      return true;
    }

    /**
     * фильтрация по удобствам
     * @param {string} offerFeatures
     * @return {array}
     */
    function filterByFeatures(offerFeatures) {

      // создание массива из выбранных удобств
      var checked = featuresArray.filter(function(elem) {
        return elem.checked === true;
      });

      // поиск вариантов, которые содержат в себе все выделенные удобства
      return checked.every(function(elem) {
        return offerFeatures.indexOf(elem.value) > -1;
      });
    }

    // проверка соответствия меток по всем вариантам из фильтрации, если подходит, то записывается в массив
    var filteredPins = allPins.filter(function(el) {
      return filterByParams(el.offer.type, housingType.value) &&
        filterByParams(el.offer.rooms, housingRooms.value) &&
        filterByParams(el.offer.guests, housingGuests.value) &&
        filterByPrice(el.offer.price, housingPrice.value) &&
        filterByFeatures(el.offer.features);
    });

    removePins();

    // максимальное количество отображаемых меток
    var filteredPinsSliced = filteredPins.slice(0, MAX_PINS);
    window.map.mapPins.appendChild(window.pin.createPins(filteredPinsSliced));
  });

  // при смене вариантов в фильтре, происходит удаление старых карточек и отображаются новые
  filtres.addEventListener('change', function() {
    window.card.removeCard();
    updatePins();
  });

  window.filter = {
    MAX_PINS: MAX_PINS,
    removePins: removePins
  };
})();

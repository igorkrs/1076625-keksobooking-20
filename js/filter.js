'use strict';

(function () {
  // макисмальное число отображаемых предложений
  var MAX_PINS = 5;

  var OfferValue = {
    MIN: 10000,
    MAX: 50000
  };

  var filtres = document.querySelector('.map__filters');
  var housingType = filtres.querySelector('#housing-type');
  var housingPrice = filtres.querySelector('#housing-price');
  var housingRooms = filtres.querySelector('#housing-rooms');
  var housingGuests = filtres.querySelector('#housing-guests');
  var housingFeatures = filtres.querySelector('#housing-features');
  var featuresArray = Array.from(housingFeatures.querySelectorAll('[name="features"]'));

  /**
   * удаление всех меток
   */
  function removePins() {
    var allPinsElem = document.querySelectorAll('.map__pin[type="button"]');

    allPinsElem.forEach(function (it) {
      it.remove();
    });
  }

  /**
   * отображение метки согласно заданным параметрам
   */
  var updatePins = window.debounce(function () {
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
          return offerValue < OfferValue.MIN;
        case 'middle':
          return offerValue >= OfferValue.MIN && offerValue < OfferValue.MAX;
        case 'high':
          return offerValue >= OfferValue.MAX;
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
      var checked = featuresArray.filter(function (elem) {
        return elem.checked === true;
      });

      // поиск вариантов, которые содержат в себе все выделенные удобства
      return checked.every(function (elem) {
        return offerFeatures.indexOf(elem.value) > -1;
      });
    }

    // проверка соответствия меток по всем вариантам из фильтрации, если подходит, то записывается в массив
    var filteredPins = allPins.filter(function (el) {
      return filterByParams(el.offer.type, housingType.value) &&
        filterByParams(el.offer.rooms, housingRooms.value) &&
        filterByParams(el.offer.guests, housingGuests.value) &&
        filterByPrice(el.offer.price, housingPrice.value) &&
        filterByFeatures(el.offer.features);
    });

    removePins();

    // максимальное количество отображаемых меток
    var filteredPinsSliced = filteredPins.slice(0, MAX_PINS);
    window.map.mapPins.appendChild(window.pin.createMarks(filteredPinsSliced));
  });

  // при смене вариантов в фильтре, происходит удаление старых карточек и отображаются новые
  filtres.addEventListener('change', function () {
    window.card.removeOffer();
    updatePins();
  });

  window.filter = {
    MAX_PINS: MAX_PINS,
    removePins: removePins
  };
})();

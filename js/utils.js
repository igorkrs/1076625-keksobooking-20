'use strict';

(function () {
  // числа, в зависимости от которых будет меняться
  // склонение слов
  var VaraibleValue = {
    MIN: 1,
    TWO: 2,
    FOUR: 4,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    MAX: 100
  };

  // индекс элемента в массиве
  var ArrayIndex = {
    FIRST: '0',
    SECOND: '1',
    THIRD: '2'
  };

  /**
   * склонение слов
   * @param {number} num число, в зависимости от которого будем склонять
   * @param {array} expressions массив
   * @return {string}
   */
  function declension(num, expressions) {
    var result;
    var count = num % VaraibleValue.MAX;

    if (count >= VaraibleValue.FIVE && count <= VaraibleValue.TWENTY) {
      result = expressions[ArrayIndex.THIRD];
    } else {
      count = count % VaraibleValue.TEN;
      if (count === VaraibleValue.MIN) {
        result = expressions[ArrayIndex.FIRST];
      } else if (count >= VaraibleValue.TWO && count <= VaraibleValue.FOUR) {
        result = expressions[ArrayIndex.SECOND];
      } else {
        result = expressions[ArrayIndex.THIRD];
      }
    }

    return result;
  }

  window.utils = {
    declension: declension
  };
})();

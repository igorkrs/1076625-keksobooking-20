'use strict';

(function() {
  /**
   * отобржаение окна ошибки загрузки данных
   * @param {string} errorMessage
   */
  function getErrorMessage(errorMessage) {
    var
      errorTemplate = document.querySelector('#error').content.querySelector('.error'),
      errorElement = errorTemplate.cloneNode(true),
      main = document.querySelector('main'),
      errorButton = errorElement.querySelector('.error__button');

    /**
     * закрытие окна с ошибкой
     */
    function closeError() {
      main.removeChild(errorElement);

      errorButton.removeEventListener('click', closeError);
      document.removeEventListener('click', closeError);
      document.removeEventListener('keydown', onErrorEsc);
    }

    errorButton.addEventListener('click', closeError);
    document.addEventListener('click', closeError);
    document.addEventListener('keydown', onErrorEsc);

    /**
     * закрытие окна по нажатию на клавишу ESC
     * @param {Object} evt
     */
    function onErrorEsc(evt) {
      window.card.onEscDown(evt, closeError);
    }

    errorElement.querySelector('.error__message').textContent = errorMessage;
    main.appendChild(errorElement);
  }

  window.error = {
    getErrorMessage: getErrorMessage
  };
})();

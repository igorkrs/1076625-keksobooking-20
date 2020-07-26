'use strict';

(function () {
  /**
   * отобржаение окна ошибки загрузки данных
   * @param {string} errorMessage
   */
  function getMessage(errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var element = errorTemplate.cloneNode(true);
    var main = document.querySelector('main');
    var button = element.querySelector('.error__button');

    /**
     * закрытие окна с ошибкой
     */
    function closeError() {
      main.removeChild(element);
      window.form.deactivatePage();

      button.removeEventListener('click', closeError);
      document.removeEventListener('mousedown', closeError);
      document.removeEventListener('keydown', onErrorEsc);
    }

    button.addEventListener('click', closeError);
    document.addEventListener('mousedown', closeError);
    document.addEventListener('keydown', onErrorEsc);

    /**
     * закрытие окна по нажатию на клавишу ESC
     * @param {Object} evt
     */
    function onErrorEsc(evt) {
      window.card.onEscDown(evt, closeError);
    }

    element.querySelector('.error__message').textContent = errorMessage;
    main.appendChild(element);
  }

  window.error = {
    getMessage: getMessage
  };
})();

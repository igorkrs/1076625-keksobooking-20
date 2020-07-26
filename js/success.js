'use strict';

(function () {
  /**
   * получение сообщения об успешной отправки данных на сервер
   */
  function getMessage() {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var success = successTemplate.cloneNode(true);
    var main = document.querySelector('main');

    /**
     * закрытие окна успешной отправки данных
     */
    function closeSuccess() {
      main.removeChild(success);
      document.removeEventListener('click', closeSuccess);
      document.removeEventListener('keydown', onSuccessEscDown);
    }

    /**
     * закрытие окна по нажатию на клавишу ESC
     * @param {Object} evt
     */
    function onSuccessEscDown(evt) {
      window.card.onEscDown(evt, closeSuccess);
    }

    document.addEventListener('click', closeSuccess);
    document.addEventListener('keydown', onSuccessEscDown);

    main.appendChild(success);
  }

  window.success = {
    getMessage: getMessage
  };
})();

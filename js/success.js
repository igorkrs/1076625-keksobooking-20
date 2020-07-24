'use strict';

(function () {
    function getSuccessMessage() {
        var successTemplate = document.querySelector('#success').content.querySelector('.success');
        var successElement = successTemplate.cloneNode(true);
        var main = document.querySelector('main');

        /**
         * закрытие окна успешной отправки данных
         */
        function closeSuccess() {
            main.removeChild(successElement);
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

        main.appendChild(successElement);
    }

    window.success = {
        getSuccessMessage: getSuccessMessage
    };
})();

'use strict';

(function () {
    var serverUrls = {
        LOAD: 'https://javascript.pages.academy/keksobooking/data',
        UPLOAD: 'https://javascript.pages.academy/keksobooking'
    };

    var TIMEOUT = 10000;

    function createXhr(method, url, onSuccess, onError, data) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.addEventListener('load', function () {
            switch (xhr.status) {
                case 200:
                    onSuccess(xhr.response);
                    break;
                case 400:
                    onError('Неверный запрос.');
                    break;
                case 404:
                    onError('Страница не найдена.');
                    break;
                case 503:
                    onError('Сервис временно недоступен.');
                    break;
                default:
                    onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
            }
        });

        xhr.addEventListener('error', function () {
            onError('Произошла ошибка соединения.');
        });

        xhr.addEventListener('timeout', function () {
            onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
        });

        xhr.timeout = TIMEOUT;
        xhr.open(method, url);
        xhr.send(data);
    }

    function load(onSuccess, onError) {
        createXhr('GET', serverUrls.LOAD, onSuccess, onError);
    }

    function upload(onSuccess, onError, data) {
        createXhr('POST', serverUrls.UPLOAD, onSuccess, onError, data);
    }

    window.backend = {
        load: load,
        upload: upload
    };
})();

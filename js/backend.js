'use strict';

(function () {
  var TIMEOUT = 10000;

  var ServerUrls = {
    LOAD: 'https://javascript.pages.academy/keksobooking/data',
    UPLOAD: 'https://javascript.pages.academy/keksobooking'
  };

  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVICE_UNAVAILABLE: 503
  };

  function createXhr(method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.OK:
          onSuccess(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          onError('Неверный запрос.');
          break;
        case StatusCode.NOT_FOUND:
          onError('Страница не найдена.');
          break;
        case StatusCode.SERVICE_UNAVAILABLE:
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
    createXhr('GET', ServerUrls.LOAD, onSuccess, onError);
  }

  function upload(onSuccess, onError, data) {
    createXhr('POST', ServerUrls.UPLOAD, onSuccess, onError, data);
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();

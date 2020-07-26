'use strict';

(function () {
  var MUFFIN_PHOTO = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooser = document.querySelector('.ad-form__field input[type=file]');
  var photoChooser = document.querySelector('.ad-form__upload input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var PhotoParams = {
    WIDTH: '100%',
    HEIGHT: '100%'
  };

  // добавление фотографиb (для карты) при нажатии
  avatarChooser.addEventListener('change', function () {
    var avatar = avatarChooser.files[0];
    var avatarName = avatar.name.toLowerCase();
    var matchesAvatar = hasMatchesPhotos(avatarName);

    if (matchesAvatar) {
      var avatarReader = new FileReader();

      avatarReader.addEventListener('load', function () {
        avatarPreview.src = avatarReader.result;
      });

      avatarReader.readAsDataURL(avatar);
    }
  });

  // добавление фотографии жилья с множественным превью
  photoChooser.addEventListener('change', function () {
    var photos = photoChooser.files;
    var photosArray = Array.from(photos);

    photosArray.forEach(function (photo) {
      var photosName = photo.name.toLowerCase();
      var matchesPhotos = hasMatchesPhotos(photosName);

      if (matchesPhotos) {
        renderPhotos(photo);
      }
    });
  });

  function hasMatchesPhotos(name) {
    return FILE_TYPES.some(function (it) {
      return name.endsWith(it);
    });
  }

  /**
   * создание пустого блока
   */
  function createEmptyBlock() {
    var photoBlock = document.createElement('div');
    photoBlock.classList.add('ad-form__photo');
    var photoDuplicate = photoBlock.cloneNode(true);

    photoContainer.appendChild(photoDuplicate);
  }

  /**
   * создание отображения раздела фотографий жилья
   * @param {any} photos
   */
  function renderPhotos(photos) {
    var photoReader = new FileReader();

    photoReader.addEventListener('load', function () {
      var image = document.createElement('img');
      var photoTemplate = photoContainer.querySelectorAll('.ad-form__photo');

      image.src = photoReader.result;
      image.style.width = PhotoParams.WIDTH;
      image.style.height = PhotoParams.HEIGHT;

      createEmptyBlock();

      photoTemplate.forEach(function (el) {
        if (!el.hasChildNodes()) {
          el.appendChild(image);
        }
      });
    });

    photoReader.readAsDataURL(photos);
  }

  /**
   * удаление фотографий
   */
  function removePhotos() {
    var photoTemplate = photoContainer.querySelectorAll('.ad-form__photo');

    if (avatarPreview.src !== MUFFIN_PHOTO) {
      avatarPreview.src = MUFFIN_PHOTO;
    }

    photoTemplate.forEach(function (el) {
      if (el.hasChildNodes()) {
        el.remove();
      }
    });
  }

  window.photoLoad = {
    removePhotos: removePhotos
  };
})();

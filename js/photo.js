'use strict';

(function() {
  var
    FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'],
    avatarChooser = document.querySelector('.ad-form__field input[type=file]'),
    photoChooser = document.querySelector('.ad-form__upload input[type=file]'),
    avatarPreview = document.querySelector('.ad-form-header__preview img'),
    photoContainer = document.querySelector('.ad-form__photo-container'),
    MUFFIN_PHOTO = 'img/muffin-grey.svg',
    photoParams = {
      WIDTH: '100%',
      HEIGHT: '100%'
    };

  // добавление фотографиb (для карты) при нажатии
  avatarChooser.addEventListener('change', function() {
    var
      avatar = avatarChooser.files[0],
      avatarName = avatar.name.toLowerCase(),
      matchesAvatar = hasMatchesPhotos(avatarName);

    if (matchesAvatar) {
      var avatarReader = new FileReader();

      avatarReader.addEventListener('load', function() {
        avatarPreview.src = avatarReader.result;
      });

      avatarReader.readAsDataURL(avatar);
    }
  });

  // добавление фотографии жилья с множественным превью
  photoChooser.addEventListener('change', function() {
    var
      photos = photoChooser.files,
      photosArray = Array.from(photos);

    photosArray.forEach(function(photo) {
      var
        photosName = photo.name.toLowerCase(),
        matchesPhotos = hasMatchesPhotos(photosName);

      if (matchesPhotos) {
        renderPhotos(photo);
      }
    });
  });

  function hasMatchesPhotos(name) {
    return FILE_TYPES.some(function(it) {
      return name.endsWith(it);
    });
  }

  /**
   * создание пустого блока
   */
  function createEmptyBlock() {
    var photoBlock = document.createElement('div');
    photoBlock.classList.add('ad-form__photo');
    var photoElement = photoBlock.cloneNode(true);

    photoContainer.appendChild(photoElement);
  }

  /**
   * создание отображения раздела фотографий жилья
   * @param {any} photos
   */
  function renderPhotos(photos) {
    var photoReader = new FileReader();

    photoReader.addEventListener('load', function() {
      var
        image = document.createElement('img'),
        photoTemplate = photoContainer.querySelectorAll('.ad-form__photo');

      image.src = photoReader.result;
      image.style.width = photoParams.WIDTH;
      image.style.height = photoParams.HEIGHT;

      createEmptyBlock();

      photoTemplate.forEach(function(el) {
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

    photoTemplate.forEach(function(el) {
      if (el.hasChildNodes()) {
        el.remove();
      }
    });
  }

  window.photoLoad = {
    removePhotos: removePhotos
  };
})();

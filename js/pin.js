'use strict';

(function () {
    var
        pinParams = {
            PIN_SIZE_WIDTH: 50,
            PIN_SIZE_HEIGHT: 70,

            MAIN_SIZE_WIDTH: 65,
            MAIN_SIZE_HEIGHT: 84,

            LIMIT: 8,

            MIN_Y: 130,
            MAX_Y: 630
        },

        mapPinMain = document.querySelector('.map__pin--main'),
        mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    function createPins(data) {
        var
            pinsFragment = document.createDocumentFragment(),
            offer;

        // window.card.getRandomOffer();

        data.forEach(el => {
            offer = createOffer(el);
            pinsFragment.appendChild(offer);
        });

        return pinsFragment;
    }

    function createOffer(data) {
        var
            offerPin = mapPinTemplate.cloneNode(true),
            image = offerPin.querySelector('img');

        offerPin.style.left = (data.location.x - window.pin.pinParams.PIN_SIZE_WIDTH / 2) + 'px';
        offerPin.style.top = (data.location.y - window.pin.pinParams.PIN_SIZE_HEIGHT) + 'px';
        image.src = data.author.avatar;
        image.alt = data.offer.title;

        function onPinClick() {
            var mapCard = document.querySelector('.map__card');

            if (mapCard) {
                mapCard.remove();
            }

            window.card.renderCard(data);
        }

        offerPin.addEventListener('click', onPinClick);

        return offerPin;
    }

    window.pin = {
        // pins: pins,
        pinParams: pinParams,
        mapPinMain: mapPinMain,
        createOffer: createOffer,
        createPins: createPins
    };
})();

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

        pins = [],
        mapPinMain = document.querySelector('.map__pin--main'),
        mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    function createPins() {
        var
            pinsFragment = document.createDocumentFragment(),
            offer;

        window.card.getRandomOffer();

        pins.forEach(el => {
            offer = createOffer(el);
            pinsFragment.appendChild(offer);
        });

        return pinsFragment;
    }

    function createOffer(offer) {
        var
            offerPin = mapPinTemplate.cloneNode(true),
            image = offerPin.querySelector('img');

        offerPin.style.left = (offer.location.x - window.pin.pinParams.PIN_SIZE_WIDTH / 2) + 'px';
        offerPin.style.top = (offer.location.y - window.pin.pinParams.PIN_SIZE_HEIGHT) + 'px';
        image.src = offer.author.avatar;
        image.alt = offer.offer.title;

        function onPinClick() {
            var mapCard = document.querySelector('.map__card');

            if (mapCard) {
                mapCard.remove();
            }

            window.card.renderCard(offer);
        }

        offerPin.addEventListener('click', onPinClick);

        return offerPin;
    }

    window.pin = {
        pins: pins,
        pinParams: pinParams,
        mapPinMain: mapPinMain,
        createOffer: createOffer,
        createPins: createPins
    };
})();

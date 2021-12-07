

let storage = localStorage;
var placemarks = [],
    geoObjects = [],
    sampleBaloon = [

        '<div class="reviews-content"></div>',
        '<div class="form">',
        '<div class="ballon-title">Добавьте ваш отзыв:</div>',
        '<input class="add-name-input" placeholder="Укажите ваше имя" type="text">',
        '<input class="add-place-input" placeholder="Укажите место" type="text">',
        '<textarea class="add-review-textarea" placeholder="Оставить отзыв" type="text"></textarea>',
        '<button class="button">Добавить</button>',
        '</div>'

    ];

if (storage.data) {

    var data = JSON.parse(localStorage.data);
    placemarks = data.placemarks;

}

function injectMapsScript() {
    return new Promise((resolve) => {
        const ymapsScript = document.createElement("script");
        ymapsScript.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
        document.body.appendChild(ymapsScript);
        ymapsScript.addEventListener('load', resolve);
    });
}

injectMapsScript()
    .then(() => ymaps.ready(init))

function init() {
    var map = new ymaps.Map('map', {
        center: [59.94, 30.32],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    for (var i = 0; i < placemarks.length; i++) {

        let review = `
        <div>
        <b>Место: ${placemarks[i].review.place}
        </div>
        <div>Текст отзыва: ${placemarks[i].review.reviewText}</div>
        `;

        geoObjects[i] = addMarkerWithReview(placemarks[i].position, review, placemarks[i]);

    }

    var clusterer = new ymaps.Clusterer({

        clusterDisableClickZoom: true,
        groupByCoordinates: false,
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        

    });

    clusterer.add(geoObjects);
    map.geoObjects.add(clusterer);


    map.events.add('click', function (e) {
        var position = e.get('coords');

        map.balloon.open(position, sampleBaloon.join(''))
            .then(() => {
                const button = document.querySelector('.button');

                button.addEventListener('click', () => {
                    const addNameInput = document.querySelector('.add-name-input');
                    const addPlaceInput = document.querySelector('.add-place-input');
                    const addReviewTextarea = document.querySelector('.add-review-textarea');
                    let reviewsContent = document.querySelector('.reviews-content');

                    if (addNameInput.value && addPlaceInput.value && addReviewTextarea.value) {

                        let placemark = {
                            position,
                            review: {
                                nameUser: addNameInput.value,
                                place: addPlaceInput.value,
                                reviewText: addReviewTextarea.value
                            }

                        };

                        const div = document.createElement('div');
                        div.classList.add('review-item');
                        div.innerHTML = `
                                <div>
                                <b>${placemark.review.nameUser}</b> [${placemark.review.place}]
                                </div>
                                <div>${placemark.review.reviewText}</div>
                                `;
                        reviewsContent.appendChild(div);

                        addNameInput.value = '';
                        addPlaceInput.value = '';
                        addReviewTextarea.value = '';

                        var myPlacemark = addMarkerWithReview(position, div.innerHTML, placemark);
                        map.geoObjects.add(myPlacemark);
                        clusterer.add(myPlacemark);
                        placemarks.push(placemark);

                        storage.data = JSON.stringify({
                            placemarks
                        });
                    }

                });

                

            });
    });
}

function addMarkerWithReview(position, review, item) {
    return new ymaps.Placemark(position, {

        hintContent: '<div class="map__hint">Отзыв</div>',
        balloonContentBody: review,
        clusterCaption: `Отзыв клиента: ${item.review.nameUser}`

    });
}
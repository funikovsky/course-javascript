/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns.html

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

import './towns.html';

const homeworkContainer = document.querySelector('#app');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
let loadedTowns;

function loadTowns() {
  return new Promise((resolve, reject) => {
    let requestTowns = new XMLHttpRequest();
    requestTowns.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
    requestTowns.responseType = 'json';
    requestTowns.send();

    requestTowns.addEventListener('load', () => {
      loadedTowns = requestTowns.response;

      loadedTowns = loadedTowns.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });

      

      resolve(loadedTowns);

    });

    requestTowns.addEventListener('error', () => {
      reject();
    });



  });


}
loadTowns()
  .then(() => loadingBlock.style.display = 'none')
  .then(() => filterInput.style.display = 'block')
  .catch(() => {
    loadingBlock.style.display = 'none';
    loadingFailedBlock.style.display = 'block';
  });






/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
  let fullWord = full.toLowerCase();
  let chunkWord = chunk.toLowerCase();
  return fullWord.includes(chunkWord);


}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с надписью "Не удалось загрузить города" и кнопкой "Повторить" */
const loadingFailedBlock = homeworkContainer.querySelector('#loading-failed');
/* Кнопка "Повторить" */
const retryButton = homeworkContainer.querySelector('#retry-button');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');

/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.style.display = 'none';
loadingFailedBlock.style.display = 'none';

retryButton.addEventListener('click', () => {

  loadTowns();
});





filterInput.addEventListener('input', function () {

  while (filterResult.firstChild) {
    filterResult.removeChild(filterResult.firstChild);
  }

  for (let i = 0; i < loadedTowns.length; i++) {
    if (isMatching(loadedTowns[i].name, filterInput.value) && filterInput.value != '') {
      const newDiv = document.createElement('div');
      filterResult.appendChild(newDiv);
      newDiv.textContent = loadedTowns[i].name;

    }

  }


});

export {
  loadTowns,
  isMatching
};
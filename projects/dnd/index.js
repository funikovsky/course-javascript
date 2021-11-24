/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

let offsetX;
let offsetY;

document.addEventListener('dragstart', function(event) {
    offsetX = event.offsetX;
    offsetY = event.offsetY;
});

document.addEventListener('dragend', function(event) {
    event.target.style.top = (event.pageY - offsetY) + 'px';
    event.target.style.left = (event.pageX - offsetX) + 'px';

});

//document.addEventListener('mousemove', (e) => {
  
//});

export function createDiv() {
  const newDiv = document.createElement('div');
  newDiv.classList.add('draggable-div');
  let color = '#' + Math.round(0xffffff * Math.random()).toString(16);
  newDiv.style.height = `${Math.floor(Math.random() * 1000) + "px"}`;
  newDiv.style.width = `${Math.floor(Math.random() * 1000) + "px"}`;
  newDiv.style.left = `${Math.floor(Math.random() * 1000) + "px"}`;
  newDiv.style.top = `${Math.floor(Math.random() * 1000) + "px"}`;
  newDiv.style.background = color;

  return newDiv;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);

});
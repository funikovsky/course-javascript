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

//document.addEventListener('mousemove', (e) => {

//});

export function createDiv() {
  const newDiv = document.createElement('div');
  let offsetX;
  let offsetY;
  newDiv.classList.add('draggable-div');
  const color = '#' + Math.round(0xffffff * Math.random()).toString(16);
  newDiv.style.height = `${Math.floor(Math.random() * 1000) + 'px'}`;
  newDiv.style.width = `${Math.floor(Math.random() * 1000) + 'px'}`;
  newDiv.style.left = `${Math.floor(Math.random() * 1000) + 'px'}`;
  newDiv.style.top = `${Math.floor(Math.random() * 1000) + 'px'}`;
  newDiv.style.background = color;
  newDiv.draggable = true;

  newDiv.addEventListener('mousedown', function (event) {
    offsetX = event.offsetX;
    offsetY = event.offsetY;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      newDiv.style.top = pageY - offsetY + 'px';
      newDiv.style.left = pageX - offsetX + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    newDiv.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', onMouseMove);
      newDiv.onmouseup = null;
    });

    newDiv.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  });

  return newDiv;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});

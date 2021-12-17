import './index.html';

let userName = '';
let photoResult;

const messageText = document.querySelector('#messageText'),
  sendButton = document.querySelector('#sendButton'),
  inputName = document.querySelector('#name'),
  buttonSaveName = document.querySelector('#save'),
  messageContainer = document.querySelector('#messageContainer'),
  modal = document.querySelector('.modal'),
  messageZone = document.querySelector('.message-zone'),
  mainUserConteiner = document.querySelector('.main__user'),
  guestUsersList = document.querySelector('.guest__users-list'),
  userInfo = document.querySelector('.user__info'),
  userPhoto = document.querySelector('.user-photo'),
  counterUsers = document.querySelector('.counter-users'),
  burgerOpen = document.querySelector('.user__info-load-photo'),
  modalBurger = document.querySelector('.modal__burger'),
  burgerClose = document.querySelector('.modal__close'),
  btnContainer = document.querySelector('.btn-container'),
  burgerTitle = document.querySelector('.burger__title');

const startSocket = () => {
  const socket = new WebSocket('ws://localhost:9000');

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: 'hello',
        user: userName,
      })
    );
    const nameMainUser = document.createElement('div');
    nameMainUser.innerHTML = userName;
    mainUserConteiner.appendChild(nameMainUser);
  };

  socket.addEventListener('message', (message) => {
    addMessage(message.data);
    updateUserList(message.data);
    changeAvatar(message.data);
  });

  sendButton.addEventListener('click', () => {
    if (messageText.value) {
      socket.send(
        JSON.stringify({
          text: messageText.value,
          url: photoResult,
        })
      );
      messageText.value = '';
    }
  });

  userInfo.addEventListener('dragover', (e) => {
    if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
      e.preventDefault();
    }
  });

  userInfo.addEventListener('drop', (e) => {
    const file = e.dataTransfer.items[0].getAsFile();
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      userPhoto.style.backgroundImage = `url(${reader.result})`;

      userPhoto.classList.add('user-photo--change-style');
      mainUserConteiner.classList.add('hidden');
      btnContainer.classList.remove('hidden');
      burgerClose.classList.add('hidden');
      burgerTitle.classList.add('hidden');

      btnContainer.addEventListener('click', function (e) {
        if (e.target.matches('.btn-save')) {
          photoResult = reader.result;

          userPhoto.classList.remove('user-photo--change-style');
          mainUserConteiner.classList.remove('hidden');
          btnContainer.classList.add('hidden');
          burgerClose.classList.remove('hidden');
          burgerTitle.classList.remove('hidden');

          socket.send(
            JSON.stringify({
              type: 'image',
              url: reader.result,
            })
          );
        } else if (e.target.matches('.btn-cancel')) {
          userPhoto.classList.remove('user-photo--change-style');
          mainUserConteiner.classList.remove('hidden');
          btnContainer.classList.add('hidden');
          burgerClose.classList.remove('hidden');
          burgerTitle.classList.remove('hidden');

          userPhoto.style.background =
            'rgba(0, 0, 0, 0) url("http://localhost:8080/projects/chat/photo/no-photo.png")' +
            'no-repeat scroll 50% 50% / cover padding-box border-box';
        }
      });
    });

    e.preventDefault();
  });
};

function addMessage(stringMessage) {
  const messageItem = document.createElement('li');
  messageItem.classList.add('list-group__item');
  const divInMessageItem = document.createElement('div');
  divInMessageItem.classList.add('message');

  const message = JSON.parse(stringMessage);

  if (message.type === 'hello') {
    messageItem.innerHTML =
      '<span style="color: blue"><b>' + message.name + '</b> присоединился к чату</span>';
    messageContainer.appendChild(messageItem);
  } else if (message.type === 'bye') {
    messageItem.innerHTML =
      '<span style="color: red"><b>' + message.name + '</b> вышел из чата</span>';

    messageContainer.appendChild(messageItem);
  } else if (message.text) {
    divInMessageItem.innerHTML = message.name + ': <span>' + message.text + '</span>';
    messageItem.appendChild(divInMessageItem);
    messageContainer.appendChild(messageItem);
    const div = document.createElement('div');
    div.classList.add(`${message.name}`);

    setPropertyAvatar(div, message);

    messageItem.insertBefore(div, divInMessageItem);
  }
}

function setPropertyAvatar(element, message) {
  element.style.height = '50px';
  element.style.width = '50px';
  element.style.borderRadius = '50%';

  if (message.url) {
    element.style.background = `url(${message.url}) center center/cover no-repeat`;
  } else {
    element.style.background =
      'rgba(0, 0, 0, 0) url("http://localhost:8080/projects/chat/photo/no-photo.png")' +
      'no-repeat scroll 50% 50% / cover padding-box border-box';
  }
}

function updateUserList(userList) {
  const message = JSON.parse(userList);
  if (message.type === 'user-list') {
    guestUsersList.innerHTML = '';
    counterUsers.innerHTML = '';
    let count = 0;

    for (const item of message.data) {
      const usersListItem = document.createElement('li');
      usersListItem.classList.add('guest__users-item');
      const element = document.createElement('div');
      guestUsersList.appendChild(usersListItem);
      element.textContent = item.userName;
      count++;

      const div = document.createElement('div');
      div.classList.add(`${item.userName}`);
      div.classList.add('avatar');

      div.style.height = '50px';
      div.style.width = '50px';
      div.style.borderRadius = '50%';

      if (item.userImageUrl) {
        div.style.background = `url(${item.userImageUrl}) center center/cover no-repeat`;
      } else {
        div.style.background =
          'rgba(0, 0, 0, 0) url("http://localhost:8080/projects/chat/photo/no-photo.png")' +
          'no-repeat scroll 50% 50% / cover padding-box border-box';
      }
      usersListItem.appendChild(element);
      usersListItem.insertBefore(div, element);
    }
    counterUsers.innerHTML = `Участников: ${count}`;
  }
}

function changeAvatar(stringMessage) {
  const message = JSON.parse(stringMessage);

  if (message.type === 'image' && message.url) {
    const avatars = document.querySelectorAll(`.${message.name}`);
    avatars.forEach((avatar) => {
      avatar.style.background = `url(${message.url}) center center/cover no-repeat`;
    });
  }
}

buttonSaveName.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputName.value !== '') {
    userName = inputName.value;
    inputName.disabled = true;
    buttonSaveName.disabled = true;
    messageText.disabled = false;
    sendButton.disabled = false;
    modal.classList.add('hidden');
    messageZone.classList.remove('hidden');

    startSocket();
  }
});

burgerOpen.addEventListener('click', () => modalBurger.classList.add('show'));
burgerClose.addEventListener('click', () => modalBurger.classList.remove('show'));

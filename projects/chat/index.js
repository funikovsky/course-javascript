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
  userPhoto = document.querySelector('.user-photo');

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
    divInMessageItem.innerHTML = message.name + ': <b>' + message.text + '</b>';
    messageItem.appendChild(divInMessageItem);
    messageContainer.appendChild(messageItem);
    const div = document.createElement('div');

    div.style.height = '50px';
    div.style.width = '50px';
    div.style.borderRadius = '50%';

    if (message.url) {
      div.style.background = `url(${message.url}) center center/cover no-repeat`;
    } else {
      const bgUserPhoto = window
        .getComputedStyle(userPhoto, null)
        .getPropertyValue('background');
      div.style.background = bgUserPhoto;
    }

    messageItem.insertBefore(div, divInMessageItem);
  }
}

function updateUserList(userList) {
  const message = JSON.parse(userList);
  if (message.type === 'user-list') {
    guestUsersList.innerHTML = '';
    for (const name of message.data) {
      const element = document.createElement('li');
      guestUsersList.appendChild(element);
      element.textContent = name;
    }
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
    photoResult = reader.result;
  });
  e.preventDefault();
});

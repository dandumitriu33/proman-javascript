import {refreshBoards} from "./main.js";

export function createAppendCard(element) {
  let columnBody = document.getElementById(`column_tr_${element.status_id}`);
  if (columnBody) {
    
    let cardBodyContainer = document.createElement('div');
    cardBodyContainer.setAttribute('id', `container_card_${element.id}`);
    cardBodyContainer.setAttribute('data-card', `${columnBody.id}`);
    cardBodyContainer.setAttribute('data-board', columnBody.dataset.board);
    cardBodyContainer.setAttribute('data-order', element['column_order']);
    columnBody.appendChild(cardBodyContainer);
    
    let archiveCardButton = document.createElement('span');
    archiveCardButton.setAttribute('class', 'archive-button');
    archiveCardButton.setAttribute('id', `archive_card_${element.id}`);
    archiveCardButton.setAttribute('title', `Archive ${element.title}`);
    archiveCardButton.innerText = 'a ';
    
    archiveCardButton.addEventListener('click', archiveCard);
    
    
    let deleteCardButton = document.createElement('span');
    deleteCardButton.setAttribute('class', 'card-delete-button')
    deleteCardButton.setAttribute('id', `delete_card_${element.id}`);
    deleteCardButton.setAttribute('title', `Delete ${element.title}`)
    deleteCardButton.innerText = 'x';
    
    let cardBody = document.createElement('span');
    cardBody.setAttribute('class', 'col-md');
    cardBody.setAttribute('style', ' border: 2px solid black; margin: 6px; cursor:pointer');
    cardBody.setAttribute('id', `card_${element.id}`);
    // cardBody.setAttribute('data-card', `${columnBody.id}`);
    // cardBody.setAttribute('data-board', columnBody.dataset.board);
    // cardBody.setAttribute('data-order', element['column_order']);
    
    cardBody.innerText += `${element.title}`;
    cardBodyContainer.appendChild(cardBody);
    cardBodyContainer.appendChild(archiveCardButton);
    cardBodyContainer.appendChild(deleteCardButton);
  }
}


export function handleNewCardClick(event) {
    let board_id = event.target.id.slice(21);
    let card_title = 'New Card';
    let data = {board_id, card_title};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('http://127.0.0.1:5000/api/create-card', options);
    // Artificial temporary visual update, must change before card edit
    fetch(`http://127.0.0.1:5000/api/board-first-status/${board_id}`)
        .then(response => response.json())
        .then(function(data) {
        console.log('data ', data);
        let tempColumn = document.getElementById(`column_tr_${data.first_status_id}`);

        let cardBodyContainer = document.createElement('div');
        cardBodyContainer.setAttribute('id', `container_card_${data.last_card_id + 1}`);
        cardBodyContainer.setAttribute('data-card', `column_tr_${data.first_status_id}`);
        cardBodyContainer.setAttribute('data-board', `${board_id}`);
        cardBodyContainer.setAttribute('data-order', `${data.last_card_order}`);
        tempColumn.appendChild(cardBodyContainer);


        let tempCard = document.createElement('span');
        tempCard.setAttribute('class', 'col-md');
        tempCard.setAttribute('style', ' border: 2px solid black; margin: 6px; cursor: pointer;');
        tempCard.setAttribute('id', `card_${data.last_card_id + 1}`);
        // tempCard.setAttribute('data-card', `column_tr_${data.first_status_id}`);
        // tempCard.setAttribute('data-board', `${board_id}`);
        // tempCard.setAttribute('data-order', `${data.last_card_order}`);
        tempCard.innerText += `${card_title}`;
        cardBodyContainer.appendChild(tempCard);
      

        let archiveCardButton = document.createElement('span');
        archiveCardButton.setAttribute('class', 'archive-button');
        archiveCardButton.setAttribute('id', `archive_card_${data.last_card_id}`);
        archiveCardButton.setAttribute('title', `Archive ${card_title}`);
        archiveCardButton.innerText = 'a ';
        cardBodyContainer.appendChild(archiveCardButton);

        archiveCardButton.addEventListener('click', archiveCard);

      
        let deleteCardButton = document.createElement('span');
        deleteCardButton.setAttribute('class', 'card-delete-button')
        deleteCardButton.setAttribute('id', `delete_card_${data.last_card_id}`);
        deleteCardButton.setAttribute('title', `Delete ${card_title}`)
        deleteCardButton.innerText = 'x';
        cardBodyContainer.appendChild(deleteCardButton);

        markCardsForClickRename();
        markCardsDeleteButton();
        refreshBoards();
    });
}


export function handleCardRenameKeyPressed(event) {
  if (event.which == 13 || event.keyCode == 13) {
    event.target.defaultValue = event.target.value;
    console.log(event.target.value);
    console.log(event.target);
    let tempValue = event.target.value;
    event.currentTarget.innerHTML = tempValue;
    console.log('post replacement ', event.target);
    let cardId = event.currentTarget.id.slice(5);
    console.log('parent_id card id ', event.currentTarget.id);
    console.log('sending id:', cardId);
    console.log('sending new title:', tempValue);
    let data = {cardId, tempValue};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch(`http://127.0.0.1:5000/api/rename-card/${cardId}`, options);
    localStorage.setItem('liveSync', 'on');
  } else if (event.which == 27 || event.keyCode == 27) {
    event.currentTarget.innerHTML = event.target.defaultValue;
    localStorage.setItem('liveSync', 'on');
  }
}


export function handleCardClickRename(event) {
    localStorage.setItem('liveSync', 'off');
  console.log('entered card click rename');
  console.log('click rename event:', event.toElement.innerHTML);
  event.toElement.innerHTML = `
            <input type="text" value="${event.toElement.innerHTML}">
    `;
}

export function handleCardRenameChange(event) {
  event.currentTarget.innerHTML = event.target.defaultValue;
  localStorage.setItem('liveSync', 'on');
}


export function markCardsForClickRename() {
  let allCards = document.getElementsByClassName("col-md");
  console.log('cards= ', allCards);
  for (let card of allCards) {
    if (card.id.includes('card_')) {
      card.addEventListener('click', handleCardClickRename);
      card.addEventListener('keydown', handleCardRenameKeyPressed);
      card.addEventListener('change', handleCardRenameChange)
    }
  }
}


export function markCardsDeleteButton() {
  let cardsDeleteButtons = document.querySelectorAll('.card-delete-button');
  for (let delButton of cardsDeleteButtons) {
    delButton.addEventListener('click', handleDeleteCardClick);
  }
}


function handleDeleteCardClick(event) {
  let cardId = event.currentTarget.id.slice(12);
  let elem = document.getElementById(`container_card_${cardId}`);
  elem.parentNode.removeChild(elem);
  let data = {cardId};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(`http://127.0.0.1:5000/api/delete-card/${cardId}`, options);
  
}


function archiveCard(event) {
  let card_id = event.target.id.slice(13);
  fetch(`/archive-card/${card_id}`).then(location.reload())
}

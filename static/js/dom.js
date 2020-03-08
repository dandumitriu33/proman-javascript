// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { createAppendCard, handleNewCardClick, markCardsForClickRename, markCardsDeleteButton } from "./card_module.js";
import { addEventClickBoardTitle, handleDeleteClick, expandedBoardsLocalList, handleBoardExpandClick } from "./board_module.js"
import { handleNewStatusClick } from "./status_module.js"


let triggered = false;
// let statusesDraggable = [];
export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);

        });

        // const boardExpandButton = document.getElementById('')\


    },

    returnOfflineContent: async function () {


        let boards = await fetch(`${window.origin}/return-offline-boards`);
        boards = await boards.json();

        let statusesCards = await fetch(`${window.origin}/return-offline-cards`);
        statusesCards = await statusesCards.json();


        let date = new Date();
        localStorage.offlineBoards = JSON.stringify(boards);
        localStorage.statusesBoards = JSON.stringify(statusesCards);
        localStorage.date = `${date.toString().slice(0,24)}`



    },

    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `
               <div>
                    <p>
                        <div class="navbar navbar-light bg-light rounded border">
                            <div class="d-flex flex-row">
                              <div id="board-title" class="navbar navbar-light bg-light" data-board-id = "${board.id}" data-board-title="${board.title}">
                                ${board.title}
                              </div>
                              <button type="button" class="btn btn-light mr-1 rounded border-secondary" id="buttonNewCardForBoard${board.id}">+ New Card</button>
                              <button id="buttonNewStatusForBoard${board.id}" class="btn btn-light mr-1 rounded border-secondary" data-toggle="collapse" href="#collapseExampleInput${board.id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                + New Status
                              </button>
                              <button type="button" class="btn btn-light mr-1 rounded border-secondary" id="buttonDeleteCardForBoard${board.id}">
                              - Delete
                              </button>
                              
                            </div>
                            <button type="button" class="btn btn-light rounded border-secondary" id="buttonViewArchive${board.id}" data-toggle="collapse" data-target="#collapseArchive${board.id}" aria-expanded="false" aria-controls="collapseExample" >
                              View Archive
                            </button>
                            <button id ="board_${board.id}" class="btn btn-light rounded border-secondary" type="button" data-toggle="collapse" data-target="#collapseExample${board.id}" aria-expanded="false" aria-controls="collapseExample">
                                v
                            </button>

                        </div>
                    </p>
                    <div>     
                      <div class="collapse inputClass" id="collapseExampleInput${board.id}">
                        <input type="text" class="inputId" placeholder="Add new Status">
                    </div>
                    
                     <div class="collapse" id="collapseArchive${board.id}">
                      <div class="card card-body container" >
                        <div class="container-fluid">
                            <div class="row" id="Archive${board.id}">
                            </div>
                        </div>
                     </div>
                    </div>
                    <div class="collapse" id="collapseExample${board.id}">
                      <div class="card card-body container" >
                        <div class="container-fluid">
                            <div class="row" id="${board.id}">
                            </div>
                        </div>
                        </div>
                     </div>
                </div>
        `;
        }

        const outerHtml = `
            <ul class="container">
                ${boardList}
            </ul>
           `;
    
    let boardsContainer = document.querySelector('#boards');
    boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    const boardExpandButton = document.getElementsByTagName('button');
    for (let button of boardExpandButton) {
      if (button.id.slice(0, 21) === 'buttonNewCardForBoard') {
        button.addEventListener('click', handleNewCardClick);
      } else if (button.id.includes('buttonNewStatusForBoard')) {
        button.addEventListener('click', handleNewStatusClick);
      } else if (button.id.includes('buttonDeleteCardForBoard')) {
        button.addEventListener('click', handleDeleteClick);
      } else if (button.id.includes('buttonViewArchive')) {
        button.addEventListener('click', handleViewArchive);
      } else if (button.id.includes('board_')){
        button.addEventListener('click', handleBoardExpandClick);
      }
    }
    addEventClickBoardTitle();
  },
  
  loadCards: function (boardId) {
    // retrieves cards and makes showCards called
  },
  showCards: function (cards) {
    // shows the cards of a board
    // it adds necessary event listeners also
  },
  // here comes more features
  
};


function handleViewArchive(event) {
    let board_id = event.currentTarget.id.slice(17);

    fetch(`http://127.0.0.1:5000/api/view-archive/${board_id}`)
        .then(response => response.json())
        .then(function (data) {
            // console.log('data ', data);
            let cardContainer = document.getElementById(`Archive${board_id}`);
            cardContainer.innerHTML = '';

            for (let card of data) {

                let container = document.createElement('div');
                container.setAttribute('id', `container_card_${card.id}`);

                let tempCard = document.createElement("span");
                tempCard.setAttribute('class', 'col-md');
                tempCard.setAttribute('style', 'border: 2px solid black; margin: 6px; cursor: pointer;');
                tempCard.setAttribute('id', `card_${card.id}`);
                tempCard.innerHTML = card.title;
                container.appendChild(tempCard);

                let unarchiveButton = document.createElement("span");
                unarchiveButton.setAttribute('class', 'archive-button');
                unarchiveButton.setAttribute('id', `undoArchiveButton_${card.id}`);
                unarchiveButton.innerText = 'unArchive';
                container.appendChild(unarchiveButton);

                cardContainer.appendChild(container);

                unarchiveButton.addEventListener('click', undoArchive);
            }
        })
}

function undoArchive(event) {

  let card_id = event.target.id.slice(18);
  
  fetch(`http://127.0.0.1:5000/api/undo-archive/${card_id}`).then(location.reload())
}

import {createAppendCard, markCardsDeleteButton, markCardsForClickRename} from "./card_module.js";

let statusesDraggable = [];

export function addEventClickBoardTitle() {
    let allBoardsTitle = document.querySelectorAll('#board-title');
    for (let boardTitle of allBoardsTitle) {
        if (boardTitle.id.includes('board-title')) {
            boardTitle.addEventListener('click', handleBoardTitle);
            boardTitle.addEventListener('keydown', handleBoardTitleOnKeyPress);
        }
    }
}


function handleBoardTitleOnKeyPress(event) {
    if (event.which == 13 || event.keyCode == 13) {
        let tempValue = event.target.value;
        if (tempValue.trim() === '') {
            tempValue = event.target.defaultValue;
        }
        if (tempValue === '') {
            tempValue = event.currentTarget.dataset.boardTitle;
        }
        event.currentTarget.setAttribute('data-board-title', `${tempValue}`);
        event.currentTarget.innerHTML = tempValue;
        let boardId = event.currentTarget.dataset.boardId;
        let data = {boardId: boardId, tempValue: tempValue};
        const options = {
            method: 'POST',
            body: JSON.stringify(data)
        };
        fetch(`http://127.0.0.1:5000/api/rename-board-title/${boardId}`, options);
        localStorage.setItem('liveSync', 'on');
    } else if (event.which == 27 || event.keyCode == 27) {
        event.currentTarget.innerHTML = event.target.defaultValue;
        localStorage.setItem('liveSync', 'on');
    }
}


function handleBoardTitle(event) {
    localStorage.setItem('liveSync', 'off');
    event.target.innerHTML = `
    <input type="text" class="form-control" id="board-rename-input" 
    value="${event.target.textContent.trim()}">`
    document.querySelector('#board-rename-input').focus();
}


export function handleDeleteClick(event) {
    let board_id = event.target.id.slice(24);
    let data = {board_id};
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://127.0.0.1:5000/api/delete-board', option).then(location.reload())
}


export function expandedBoardsLocalList(board_id) {
    // localStorage.clear();
    if (localStorage.getItem('expandedBoards') === false || localStorage.getItem('expandedBoards') === null) {
        localStorage.setItem('expandedBoards', 'placeholder,');
    }
    let expandedBoardsString = localStorage.getItem('expandedBoards');
    console.log('the string', expandedBoardsString);
    let expandedBoardsList = expandedBoardsString.split(",");
    if (expandedBoardsList.includes(board_id) === false) {
        localStorage.setItem('expandedBoards', expandedBoardsList.join(',') + `${board_id},`);
    }
    else if (expandedBoardsList.includes(board_id) === true){
        let alreadyExpandedBoardIndex = expandedBoardsList.indexOf(`${board_id}`);
        console.log('list index to remove', alreadyExpandedBoardIndex);
        expandedBoardsList.splice(alreadyExpandedBoardIndex, 1);
        console.log('list after splice', expandedBoardsList);
        localStorage.setItem('expandedBoards', expandedBoardsList.join(','));
    }
}


export async function handleBoardExpandClick(event) {
    console.log('entered expand function');
    let idForBoard = event.target.id.slice(6);
    expandedBoardsLocalList(idForBoard);
    populateBoard(idForBoard);
          let drake = dragula(statusesDraggable).on('drop', function (el, target, source, sibling) {
            el.dataset.card = target.id;
            el.dataset.board = target.dataset.board;
            let i = 0;
            if (source.length > 0) {
              for (let child of source.children) {
                child.dataset.order = i;
                i += 1;
                console.log(child, 'from source');
                let dataToSend = {
                  status_id: child.dataset.card.slice(10),
                  board_id: child.dataset.board,
                  column_order: child.dataset.order,
                  id: child.id.slice(5)
                };
                fetch(`${window.origin}/move`, {
                  method: 'POST',
                  credentials: "include",
                  cache: "no-cache",
                  headers: new Headers({
                    'content-type': 'application/json'
                  }),
                  body: JSON.stringify(dataToSend)
                });
              }
            }
            i = 0;
            for (let child of target.children) {
              child.dataset.order = i;
              i += 1;
              console.log(child, 'from target');
              let dataToSend = {
                status_id: child.dataset.card.slice(10),
                board_id: child.dataset.board,
                column_order: child.dataset.order,
                id: child.id.slice(5)
              };
              fetch(`${window.origin}/move`, {
                method: 'POST',
                credentials: "include",
                cache: "no-cache",
                headers: new Headers({
                  'content-type': 'application/json'
                }),
                body: JSON.stringify(dataToSend)
              });
            }
          });
          console.log(`Board event ${this.id} expanded`);
        };


function createAppend(element) {

    let boardBody = document.getElementById(`${element.board_id}`);
    let columnHolder = document.createElement('div');
    columnHolder.setAttribute('style', 'margin: 10px; border: 2px solid black; display:table; padding: 1px');
    columnHolder.setAttribute('class', 'col-md text-center');
    let column = document.createElement('div');
    column.setAttribute('class', 'col-md text-center');
    column.setAttribute('min-height', '10px');
    column.setAttribute('min-width', '10px');
    column.setAttribute('style', 'display: table; border: 2px solid white');
    column.setAttribute('id', `column_${element.id}`);
    column.setAttribute('id', `column_tr_${element.id}`);
    column.setAttribute('data-board', element.board_id);
    let title = document.createElement('span');
    title.setAttribute('id', `title_board${element.id}`);
    title.setAttribute('class', `non_draggable`);
    title.innerText = `${element.title}`;
    title.setAttribute('style', 'cursor:pointer; padding-left: 1px; padding-right:1px;  outline-color: #9ecaed; display:inline-block; ');
    title.setAttribute('contenteditable', 'true');
    title.setAttribute('title', `${element.title}`);
    title.setAttribute('tabIndex', '-1');
    console.log(title.title);
    title.addEventListener('focus', function(event){
        title.setAttribute('style', 'cursor:pointer; padding-left: 10px; padding-right:10px;  outline-color: #9ecaed; box-shadow: 0 0 8px #9ecaed')
        localStorage.setItem('liveSync', 'off')
    });
    title.addEventListener('focusout', function (event) {
        console.log(title.innerText);
        title.innerText = title.innerText.trim();
        if(title.innerText.trim() === '') {
            title.innerText = title.title;
            title.blur();
        }
        title.title = title.innerHTML;
        const value = title.innerText;
        const status_id = title.id.slice(11);
        const dataToSend = {
            value: value,
            status_id: status_id
        };
        fetch(`${window.origin}/update-statuses`, {
            method: 'POST',
            credentials: "include",
            cache: "no-cache",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(dataToSend)
        });
        title.blur();
         title.setAttribute('style', 'cursor:pointer; padding-left: 1px; padding-right:1px;  outline-color: #9ecaed')
        localStorage.setItem('liveSync', 'on')
    });
    title.addEventListener('keydown', function(event){
        console.log(event.key);
        console.log(this.title);
        let titleInitialValue = title.title;
        if (event.key === 'Escape'){
            title.innerHTML = title.title;
            title.blur();
            title.setAttribute('style', 'cursor:pointer; padding-left: 1px; padding-right:1px;  outline-color: #9ecaed')
            localStorage.setItem('liveSync', 'on');
        } else if (event.key === 'Enter'){
             console.log(title.innerText);
             localStorage.setItem('liveSync', 'on');
             title.innerText = title.innerText.trim();
             if (title.innerText.trim() === ''){
                 title.innerText=title.title
             }

        title.title = title.innerHTML;
        const value = title.innerText;

        const status_id = title.id.slice(11);

        const dataToSend = {
            value: value,
            status_id: status_id
        };
        title.blur();
        fetch(`${window.origin}/update-statuses`, {
            method: 'POST',
            credentials: "include",
            cache: "no-cache",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(dataToSend)
        });
         title.setAttribute('style', 'cursor:pointer; padding-left: 1px; padding-right:1px;  outline-color: #9ecaed')
        }
    });

  title.addEventListener('keydown', function (event) {
    console.log(event.key);
    console.log(this.title);
    let titleInitialValue = title.title;
    if (event.key === 'Escape') {
      title.innerHTML = title.title;
      title.blur();
    } else if (event.key === 'Enter') {
      console.log(title.innerText);

      title.title = title.innerHTML;
      const value = title.innerText;

      const status_id = title.id.slice(11);

      const dataToSend = {
        value: value,
        status_id: status_id
      };
      title.blur();
      fetch(`${window.origin}/update-statuses`, {
        method: 'POST',
        credentials: "include",
        cache: "no-cache",
        headers: new Headers({
          'content-type': 'application/json'
        }),
        body: JSON.stringify(dataToSend)
      });
    }
  });
  columnHolder.appendChild(title);
  columnHolder.appendChild(column);
  boardBody.appendChild(columnHolder);
}


const insertObjectInArray = (elem, arr) => {
  let search = 0;
  let pos;
  if (arr.length === 0) {
    arr.push(elem);
  }
  for (let el of arr) {
    if (elem.id != el.id) {
      search += 1;
    } else {
      pos = arr.indexOf(el)
    }
  }
  if (search === arr.length) {
    arr.push(elem);
  } else {
    arr.splice(pos, 1);
    arr.push(elem);
  }
};


export async function populateBoard(board_id) {
    let response = await fetch(`${window.origin}/get-statuses/${board_id}`);
    let boardResponse = await response.json();
    let boardBody = document.getElementById(`${board_id}`);
    boardBody.innerHTML = '';
    for (let element of boardResponse) {
        createAppend(element);
        let statusResponse = await fetch(`${window.origin}/get-cards/${element.id}`);
            statusResponse = await statusResponse.json();
        let statusBody = document.getElementById(`column_tr_${element.id}`);
            statusBody.innerHTML = '';
        for (let card of statusResponse) {
              createAppendCard(card);
            }
        insertObjectInArray(statusBody, statusesDraggable);
        markCardsForClickRename();
        markCardsDeleteButton();
    }
}


















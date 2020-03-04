import {dom} from "./dom.js";
import {createRegisterModal, createLoginModal} from "./dom.js";


// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
    // refreshes boards every n seconds
    // setInterval(function() {
    //     refreshBoards();}, 8000);

}

init();

// calling register modal
createRegisterModal();

// calling login modal
createLoginModal();


function refreshBoards() {
    let boardsContainer = document.querySelector('#boards');
    boardsContainer.innerHTML='';
    dom.loadBoards();
}

let btnRefresh = document.getElementById('nav4');
btnRefresh.addEventListener('click', function(){
    let boardsContainer = document.querySelector('#boards');
    boardsContainer.innerHTML='';
    dom.loadBoards();
    // location.reload();
});


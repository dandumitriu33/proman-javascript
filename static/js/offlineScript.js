console.log('Offline Mode Loaded');

console.log(localStorage.date);
console.log(localStorage.offlineBoards);

const populatePage = () => {

    let snapshot = document.getElementById('cachedAt');
    snapshot.innerText = `Persistent Data From:${localStorage.date}`;

    let disclaimer = document.getElementById('disclaimer');
    disclaimer.innerText = `You are viewing ProMan in offline mode. In this mode all online features are disabled apart from viewing publicly available boards. 
    In order to enjoy the full ProMan experience please go online.`;
    const brAdder = document.createElement('br');
    disclaimer.appendChild(brAdder);
    disclaimer.innerText += `In case you are online and you are seeing this page, the server might be down. You can contact support at: 0800-88392-776`;
     disclaimer.appendChild(brAdder);
    disclaimer.innerText += `PS: To get more accurate data refresh the page often, as the backup is created on each page reload and after 10 minutes when not reloading.`;
    const boardsContainer = document.getElementById('boardsHolder');
    let boards = JSON.parse(localStorage.offlineBoards);
    let cards = JSON.parse(localStorage.statusesBoards);

    for (let board of boards) {
        const navContainer = document.createElement('div');
        navContainer.setAttribute('class', 'navbar navbar-light bg-light rounded border my-3');

        const navRow = document.createElement('div');
        navRow.setAttribute('class', 'd-flex flex-row');

        const navTitle = document.createElement('div');
        navTitle.setAttribute('class', 'navbar navbar-light bg-light');
        navTitle.innerText = `${board.title}`;

        const expandButton = document.createElement('button');
        expandButton.setAttribute('class', 'btn btn-light rounded border-secondary');
        expandButton.setAttribute('data-toggle', "collapse");
        expandButton.setAttribute('data-target', `#collapseExample${board.id}`);
        expandButton.setAttribute('aria-expanded', `false`);
        expandButton.setAttribute('aria-controls', `collapseExample`);
        expandButton.setAttribute('type', 'button');
        expandButton.innerText = 'v';

        const boardContent = document.createElement('div');
        const boardCollapse = document.createElement('div');
        boardCollapse.setAttribute('class', 'collapse');
        boardCollapse.setAttribute('id', `collapseExample${board.id}`);

        const boardCardContainer = document.createElement('div');
        boardCardContainer.setAttribute('class', 'card card-body container');
        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'container-fluid');
        const cardContainerRow = document.createElement('div');
        cardContainerRow.setAttribute('class', 'row');
        for (let status of cards) {
            const columnHolder = document.createElement('div');
            if (status.board_id === board.id) {
                columnHolder.setAttribute('style', 'margin: 10px; border: 2px solid black; display:table; padding: 5px');
                columnHolder.setAttribute('class', 'col-md text-center');
                columnHolder.innerText = `${status.title}`;
                for (let card of status['array_agg']) {
                    const statusCardHolder = document.createElement('div');
                    statusCardHolder.setAttribute('class', 'col-md my-2');
                    statusCardHolder.setAttribute('style', ' border: 2px solid black; cursor:pointer');
                    statusCardHolder.innerText=card;
                    columnHolder.appendChild(statusCardHolder);
                }
                cardContainerRow.appendChild(columnHolder);
            }
        }

        cardContainer.appendChild(cardContainerRow);
        boardCardContainer.appendChild(cardContainer);
        boardCollapse.appendChild(boardCardContainer);

        navRow.appendChild(navTitle);
        navContainer.appendChild(navRow);
        navContainer.appendChild(expandButton);

        boardContent.appendChild(boardCollapse);

        boardsContainer.appendChild(navContainer);
        boardsContainer.appendChild(boardContent);

    }
};
const main = () => {
    populatePage();
};


main();
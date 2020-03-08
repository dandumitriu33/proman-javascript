import { refreshBoards } from "./main.js"

export function handleNewStatusClick(event) {
  localStorage.setItem('liveSync', 'off');
  let board_id = event.target.id.slice(23);
  let inputsColumnName = document.querySelectorAll("input");
  for (let input of inputsColumnName) {
    input.addEventListener('change', async function (event) {
      console.log('input value', event.target.value);
      let status_title = event.target.value;
      let data = {board_id, status_title};
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      await fetch('http://127.0.0.1:5000/api/create-status', options);
      await refreshBoards();
      localStorage.setItem('liveSync', 'on');
      // event.target.value = '';
      // document.getElementById(`buttonNewStatusForBoard${board_id}`).click();
    });
  }
}

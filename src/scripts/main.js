import { Game } from '../modules/Game.class.js';

const game = new Game();

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');
  let index = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = board[i][j];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;

      cell.className = `field-cell ${value ? 'cell-' + value : ''}`;
      index++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();
}

document.querySelector('.button.start').addEventListener('click', () => {
  game.start();
  renderBoard(game.getState());
});

game.initializeControls(renderBoard);

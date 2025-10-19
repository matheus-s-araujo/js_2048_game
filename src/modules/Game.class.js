// src/modules/Game.class.js
export class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';
    this.addNewNumber();
    this.addNewNumber();
  }

  restart() {
    this.start();
  }

  addNewNumber() {
    const empty = [];

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        if (this.board[i][j] === 0) {
          empty.push({ i, j });
        }
      }
    }

    if (empty.length === 0) {
      return false;
    }

    // renomeando para evitar conflito com 'j' do loop
    const { i: row, j: col } = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  compressAndMerge(line) {
    const filtered = line.filter((v) => v !== 0);
    const newLine = [];
    let scoreGain = 0;

    for (let i = 0; i < filtered.length; i += 1) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        newLine.push(merged);
        scoreGain += merged;
        i += 1;
      } else {
        newLine.push(filtered[i]);
      }
    }

    while (newLine.length < 4) {
      newLine.push(0);
    }

    return { newLine, scoreGain };
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i += 1) {
      const { newLine, scoreGain } = this.compressAndMerge(this.board[i]);

      if (newLine.toString() !== this.board[i].toString()) {
        moved = true;
      }
      this.board[i] = newLine;
      this.score += scoreGain;
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i += 1) {
      const reversed = [...this.board[i]].reverse();
      const { newLine, scoreGain } = this.compressAndMerge(reversed);
      const finalLine = newLine.reverse();

      if (finalLine.toString() !== this.board[i].toString()) {
        moved = true;
      }
      this.board[i] = finalLine;
      this.score += scoreGain;
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col += 1) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];
      const { newLine, scoreGain } = this.compressAndMerge(column);

      for (let row = 0; row < 4; row += 1) {
        if (this.board[row][col] !== newLine[row]) {
          moved = true;
        }
        this.board[row][col] = newLine[row];
      }
      this.score += scoreGain;
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col += 1) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ].reverse();

      const { newLine, scoreGain } = this.compressAndMerge(column);
      const finalCol = newLine.reverse();

      for (let row = 0; row < 4; row += 1) {
        if (this.board[row][col] !== finalCol[row]) {
          moved = true;
        }
        this.board[row][col] = finalCol[row];
      }
      this.score += scoreGain;
    }

    return moved;
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const current = this.board[i][j];

        if (
          (i < 3 && this.board[i + 1][j] === current) ||
          (j < 3 && this.board[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  initializeControls(renderBoard) {
    document.addEventListener('keydown', (e) => {
      if (this.status !== 'playing') {
        return;
      }

      let moved = false;

      switch (e.key) {
        case 'ArrowUp':
          moved = this.moveUp();
          break;
        case 'ArrowDown':
          moved = this.moveDown();
          break;
        case 'ArrowLeft':
          moved = this.moveLeft();
          break;
        case 'ArrowRight':
          moved = this.moveRight();
          break;
        default:
          break;
      }

      if (moved) {
        this.addNewNumber();
        renderBoard(this.getState());

        if (this.checkWin()) {
          alert('Você venceu!');
        } else if (this.checkLose()) {
          alert('Fim de jogo!');
        }
      }
    });
  }
}

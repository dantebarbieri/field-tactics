const CELL_WIDTH_RATIO = 0.16389548693;
const CELL_HEIGHT_RATIO = 0.11391372922;
const SPACING_WIDTH_RATIO = 0.00335041880;
const SPACING_HEIGHT_RATIO = 0.00416772062;
const RIVER_HEIGHT_RATIO = 0.06368533039;

class Board {
  constructor(i, x, y, w, h) {
    this.image = clone(i);
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;
    this.cellSize = createVector(this.width * CELL_WIDTH_RATIO, this.height * CELL_HEIGHT_RATIO);
    this.cellSpacing = createVector(this.width * SPACING_WIDTH_RATIO, this.height * SPACING_HEIGHT_RATIO);
    this.riverHeight = this.height * RIVER_HEIGHT_RATIO;
    this.grid = this.populateBoard(8, 6, this.generatePiecePool());
    this.graveyard = [];
  }

  show() {
    red = color(102, 0, 0);
    green = color(160, 208, 143);
    blue = color(44, 207, 238);
    // fill(lerpColor(blue, red, map(this.countDead(), 0, board.grid.length * board.grid[0].length - 2, 0, 1)));
    fill(blue);
    rect(this.pos.x, this.pos.y, this.width, this.riverHeight);
    push();
    // tint(lerpColor(green, red, map(this.countDead(), 0, board.grid.length * board.grid[0].length - 2, 0, 1)));
    tint(green);
    image(this.image, this.pos.x, this.pos.y, this.width, this.height);
    pop();
    for (let elem of this.graveyard)
      if (elem != null)
        elem.show();
    push();
    translate(this.pos.x, this.pos.y);
    let possibleMoves;
    let b, p;
    let pieceClicked = false;
    for (let row of this.grid)
      for (let piece of row) {
        if (piece != null && !piece.clicked)
          piece.show();
        if (piece != null && piece.clicked)
          pieceClicked = true;
      }
    push();
    for (let row of this.grid)
      for (let piece of row)
        if (piece != null) {
          if (pieceClicked && piece.clicked || !pieceClicked && piece.isHovered()) {
            possibleMoves = piece.possibleMoves();
            for (let move of possibleMoves) {
              if (move.x == 3)
                if (move.y <= 0 || move.y >= this.grid.length - 1) {
                  move.x = 2;
                }
              b = this.grid[move.y][move.x] == null;
              if (b || piece.mine != this.grid[move.y][move.x].mine) {
                fill(0, 255, 255, 25);
                p = this.getPosDelta(move.y, move.x, this.grid.length);
              }
              else {
                fill(255, 0, 255, 25);
                if ((move.y == 0 || move.y == this.grid.length - 1) && move.x == this.grid[move.y].length / 2)
                  p = this.grid[move.y][this.grid[move.y].length / 2 - 1].pos;
                else
                  p = this.grid[move.y][move.x].pos;
              }
              rect(p.x, p.y, this.cellSize.x, this.cellSize.y);
            }
          }
        }
    for (let row of this.grid)
      for (let piece of row)
        if (piece != null && piece.clicked)
          piece.show();
    pop(); pop();
  }

  generatePiecePool() {
    let pool = []
    for (let i = spriteData.GENERAL; i <= spriteData.REGIMENT; i++) {
      pool.push(i);
      if (i >= spriteData.CAPTAIN && i <= spriteData.TANK || i == spriteData.ENGINEER || i == spriteData.MINE)
        pool.push(i);
    }
    return pool;
  }

  countDead() {
    return graveyard.length;
  }

  populateBoard(rows, cols, p) {
    let b = make2DArray(rows, cols);
    let openSpacesMine = [];
    let openSpacesTheirs = [];
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        if (i < rows / 2 && !(i == rows / 2 - 1 && (j == 1 || j == cols - 2)) && !(i == 0 && j == cols / 2)) openSpacesTheirs.push(createVector(j, i));
        else if (i >= rows / 2 && !(i == rows / 2 && (j == 1 || j == cols - 2)) && !(i == rows - 1 && j == cols / 2)) openSpacesMine.push(createVector(j, i));
    let e, m, t;
    while (this.hasImmovables(p)) {
      e = p.pop();
      m = openSpacesMine.splice(Math.random() * openSpacesMine.length, 1);
      t = openSpacesTheirs.splice(Math.random() * openSpacesTheirs.length, 1);
      b[m[0].y][m[0].x] = new Piece(e);
      b[t[0].y][t[0].x] = new Piece(e);
    }
    openSpacesMine.push(createVector(1, rows / 2));
    openSpacesMine.push(createVector(cols - 2, rows / 2));
    openSpacesTheirs.push(createVector(1, rows / 2 - 1));
    openSpacesTheirs.push(createVector(cols - 2, rows / 2 - 1));
    while (p.length > 0) {
      e = p.pop();
      m = openSpacesMine.splice(Math.random() * openSpacesMine.length, 1);
      t = openSpacesTheirs.splice(Math.random() * openSpacesTheirs.length, 1);
      b[m[0].y][m[0].x] = new Piece(e);
      b[t[0].y][t[0].x] = new Piece(e);
    }
    return this.processBoard(b);
  }

  processBoard(a) {
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < a[i].length; j++)
        if (a[i][j] != null) {
          a[i][j].row = i;
          a[i][j].col = j;
          a[i][j].pos = this.getPosDelta(i, j, a.length);
          a[i][j].dim = this.cellSize;
          if (i >= a.length / 2) {
            a[i][j].mine = true;
            a[i][j].reveal = true;
          }
        }
    return a;
  }

  isInBoard() {
    return mouseX >= this.pos.x - this.width / 2 && mouseX <= this.pos.x + this.width / 2 && mouseY >= this.pos.y - this.height / 2 && mouseY <= this.pos.y + this.height / 2;
  }

  isInSpace(row, col) {
    if (!this.isInBoard()) return false;
    if ((row == 0 || row == board.grid.length - 1) && col == 3) col = 2;
    let p = this.getPosDelta(row, col, this.grid.length);
    return mouseX - this.pos.x >= p.x - this.cellSize.x / 2 && mouseX - this.pos.x <= p.x + this.cellSize.x / 2 && mouseY - this.pos.y >= p.y - this.cellSize.y / 2 && mouseY - this.pos.y <= p.y + this.cellSize.y / 2;
  }

  getPosDelta(row, col, rows) {
    if (row == 0) {
      if (col == 2) {
        return createVector(-this.width / 2 + this.cellSize.x + col * (this.cellSize.x + this.cellSpacing.x), -this.height / 2 + this.cellSize.y / 2);
      } else if (col != 3) {
        return createVector(-this.width / 2 + this.cellSize.x / 2 + col * (this.cellSize.x + this.cellSpacing.x), -this.height / 2 + this.cellSize.y / 2);
      }
      return createVector(-this.width / 2 + this.cellSize.x + col * (this.cellSize.x + this.cellSpacing.x), -this.height / 2 + this.cellSize.y / 2)
    } else if (row < rows / 2) {
      return createVector(-this.width / 2 + this.cellSize.x / 2 + col * (this.cellSize.x + this.cellSpacing.x), -this.height / 2 + this.cellSize.y / 2 + row * (this.cellSize.y + this.cellSpacing.y))
    } else if (row >= rows / 2 && row != rows - 1) {
      return createVector(-this.width / 2 + this.cellSize.x / 2 + col * (this.cellSize.x + this.cellSpacing.x), this.riverHeight - this.height / 2 + this.cellSize.y / 2 + row * (this.cellSize.y + this.cellSpacing.y) - this.cellSpacing.y)
    } else {
      if (col == 2) {
        return createVector(-this.width / 2 + this.cellSize.x + col * (this.cellSize.x + this.cellSpacing.x), this.riverHeight - this.height / 2 + this.cellSize.y / 2 + row * (this.cellSize.y + this.cellSpacing.y) - this.cellSpacing.y);
      } else if (col != 3) {
        return createVector(-this.width / 2 + this.cellSize.x / 2 + col * (this.cellSize.x + this.cellSpacing.x), this.riverHeight - this.height / 2 + this.cellSize.y / 2 + row * (this.cellSize.y + this.cellSpacing.y) - this.cellSpacing.y);
      }
    }
  }

  hasImmovables(a) {
    for (let i = 0; i < a.length; i++)
      if (a[i] == spriteData.MINE || a[i] == spriteData.REGIMENT)
        return true;
    return false;
  }
}
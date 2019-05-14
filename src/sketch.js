let sprites = []
let bg;
const spriteData = {
  BOARD: 0,
  GENERAL: 1,
  LIEUTENANT_GENERAL: 2,
  MAJOR_GENERAL: 3,
  COLONEL: 4,
  LIEUTENANT_COLONEL: 5,
  MAJOR: 6,
  CAPTAIN: 7,
  FIRST_LIEUTENANT: 8,
  SECOND_LIEUTENANT: 9,
  AIRPLANE: 10,
  TANK: 11,
  CAVALRY: 12,
  ENGINEER: 13,
  SPY: 14,
  MINE: 15,
  REGIMENT: 16
}

function preload() {
  bg = loadImage('../assets/gamebg.jpg');
  sprites.push(loadImage('../assets/Field Tactics Board.png'));
  sprites.push(loadImage('../assets/General Piece.png'));
  sprites.push(loadImage('../assets/Lieutenant General Piece.png'));
  sprites.push(loadImage('../assets/Major General Piece.png'));
  sprites.push(loadImage('../assets/Colonel Piece.png'));
  sprites.push(loadImage('../assets/Lieutenant Colonel Piece.png'));
  sprites.push(loadImage('../assets/Major Piece.png'));
  sprites.push(loadImage('../assets/Captain Piece.png'));
  sprites.push(loadImage('../assets/First Lieutenant Piece.png'));
  sprites.push(loadImage('../assets/Second Lieutenant Piece.png'));
  sprites.push(loadImage('../assets/Airplane Piece.png'));
  sprites.push(loadImage('../assets/Tank Piece.png'));
  sprites.push(loadImage('../assets/Cavalry Piece.png'));
  sprites.push(loadImage('../assets/Engineer Piece.png'));
  sprites.push(loadImage('../assets/Spy Piece.png'));
  sprites.push(loadImage('../assets/Mine Piece.png'));
  sprites.push(loadImage('../assets/Regiment Piece.png'));
}

let bgHeight, bgWidth;
let board;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let boardWidth, boardHeight;
  if (width / max(1, height) < sprites[spriteData.BOARD].width / max(1, sprites[spriteData.BOARD].height)) {
    boardWidth = width;
    boardHeight = sprites[spriteData.BOARD].height * width / sprites[spriteData.BOARD].width;
  } else {
    boardWidth = sprites[spriteData.BOARD].width * height / sprites[spriteData.BOARD].height;
    boardHeight = height;
  }
  board = new Board(sprites[spriteData.BOARD], width / 2, height / 2, boardWidth, boardHeight);
  if (width / max(1, height) < bg.width / max(1, bg.height)) {
    bgWidth = bg.width * height / bg.height;
    bgHeight = height;
  } else {
    bgWidth = width;
    bgHeight = bg.height * width / bg.width;
  }
  imageMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  image(bg, width / 2, height / 2, bgWidth, bgHeight);
  board.show();
}

function mousePressed() {
  for (let row of board.grid)
    for (let piece of row)
      if (piece != null && piece.mine && piece.isHovered())
        piece.clicked = true;
}

function mouseReleased() {
  let r, c, m = false;
  for (r = 0; !m && r < board.grid.length; r++)
    for (c = 0; !m && c < board.grid[r].length; c++)
      if (board.grid[r][c] != null && board.grid[r][c].isHovered() || board.grid[r][c] == null && board.isInSpace(r, c))
        m = true;
  r--;
  c--;
  for (let i = 0; i < board.grid.length; i++)
    for (let j = 0; j < board.grid[i].length; j++)
      if (board.grid[i][j] != null && board.grid[i][j].clicked) {
        board.grid[i][j].clicked = false;
        if (m && (board.grid[r][c] == null || (board.grid[r][c] != null && board.grid[i][j].mine != board.grid[r][c].mine))) {
          let moves = board.grid[i][j].possibleMoves();
          for (let move of moves) {
            if (move.x == 3 && (move.y <= 0 || move.y >= board.grid.length - 1))
              move.x = 2;
            if (move.x == c && move.y == r)
              board.grid[i][j].move(r, c);
          }
        }
      }
}

function make2DArray(rows, cols) {
  a = [];
  for (let i = 0; i < rows; ++i)
    a.push([]);
  if (cols)
    for (let i = 0; i < rows; ++i)
      for (let j = 0; j < cols; ++j)
        a[i].push(null);
  return a;
}
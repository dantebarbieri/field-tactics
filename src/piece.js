class Piece {
  constructor(t) {
    this.type = t;
    this.image = sprites[t];
    this.mine = false;
    this.reveal = false;
    this.row = 0;
    this.col = 0;
    this.pos = createVector(0, 0);
    this.dim = createVector(0, 0);
    this.dead = false;
    this.clicked = false;
  }

  show() {
    if (this.clicked) {
      push();
      fill(0, 255, 255);
      noStroke();
      translate(-board.pos.x, -board.pos.y);
      rect(mouseX, mouseY, this.dim.x, this.dim.y);
      image(this.image, mouseX, mouseY, this.dim.x * 0.96, this.dim.y * 0.93);
      pop();
      return;
    }
    if (this.dead) {
      push();
      this.image.filter(INVERT);
      tint(color(0, 81, 108))
      if (this.mine) {
        fill(255, 0, 0);
        noStroke();
        rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        image(this.image, this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
      } else {
        fill(0, 0, 255);
        noStroke();
        rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        image(this.image, 0, 0, this.dim.x * 0.96, this.dim.y * 0.93);
      }
      pop();
      return;
    }
    push();
    if (this.mine) {
      if (this.isHovered())
        fill(0, 255, 0);
      else
        fill(255, 0, 0);
      noStroke();
      rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
      if (this.reveal)
        image(this.image, this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
      else {
        fill(0);
        rect(this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
      }
    } else {
      if (this.isHovered())
        fill(255, 0, 255);
      else
        fill(0, 0, 255);
      noStroke();
      rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
      if (this.reveal) {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(PI);
        image(this.image, 0, 0, this.dim.x * 0.96, this.dim.y * 0.93);
        pop();
      } else {
        fill(0);
        rect(this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
      }
    }
    pop();
  }

  possibleMoves() {
    let moves = [];
    if (!this.reveal) {
      if (this.col == 2 && (this.row == 0 || this.row == board.grid.length - 1)) {
        moves.push(createVector(this.col - 1, this.row));
        moves.push(createVector(this.col + 2, this.row));
        if (this.row == 0) {
          moves.push(createVector(this.col, this.row + 1));
          moves.push(createVector(this.col + 1, this.row + 1));
        } else if (this.row == board.grid.length - 1) {
          moves.push(createVector(this.col, this.row - 1));
          moves.push(createVector(this.col + 1, this.row - 1));
        }
        return moves;
      }
      if (this.col < board.grid[this.row].length) moves.push(createVector(this.col + 1, this.row));
      if (this.row > 0)
        if (this.row != board.grid.length / 2 || this.col == 1 || this.col == board.grid[this.row].length - 2)
          moves.push(createVector(this.col, this.row - 1));
      if (this.col > 0) moves.push(createVector(this.col - 1, this.row));
      if (this.row < board.grid.length - 1)
        if (this.row != board.grid.length / 2 - 1 || this.col == 1 || this.col == board.grid[this.row].length - 2)
          moves.push(createVector(this.col, this.row + 1));
      return moves;
    }
    if (this.type == spriteData.MINE || this.type == spriteData.REGIMENT) return moves;
    else if (this.type == spriteData.TANK || this.type == spriteData.CAVALRY) {
      if (this.col == 2 && (this.row == 0 || this.row == board.grid.length - 1)) {
        moves.push(createVector(this.col - 1, this.row));
        moves.push(createVector(this.col + 2, this.row));
        if (this.row == 0) {
          for (let i = 1; i <= 2; i++) {
            moves.push(createVector(this.col, this.row + i));
            moves.push(createVector(this.col + 1, this.row + i));
          }
        } else if (this.row == board.grid.length - 1) {
          for (let i = 1; i <= 2; i++) {
            moves.push(createVector(this.col, this.row - i));
            moves.push(createVector(this.col + 1, this.row - i));
          }
        }
        return moves;
      }
      if (this.col < board.grid[this.row].length) moves.push(createVector(this.col + 1, this.row));
      if (this.mine) {
        if (this.row >= board.grid.length / 2 && !(this.col == 1 || this.col == board.grid[this.row].length - 2))
          for (let i = this.row - 1; i >= max(board.grid.length / 2, this.row - 2); i--)
            moves.push(createVector(this.col, i));
        else
          for (let i = this.row - 1; i >= max(0, this.row - 2); i--)
            moves.push(createVector(this.col, i));
      } else {
        if (this.row > 0) moves.push(createVector(this.col, this.row - 1));
      }
      if (this.col > 0) moves.push(createVector(this.col - 1, this.row));
      if (this.mine) {
        if (this.row < board.grid.length - 1) moves.push(createVector(this.col, this.row + 1));
      } else {
        if (this.row < board.grid.length - 1)
          if (this.row > board.grid.length / 2 || this.col == 1 || this.col == board.grid[board.grid.length / 2 + 1].length - 2)
            for (let i = this.row; i < board.grid.length; i++)
              moves.push(createVector(this.col, i));
          else if (this.row < board.grid.length / 2)
            for (let i = this.row; i < board.grid.length / 2; i++)
              moves.push(createVector(this.col, i));
      }
      return moves;
    } else if (this.type == spriteData.AIRPLANE) {
      if (this.col == 2 && (this.row == 0 || this.row == board.grid.length - 1)) {
        moves.push(createVector(this.col - 1, this.row));
        moves.push(createVector(this.col + 2, this.row));
        if (this.row == 0) {
          moves.push(createVector(this.col, board.grid.length - 1));
          for (let i = 1; i < board.grid.length - 1; i++) {
            moves.push(createVector(this.col, this.row + i));
            moves.push(createVector(this.col + 1, this.row + i));
          }
        } else if (this.row == board.grid.length - 1) {
          moves.push(createVector(this.col, 0));
          for (let i = 1; i < board.grid.length - 1; i++) {
            moves.push(createVector(this.col, this.row - i));
            moves.push(createVector(this.col + 1, this.row - i));
          }
        }
        return moves;
      }
      if (this.col < board.grid[this.row].length) moves.push(createVector(this.col + 1, this.row));
      for (let i = this.row + 1; i < board.grid.length; i++)
        moves.push(createVector(this.col, i));
      if (this.col > 0) moves.push(createVector(this.col - 1, this.row));
      for (let i = this.row - 1; i >= 0; i--)
        moves.push(createVector(this.col, i));
      return moves;
    } else if (this.type == spriteData.ENGINEER) {
      if (this.col == 2 && (this.row == 0 || this.row == board.grid.length - 1)) {
        for (let i = 0; i < board.grid[this.row].length; i++)
          if (i != this.col && i != this.col + 1)
            moves.push(createVector(i, this.row));
        if (this.row == 0) {
          for (let i = 1; i < board.grid.length / 2; i++) {
            moves.push(createVector(this.col, i));
            moves.push(createVector(this.col + 1, i));
          }
        } else if (this.row == board.grid.length - 1) {
          for (let i = board.grid.length / 2; i < board.grid.length - 1; i++) {
            moves.push(createVector(this.col, i));
            moves.push(createVector(this.col + 1, i));
          }
        }
        return moves;
      }
      for (let i = this.col + 1; i < board.grid[this.row].length; i++)
        moves.push(createVector(i, this.row));
      if (this.col == 1 || this.col == board.grid[this.row].length - 2) {
        for (let i = 0; i < board.grid.length; i++)
          if (this.row != i)
            moves.push(createVector(this.col, i));
      } else if (this.row < board.grid.length / 2) {
        for (let i = 0; i < board.grid.length / 2; i++)
          if (this.row != i)
            moves.push(createVector(this.col, i));
      } else {
        for (let i = board.grid.length / 2; i < board.grid.length; i++)
          if (this.row != i)
            moves.push(createVector(this.col, i));
      }
      for (let i = this.col - 1; i >= 0; i--)
        moves.push(createVector(i, this.row));
      return moves;
    } else {
      if (this.col == 2 && (this.row == 0 || this.row == board.grid.length - 1)) {
        moves.push(createVector(this.col - 1, this.row));
        moves.push(createVector(this.col + 2, this.row));
        if (this.row == 0) {
          moves.push(createVector(this.col, this.row + 1));
          moves.push(createVector(this.col + 1, this.row + 1));
        } else if (this.row == board.grid.length - 1) {
          moves.push(createVector(this.col, this.row - 1));
          moves.push(createVector(this.col + 1, this.row - 1));
        }
        return moves;
      }
      if (this.col < board.grid[this.row].length) moves.push(createVector(this.col + 1, this.row));
      if (this.row > 0)
        if (this.row != board.grid.length / 2 || this.col == 1 || this.col == board.grid[this.row].length - 2)
          moves.push(createVector(this.col, this.row - 1));
      if (this.col > 0) moves.push(createVector(this.col - 1, this.row));
      if (this.row < board.grid.length - 1)
        if (this.row != board.grid.length / 2 - 1 || this.col == 1 || this.col == board.grid[this.row].length - 2)
          moves.push(createVector(this.col, this.row + 1));
      return moves;
    }
  }

  move(row, col) {
    if (board.grid[row][col] == null) {
      board.grid[row][col] = clone(this);
      board.grid[row][col].row = row;
      board.grid[row][col].col = col;
      board.grid[row][col].pos = board.getPosDelta(row, col, board.grid.length);
      board.grid[this.row][this.col] = null;
    } else {
      let win = this.attack(board.grid[row][col]);
      if (win) {
        board.graveyard.push(clone(board.grid[row][col]));
        console.log(board.graveyard);
        board.graveyard[board.graveyard.length - 1].dead = true;
        board.graveyard[board.graveyard.length - 1].dim.mult(0.5);
        if (board.graveyard[board.graveyard.length - 1].mine)
          board.graveyard[board.graveyard.length - 1].pos = createVector(this.dim.x / 2, this.dim.y / 2);
        else
          board.graveyard[board.graveyard.length - 1].pos = createVector(width - this.dim.x / 2, height - this.dim.y / 2);
        board.grid[row][col] = new Piece(this.type);
        board.grid[row][col].row = row;
        board.grid[row][col].col = col;
        board.grid[row][col].pos = board.getPosDelta(row, col, board.grid.length);
        board.grid[row][col].dim = board.grid[this.row][this.col].dim;
        board.grid[row][col].mine = board.grid[this.row][this.col].mine;
        board.grid[row][col].reveal = board.grid[this.row][this.col].reveal;
      } else if (win == null) {
        board.graveyard.push(clone(board.grid[row][col]));
        console.log(board.graveyard);
        board.graveyard[board.graveyard.length - 1].dead = true;
        board.graveyard[board.graveyard.length - 1].dim.mult(0.5);
        if (board.graveyard[board.graveyard.length - 1].mine)
          board.graveyard[board.graveyard.length - 1].pos = createVector(this.dim.x / 2, this.dim.y / 2);
        else
          board.graveyard[board.graveyard.length - 1].pos = createVector(width - this.dim.x / 2, height - this.dim.y / 2);
        board.graveyard.push(clone(board.grid[this.row][this.col]));
        console.log(board.graveyard);
        board.graveyard[board.graveyard.length - 1].dead = true;
        board.graveyard[board.graveyard.length - 1].dim.mult(0.5);
        if (board.graveyard[board.graveyard.length - 1].mine)
          board.graveyard[board.graveyard.length - 1].pos = createVector(this.dim.x / 2, this.dim.y / 2);
        else
          board.graveyard[board.graveyard.length - 1].pos = createVector(width - this.dim.x / 2, height - this.dim.y / 2);
        board.grid[row][col] = null;
      } else {
        board.graveyard.push(clone(board.grid[this.row][this.col]));
        console.log(board.graveyard);
        board.graveyard[board.graveyard.length - 1].dead = true;
        board.graveyard[board.graveyard.length - 1].dim.mult(0.5);
        if (board.graveyard[board.graveyard.length - 1].mine)
          board.graveyard[board.graveyard.length - 1].pos = createVector(this.dim.x / 2, this.dim.y / 2);
        else
          board.graveyard[board.graveyard.length - 1].pos = createVector(width - this.dim.x / 2, height - this.dim.y / 2);
      }
      board.grid[this.row][this.col] = null;
    }
  }

  isHovered() {
    return mouseX - board.pos.x >= this.pos.x - this.dim.x / 2 && mouseX - board.pos.x <= this.pos.x + this.dim.x / 2 && mouseY - board.pos.y >= this.pos.y - this.dim.y / 2 && mouseY - board.pos.y <= this.pos.y + this.dim.y / 2;
  }

  /**
   * @todo Fix bug where incorrect piece wins.
   * @description Shorter version of the attack method.
   * @param {Piece} other 
   */
  shortAttack(other) {
    if (this.type == other.type && this.type != spriteData.REGIMENT) return null;
    if (this.row == board.grid.length - 1 || board.grid[this.row + 1][this.col] == null)
      return false;
    if (other.row == 0 || board[other.row - 1] == null) return true;
    let o = other.type, t = this.type;
    if (this.type == spriteData.REGIMENT) t = board[this.row + 1];
    if (other.type == spriteData.REGIMENT) o = board[other.row - 1];
    if ((t <= spriteData.SECOND_LIEUTENANT || t == spriteData.CAVALRY || t == spriteData.ENGINEER)) {
      if (o == spriteData.MINE && t != spriteData.ENGINEER) return null;
      else if (t > o || t == spriteData.GENERAL && o == spriteData.SPY || t >= spriteData.COLONEL && (o == spriteData.AIRPLANE || o == spriteData.TANK)) return false;
      else if (t < o) return true;
    } else if (t >= spriteData.AIRPLANE && t <= spriteData.SPY) {
      if (o == spriteData.MINE && t != spriteData.AIRPLANE) return null;
      else if (t < o || t == spriteData.SPY && o == spriteData.GENERAL || (t == spriteData.AIRPLANE || t == spriteData.TANK) && o >= spriteData.COLONEL && o <= spriteData.SECOND_LIEUTENANT) return true;
      else if (t > o) return false;
    }
    throw "Types " + t + " and " + o + " are either undefined or should not be mobile pieces.";
  }

  /**
   * @deprecated
   * @param {Piece} other - The piece being attacked
   */
  attack(other) {
    if (this.type == other.type && this.type != spriteData.REGIMENT) return null;
    let o = -1, t = -1;
    if (this.type == spriteData.REGIMENT) {
      if (this.row != board.grid.length - 1 && board.grid[this.row + 1][this.col] != null)
        t = board.grid[this.row + 1][this.col].type;
      if (t == -1) return false;
    } else t = this.type;
    if (other.type == spriteData.REGIMENT) {
      if (other.row != 0 && board.grid[other.row - 1][other.col] != null)
        o = board.grid[other.row - 1][other.col].type;
      if (o == -1) return true;
    } else o = other.type;
    switch (t) {
      case spriteData.GENERAL:
        switch (o) {
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
            return true;
          case spriteData.SPY:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.LIEUTENANT_GENERAL:
        switch (o) {
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.MAJOR_GENERAL:
        switch (o) {
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.COLONEL:
        switch (o) {
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.LIEUTENANT_COLONEL:
        switch (o) {
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.MAJOR:
        switch (o) {
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.CAPTAIN:
        switch (o) {
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.FIRST_LIEUTENANT:
        switch (o) {
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.SECOND_LIEUTENANT:
        switch (o) {
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.AIRPLANE:
        switch (o) {
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.TANK:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
          case spriteData.MINE:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
            return false;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.TANK:
        switch (o) {
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.AIRPLANE:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.CAVALRY:
        switch (o) {
          case spriteData.ENGINEER:
          case spriteData.SPY:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.ENGINEER:
        switch (o) {
          case spriteData.SPY:
          case spriteData.MINE:
            return true;
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
          case spriteData.CAVALRY:
            return false;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.SPY:
        switch (o) {
          case spriteData.GENERAL:
            return true;
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.AIRPLANE:
          case spriteData.TANK:
          case spriteData.CAVALRY:
          case spriteData.ENGINEER:
            return false;
          case spriteData.MINE:
            return null;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.MINE:
        switch (o) {
          case spriteData.GENERAL:
          case spriteData.LIEUTENANT_GENERAL:
          case spriteData.MAJOR_GENERAL:
          case spriteData.COLONEL:
          case spriteData.LIEUTENANT_COLONEL:
          case spriteData.MAJOR:
          case spriteData.CAPTAIN:
          case spriteData.FIRST_LIEUTENANT:
          case spriteData.SECOND_LIEUTENANT:
          case spriteData.TANK:
          case spriteData.CAVALRY:
          case spriteData.SPY:
            return null;
          case spriteData.AIRPLANE:
          case spriteData.ENGINEER:
            return false;
          default:
            throw "Target Piece Does Not Match Any Known Types: " + other.type;
        }
      case spriteData.REGIMENT:
        throw "Regiment failed to get caught! @(" + this.row + ", " + this.col + ")";
      default:
        throw "Attacker Piece Does Not Match Any Known Types: " + this.type;
    }
  }
}

function clone(old) {
  if (null == old || Piece != typeof old) return old;
  let copy = new Piece(old.type);
  copy.row = old.row;
  copy.col = old.col;
  copy.pos = createVector(old.pos.x, old.pos.y);
  copy.dim = createVector(old.dim.x, old.dim.y);
  copy.mine = old.mine;
  copy.reveal = old.reveal;
  return copy;
}
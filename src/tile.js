class Tile {
  constructor(p, d, g, m) {
    this.pos = p.copy();
    this.dim = d.copy();
    this.grid = g.copy();
    this.piece = null;
    this.reveal = m;
    this.mine = m;
  }

  show() {
    if (this.piece != null) {
      push();
      rectMode(CENTER);
      if (this.mine) {
        if (this.isHovered())
          fill(0, 255, 0);
        else
          fill(255, 0, 0);
        noStroke();
        rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
        if (this.reveal)
          image(this.piece/*.image*/, this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
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
        if (this.reveal)
          image(this.piece/*.image*/, this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
        else {
          fill(0);
          rect(this.pos.x, this.pos.y, this.dim.x * 0.96, this.dim.y * 0.93);
        }
      }
      pop();
    }
  }

  isHovered() {
    return mouseX >= this.pos.x - this.dim.x / 2 && mouseX <= this.pos.x + this.dim.x / 2 && mouseY >= this.pos.y - this.dim.y / 2 && mouseY <= this.pos.y + this.dim.y / 2;
  }
}
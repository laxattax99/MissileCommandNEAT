class Shelter {
  // A shelter the player must try and prevent from being destroyed
  // will be destroyed if hit by a rocket
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = SHELTER_WIDTH;
    this.height = SHELTER_HEIGHT;
    this.destroyed = false;
  }

  draw() {
    noStroke();
    if (this.destroyed) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }
    rect(this.x, this.y, this.width, this.height);
  }

  hit() {
    this.destroyed = true;
  }
}

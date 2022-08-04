class Bullet {
  // A bullet shot by the player to take down incoming rockets
  constructor(xDest, yDest) {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - TURRET_HEIGHT;

    this.xDest = xDest;
    this.yDest = yDest;

    this.angle = atan2(this.y - this.yDest, this.x - this.xDest) + PI;

    this.explode = false;
    this.diameter = 10;
    this.destroyed = false;
  }

  update() {
    if (abs(this.x - this.xDest) <= 5 && this.y <= this.yDest) {
      this.explode = true;
    }

    if (!this.explode) {
      this.x += 5 * cos(this.angle);
      this.y += 5 * sin(this.angle);
    } else if (this.explode && this.diameter < EXPLOSION_LIMIT) {
      this.diameter += 1;
    } else {
      this.destroyed = true;
    }
  }

  draw() {
    if (!this.destroyed) {
      fill(255);
      ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }

  getDestroyed() {
    return this.destroyed;
  }
}

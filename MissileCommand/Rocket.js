class Rocket {
  // Rocket that is spawned that will destroy a shelter on impact
  constructor() {
    this.x = random(width);
    this.y = random(-40, 0);

    this.startX = this.x;
    this.startY = this.y;

    this.color = 255;

    this.angle =
      atan2(
        this.startY - CANVAS_WIDTH,
        this.startX - random(0, CANVAS_HEIGHT)
      ) + PI;
  }

  update() {
    this.x += 0.75 * cos(this.angle);
    this.y += 0.75 * sin(this.angle);
  }

  draw() {
    fill(255, 100, 100);

    push();
    stroke(this.color, 100, 100);
    strokeWeight(5);
    line(this.startX, this.startY, this.x, this.y);
    pop();
    ellipse(this.x, this.y, ROCKET_DIAMETER, ROCKET_DIAMETER);
  }

  willHit(shelter) {
    let offMap = false;
    let nextX = this.x;
    let nextY = this.y;
    while (!offMap) {
      if (
        nextX < shelter.x + SHELTER_WIDTH &&
        nextX + ROCKET_DIAMETER > shelter.x &&
        nextY < shelter.y + SHELTER_HEIGHT &&
        nextY + ROCKET_DIAMETER > shelter.y
      ) {
        return true;
      }

      if (nextY >= CANVAS_HEIGHT || nextX >= CANVAS_WIDTH || nextX < 0) {
        offMap = true;
      }

      nextX += .75 * cos(this.angle);
      nextY += .75 * sin(this.angle);
    }
    return false;
  }
}

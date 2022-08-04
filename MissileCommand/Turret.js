class Turret {
  // Turret controlled by the player that will shoot down incoming rockets
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = TURRET_WIDTH;
    this.height = TURRET_HEIGHT;
    this.ammo = AMMO_COUNT;
    this.aimX = CANVAS_WIDTH / 2;
    this.aimY = CANVAS_HEIGHT / 2;
    this.counter = 0;
  }

  look(rockets, shelters) {
    let inputs = [];
    inputs.push(this.ammo);
    for (let shelter of shelters) {
      if (shelter.destroyed) {
        inputs.push(0);
      } else {
        inputs.push(1);
      }
    }
    for (let i = 0; i < rockets.length; i++) {
      inputs.push(rockets[i].x);
      inputs.push(rockets[i].y);
    }

    let emptyInputs = INPUT_NODES - inputs.length;
    for(let i = 0; i < emptyInputs; i++){
      inputs.push(-1);
    }

    return inputs;
  }

  aim(dir) {
    switch (dir) {
      case "left":
        if (this.aimX > 0) {
          this.aimX -= 5;
        }
        break;
      case "right":
        if (this.aimX < CANVAS_WIDTH) {
          this.aimX += 5;
        }
        break;
      case "up":
        if (this.aimY > 0) {
          this.aimY -= 5;
        }
        break;
      case "down":
        if (this.aimY < CANVAS_HEIGHT) {
          this.aimY += 5;
        }
        break;
    }
  }

  update() {
    this.counter++;
  }

  mutate(rate) {
    this.brain.mutate(rate);
  }

  draw() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.width, this.height);
  }

  shoot() {
    if (this.ammo > 0 && this.counter > 20) {
      this.counter = 0;
      // console.log(this.aimX + ',' + this.aimY);
      this.ammo--;
      return new Bullet(this.aimX, this.aimY);
    }
    return null;
  }

}

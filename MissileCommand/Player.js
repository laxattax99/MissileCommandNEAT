class Player {
  // represents a player playing a single instance of a game
  // contains all the code necessary to play the game
  constructor(id) {
    this.brain = new Genome(INPUT_NODES, OUTPUT_NODES, id);
    this.turret = new Turret(CANVAS_WIDTH / 2, CANVAS_HEIGHT - TURRET_HEIGHT);
    this.shelters = [];
    this.rockets = [];

    for (let i = 0; i < ROCKET_COUNT; i++) {
      this.rockets[i] = new Rocket();
    }

    this.threateningRockets = [];
    this.threateningRockets = this.findThreateningRockets();

    this.bullets = [];
    this.level = 1;
    this.hits = 0;
    this.earlyHits = 0;
    this.threateningHits = 0;
    this.hitsThisLevel = 0;
    this.levelPassedNoHits = true;

    this.score = 0;
    this.hitRate = 0;
    this.shots = 1;
    this.explosionHits = 0;
    this.offScreenRockets = 0;
    this.fitness = 0;
    this.lifespan = 0;
    this.twoSheltersAlive = 0;

    this.initShelters();
    this.sheltersAlive = this.shelters.length;

    this.lost = false;
    this.decisions = [];
    this.vision = [];
  }

  clone() {
    let clone = new Player();
    clone.brain = this.brain.clone();
    return clone;
  }

  crossover(parent) {
    // get a child that results from crossing the brains of this player and another parent
    let child = new Player();
    if (parent.fitness < this.fitness) {
      child.brain = this.brain.crossover(parent.brain);
    } else {
      child.brain = parent.brain.crossover(this.brain);
    }
    child.brain.mutate();
    return child;
  }

  calcFitness() {
    // calculate the fitness of this player
    this.hitRate = this.hits / this.shots;
    this.fitness = this.threateningHits * 10;
    this.fitness *= this.levelPassedNoHits ? 0.5 : 4; // punish for getting lucky
    this.fitness *= this.level * 10;
    this.fitness *= this.hitRate * this.hitRate;
  }

  look() {
    this.vision = this.turret.look(this.threateningRockets, this.shelters);
  }

  findThreateningRockets() {
    let threateningRockets = [];
    for (let i = 0; i < this.rockets.length; i++) {
      for (let j = 0; j < this.shelters.length; j++) {
        if (this.rockets[i].willHit(this.shelters[j])) {
          threateningRockets.push(this.rockets[i]);
        }
      }
    }
    return threateningRockets;
  }

  think() {
    this.decisions = this.brain.feedForward(this.vision);
  }

  makeDecision() {
    // decided where to aim and whether to shoot based on outputs from our brain (neural network)
    if (this.decisions[0] > 0.7) {
      if (this.decisions[1] > 0.7) {
        if (this.decisions[0] > this.decisions[1]) {
          this.turret.aim("left");
        } else {
          this.turret.aim("right");
        }
      } else {
        this.turret.aim("left");
      }
    } else if (this.decisions[1] > 0.7) {
      this.turret.aim("right");
    }

    if (this.decisions[2] > 0.7) {
      if (this.decisions[3] > 0.7) {
        if (this.decisions[2] > this.decisions[3]) {
          this.turret.aim("up");
        } else {
          this.turret.aim("down");
        }
      } else {
        this.turret.aim("up");
      }
    } else if (this.decisions[3] > 0.7) {
      this.turret.aim("down");
    }

    if (this.decisions[4] > 0.5) {
      let bullet = this.turret.shoot();
      if (bullet != null) {
        this.bullets.push(bullet);
        this.shots++;
      }
    }
  }

  update() {
    if (this.lose()) {
      this.lost = true;
    }

    this.checkCollisionRockets();
    this.checkCollisionShelters();
    this.checkRocketsGround();
    this.updateBullets();

    for (let rocket of this.rockets) {
      rocket.update();
    }

    this.turret.update();

    if (this.rockets.length == 0) {
      this.level++;
      if (this.hitsThisLevel > 0) {
        this.levelPassedNoHits = false;
      } else {
        this.levelPassedNoHits = true;
      }
      this.hitsThisLevel = 0;
      this.turret.ammo = AMMO_COUNT;
      for (let i = 0; i < ROCKET_COUNT; i++) {
        this.rockets[i] = new Rocket();
      }
      this.threateningRockets.splice();
      this.threateningRockets = this.findThreateningRockets();
    }

    this.lifespan++;
  }

  draw() {
    this.drawBullets();
    this.drawRockets();
    this.drawShelters();
    this.drawTurret();
  }

  lose() {
    for (let shelter of this.shelters) {
      if (!shelter.destroyed) {
        return false;
      }
    }
    return true;
  }

  checkCollisionRockets() {
    // check if bullets have hit rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      for (let j = this.bullets.length - 1; j >= 0; j--) {
        if (
          pow(this.rockets[i].x - this.bullets[j].x, 2) +
            pow(this.rockets[i].y - this.bullets[j].y, 2) <=
          pow(this.bullets[j].diameter / 2, 2)
        ) {
          this.hits++;
          this.hitsThisLevel++;
          for (let k = 0; k < this.shelters.length; k++) {
            let willHit = this.rockets[i].willHit(this.shelters[k]);
            if (willHit) {
              this.threateningHits++;
            }
          }
          this.rockets.splice(i, 1);
          break;
        }
      }
    }
  }

  checkCollisionShelters() {
    // check if shelters have been hit by rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      for (let j = this.shelters.length - 1; j >= 0; j--) {
        let shelter = this.shelters[j];
        let rocket = this.rockets[i];
        if (
          rocket.x < shelter.x + SHELTER_WIDTH &&
          rocket.x + ROCKET_DIAMETER > shelter.x &&
          rocket.y < shelter.y + SHELTER_HEIGHT &&
          rocket.y + ROCKET_DIAMETER > shelter.y
        ) {
          this.shelters[j].hit();
          this.sheltersAlive--;
          this.rockets.splice(i, 1);
          break;
        }
      }
    }
  }

  checkRocketsGround() {
    // check if rockets have hit the ground and remove them
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      if (
        this.rockets[i].y >= CANVAS_HEIGHT ||
        this.rockets[i].x >= CANVAS_WIDTH ||
        this.rockets[i].x < 0
      ) {
        this.rockets.splice(i, 1);
        this.offScreenRockets++;
        break;
      }
    }
  }

  updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update();
      if (this.bullets[i].getDestroyed()) {
        this.bullets.splice(i, 1);
      }
    }
  }

  drawBullets() {
    for (let bullet of this.bullets) {
      bullet.draw();
    }
  }

  drawRockets() {
    for (let rocket of this.rockets) {
      rocket.draw();
    }
  }

  drawShelters() {
    for (let shelter of this.shelters) {
      shelter.draw();
    }
  }

  drawTurret() {
    this.turret.draw();
  }

  initShelters() {
    this.shelters.push(
      new Shelter(CANVAS_WIDTH / 4, CANVAS_HEIGHT - SHELTER_HEIGHT)
    );
    this.shelters.push(
      new Shelter(
        CANVAS_WIDTH - CANVAS_WIDTH / 4,
        CANVAS_HEIGHT - SHELTER_HEIGHT
      )
    );
  }
}

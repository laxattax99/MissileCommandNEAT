let bestPlayer;
let bestFitness = 0;
let showBest = true;
let showAll = false;
let runOnlyBest = false;

class Population {
  // A population of players that will run many instances of a game
  constructor(size) {
    this.population = [];
    this.generation = 0;
    this.matingpool = [];

    for (let i = 0; i < size; i++) {
      this.population.push(new Player());
      this.population[i].brain.generateNetwork();
      this.population[i].brain.mutate();
    }

    bestPlayer = this.population[0].clone();
    bestPlayer.brain.id = "BestPlayer";
  }

  updateAlive(show) {
    // Update the living members of the population
    if (!runOnlyBest) {
      for (let i = 0; i < this.population.length; i++) {
        if (!this.population[i].lost) {
          this.population[i].look();
          this.population[i].think();
          this.population[i].makeDecision();
          this.population[i].update();

          if (show && showAll) {
            this.population[i].draw();
          }
        }
      }

      if (bestPlayer && !bestPlayer.lost) {
        bestPlayer.look();
        bestPlayer.think();
        bestPlayer.makeDecision();
        bestPlayer.update();
        if (show && showBest) {
          bestPlayer.draw();
        }
      }
    } else {
      bestPlayer.look();
      bestPlayer.think();
      bestPlayer.makeDecision();
      bestPlayer.update();
      bestPlayer.draw();
    }
  }

  done() {
    // check if we are done with the current generation
    if (runOnlyBest && bestPlayer.lost) {
      bestPlayer = bestPlayer.clone();
      return true;
    }

    for (let i = 0; i < this.population.length; i++) {
      if (!this.population[i].lost) {
        return false;
      }
    }

    bestPlayer = bestPlayer.clone();
    return true;
  }

  naturalSelection() {
    // creates a new generation of players
    if (runOnlyBest) {
      return;
    }

    this.calculateFitness();

    let children = [];

    this.fillMatingPool();
    for (let i = 0; i < this.population.length; i++) {
      let parent1 = this.selectPlayer();
      let parent2 = this.selectPlayer();
      if (parent1.fitness > parent2.fitness) {
        children.push(parent1.crossover(parent2));
      } else {
        children.push(parent2.crossover(parent1));
      }
    }

    this.population.splice(0, this.population.length);
    this.population = children.slice(0);
    this.generation++;
    this.population.forEach((player) => {
      player.brain.generateNetwork();
    });
  }

  calculateFitness() {
    // calculates the fitness of all the players
    let currentMax = 0;
    this.population.forEach((player) => {
      player.calcFitness();
      if (player.fitness > bestFitness) {
        bestFitness = player.fitness;
        bestPlayer = player.clone();
        bestPlayer.brain.id = "BestPlayer";
      }

      if (player.fitness > currentMax) {
        currentMax = player.fitness;
      }
    });

    this.population.forEach((player) => {
      player.fitness /= currentMax ? currentMax : 1;
    });
  }

  fillMatingPool() {
    // fills the mating pool, with priority on players with a higher fitness
    this.matingpool.splice(0, this.matingpool.length);
    this.population.forEach((player, playerN) => {
      let n = player.fitness * 100;
      for (let i = 0; i <= n; i++) {
        this.matingpool.push(playerN);
      }
    });
  }

  selectPlayer() {
    // selects a random player from the mating pool
    let random = Math.floor(Math.random() * this.matingpool.length);
    return this.population[this.matingpool[random]];
  }
}

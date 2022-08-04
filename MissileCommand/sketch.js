const POP_SIZE = 200;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const SHELTER_HEIGHT = 50;
const SHELTER_WIDTH = 30;
const TURRET_WIDTH = 25;
const TURRET_HEIGHT = 35;
const EXPLOSION_LIMIT = 50;
const ROCKET_DIAMETER = 5;
const ROCKET_COUNT = 10;
const AMMO_COUNT = 20;
const INPUT_NODES = 23;
const OUTPUT_NODES = 5;

let players = [];

let cycles = 1;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  players = new Population(POP_SIZE);
}

function draw() {
  document.getElementById("generationN").innerHTML = players.generation;
  document.getElementById("bestFitness").innerHTML = bestFitness;

  showAll = document.getElementById("allCheckbox").checked;
  showBest = document.getElementById("bestCheckbox").checked;
  runOnlyBest = document.getElementById("runBestCheckbox").checked;

  cycles = select("#speedSlider").value();
  select("#speed").html(cycles);

  background(0);

  for (let i = 0; i < cycles; i++) {
    if (!players.done()) {
      players.updateAlive(cycles < 5 && i == 0);
    } else {
      players.naturalSelection();
    }
  }
}

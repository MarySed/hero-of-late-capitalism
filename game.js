//Create Canvas
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

document.body.appendChild(canvas);

//Define and Load Background Image

let backgroundReady = false;
let backgroundImg = new Image();

backgroundImg.src = "./assets/background.png";

backgroundImg.onload = function() {
  backgroundReady = true;
};

//Define and Load Hero Image

let heroReady = false;
let heroImg = new Image();

heroImg.src = "./assets/character.png";

heroImg.onload = function() {
  heroReady = true;
};

let hero = {
  speed: 3,
  x: 0,
  y: 0
};

//Load Rupee Image
let rupeeReady = false;
let rupeeImg = new Image();

rupeeImg.onload = function() {
  rupeeReady = true;
};

rupeeImg.src = "./assets/rupee.png";

let rupees = {
  x: 0,
  y: 0
};

//Load Images Function
function loadImage() {
  if (backgroundReady) {
    context.drawImage(backgroundImg, 0, 0);
  }

  if (rupeeReady) {
    context.drawImage(rupeeImg, rupees.x, rupees.y);
  }
}

//Movement Controls

let keysDown = {};

addEventListener(
  "keydown",
  function(e) {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function(e) {
    delete keysDown[e.keyCode];
  },
  false
);

let walkCycle = [0, 1, 2, 3];
let walkIndex = 0;

let width = 16;
let height = 32;
let SCALE = 2;
let SCALED_WIDTH = SCALE * width;
let SCALED_HEIGHT = SCALE * height;

//Add frame limit for smooth rendering
let frameCount = 0;
let FRAME_LIMIT = 12;

function drawFrame(frameX, frameY, canvasX, canvasY) {
  context.drawImage(
    heroImg,
    frameX * width,
    frameY * height,
    width,
    height,
    canvasX,
    canvasY,
    SCALED_WIDTH,
    SCALED_HEIGHT
  );
}

//Directions:
let DOWN = 0;
let UP = 2;
let LEFT = 3;
let RIGHT = 1;

let currentDirection = DOWN;

//Respawn rupees
function generate() {
  rupees.x = 32 + Math.random() * (canvas.width - 64);
  rupees.y = 32 + Math.random() * (canvas.height - 64);
}

function moveHero() {
  let hasMoved = false;

  if (38 in keysDown) {
    //38 = up arrow key
    moveChar(0, -1, UP);
    hasMoved = true;
  }

  if (40 in keysDown) {
    //40 = down arrow key
    moveChar(0, 1, DOWN);
    hasMoved = true;
  }

  if (37 in keysDown) {
    //37 = left arrow key
    moveChar(-1, 0, LEFT);
    hasMoved = true;
  }

  if (39 in keysDown) {
    //39 = right arrow key
    moveChar(1, 0, RIGHT);
    hasMoved = true;
  }

  //Check for Rupee Collisions
  if (
    hero.x <= rupees.x + 32 &&
    rupees.x <= hero.x + 32 &&
    hero.y <= rupees.y + 32 &&
    rupees.y <= hero.y + 32
  ) {
    generate();
  }

  if (!hasMoved) {
    walkIndex = 0;
  }

  //Loop walk animation
  if (hasMoved) {
    frameCount++;
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      walkIndex++;
      if (walkIndex >= walkCycle.length) {
        walkIndex = 0;
      }
    }
  }

  drawFrame(walkCycle[walkIndex], currentDirection, hero.x, hero.y);
}

function moveChar(deltaX, deltaY, direction) {
  if (hero.x + deltaX > 0 && hero.x + SCALED_WIDTH + deltaX < canvas.width) {
    hero.x += deltaX * hero.speed;
  }
  if (hero.y + deltaY > 0 && hero.y + SCALED_HEIGHT + deltaY < canvas.height) {
    hero.y += deltaY * hero.speed;
  }
  currentDirection = direction;
}

//Game Loop Function

function gameLoop() {
  loadImage();

  moveHero();

  requestAnimationFrame(gameLoop);
}

gameLoop();

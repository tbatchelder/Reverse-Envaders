// Title: Reversed Envaders
// Author: Timothy Batchelder

//-------------------------
// GLOBAL VARIABLES
//-------------------------
// Canvas constants
const CTX = document.getElementById("myCanvas").getContext("2d");
const CANVASMINX = 0;
const CANVASMINY = 0;
const CANVASMAXX = 1000;
const CANVASMAXY = 800;
const BGCOLOR = "#75f075";

// Game constants
// List of when each gear item becomes available (both)
const GEARLEVELLIST = [70, 150, 230, 310, 390, 470, 550, 630, 710, 790];

// Game variables
var eLevel = 0;                     // NPC level
var eShielded = false;              // NPC shield is built
var eX = 500;                       // NPC x position
var edX = -1;                        // NPC movement direction
var eOut = false;                   // NPC knocked out (start new level if player alive)
var paused = true;                  // Is the game paused (initially, yes)
var cityList = new Array();         // List of buildings in the city
var eGearList = new Array();        // List of game gear icons
var eEnergy = 0;                    // NPC energy level

// Player variables
var score = 0;                      // Player score
var pGearList = new Array();        // List of player gear icons
var pEnergy = 0;                    // Player energy level



var x = 200;      // starting horizontal position of ball
var y = 150;      // starting vertical position of ball
var dx = 1;       // amount ball should move horizontally
var dy = -3;      // amount ball should move vertically
// variables set in init()
var width, height, paddlex, bricks, brickWidth;
var paddleh = 10; // paddle height (pixels)
var paddlew = 75; // paddle width (pixels)
var canvasMinX = 0; // minimum canvas x bounds
var canvasMaxX = 0; // maximum canvas x bounds
var intervalId = 0; // track refresh rate for calling draw()
var nrows = 6; // number of rows of bricks
var ncols = 8; // number of columns of bricks
var brickHeight = 15; // height of each brick
var padding = 1;  // how far apart bricks are spaced

var ballRadius = 10; // size of ball (pixels)
// change colors of bricks -- add as many colors as you like
var brick_colors = ["burlywood", "chocolate", "firebrick", "midnightblue"];
var paddlecolor = "black";
var ballcolor = "black";


var next = 20;
var direction = "right";


//-------------------------
// FUNCTION DECLARATIONS
//-------------------------
// initialize game
function init() {
  width = 1000;
  height = 800;
  paddlex = width / 2;
  brickWidth = (width / ncols) - 1;
  canvasMinX = 0;
  canvasMaxX = canvasMinX + width;
  // run draw function every 10 milliseconds to give 
  // the illusion of movement
  init_bricks();
  buildCity();
  eGear();
  pGear();
  start_animation();
}

function reload() {
  stop_animation(); // clear out the animation - it's cause the ball to speed up
  x = 200;      // starting horizontal position of ball
  y = 150;      // starting vertical position of ball
  dx = 1;       // amount ball should move horizontally
  dy = -3;      // amount ball should move vertically
  score = 0;
  next = 0;
  init();
}

//------------------------------
// LANDSCAPE DRAWING FUNCTIONS
//------------------------------
function drawBG() {
  CTX.fillStyle = BGCOLOR;
}
function drawGround() {
  CTX.fillStyle = "brown";
  CTX.fillRect(100, 700, 800, 100);
}
function drawSky() {
  CTX.fillStyle = "blue";
  CTX.fillRect(100, 0, 800, 150);
}

//------------------------------
// GAMEPIECE DRAWING FUNCTIONS
//------------------------------
// Draw the NPC city
function drawCity() {
  CTX.fillStyle = "white";
  for (i = 0; i < 10; i++) {
    CTX.fillRect(cityList[i][0], cityList[i][1], cityList[i][2], cityList[i][3]);
    CTX.strokeStyle = "black";
    CTX.strokeRect(cityList[i][0], cityList[i][1], cityList[i][2], cityList[i][3]);
  }
}
// Draw the NPC 
function drawNPC() {
  CTX.fillStyle = "red";
  CTX.beginPath();
  CTX.moveTo(eX, 675);
  CTX.lineTo(eX + 50, 675);
  CTX.lineTo(eX + 50, 655);
  CTX.lineTo(eX + 30, 655);
  CTX.lineTo(eX + 30, 640);
  CTX.lineTo(eX + 20, 640);
  CTX.lineTo(eX + 20, 655);
  CTX.lineTo(eX, 655);
  CTX.closePath();
  CTX.fill();
}
function drawEGear() {
  CTX.fillStyle = "black";
  CTX.fillRect(0, 0, 100, 800);
}
function drawEGearIcon() {
  for (i = 0; i < 10; i++) {
    CTX.fillStyle = eGearList[i][4];
    CTX.fillRect(eGearList[i][0], eGearList[i][1], eGearList[i][2], eGearList[i][3]);
  }
}
function drawEEnergyBar() {
  CTX.fillStyle = "gold";
  CTX.fillRect(80, 795 - eEnergy, 15, eEnergy);
}

//------------------------------
// PLAYER DRAWING FUNCTIONS
//------------------------------
function drawPGear() {
  CTX.fillStyle = "black";
  CTX.fillRect(900, 0, 100, 800);
}
function drawPGearIcon() {
  for (i = 0; i < 10; i++) {
    CTX.fillStyle = pGearList[i][4];
    CTX.fillRect(pGearList[i][0], pGearList[i][1], pGearList[i][2], pGearList[i][3]);
  }
}
function drawPEnergyBar() {
  CTX.fillStyle = "gold";
  CTX.fillRect(905, 795 - pEnergy, 15, pEnergy);
}
//------------------------------
// LANDSCAPE BUILDING FUNCTIONS
//------------------------------
function buildCity() {
  let rnd = 0;
  let temp = [];
  for (i = 0; i < 10; i++) {
    rnd = Math.round(Math.random() * 90) + 10;       // Should generate a value 10 - 100
    temp = [105 + 80 * i, 800 - rnd, 70, rnd];    // X pos, Y Pos, Width, Height
    cityList[i] = temp;
  }
}

//------------------------------
// GAMEPIECE BUILDING FUNCTIONS
//------------------------------
function eGear() {
  let temp = [];
  for (i = 0; i < 10; i++) {
    temp = [5, 80 * i + 5, 70, 70, "white"];
    eGearList[i] = temp;
  }
}

//------------------------------
// PLAYER BUILDING FUNCTIONS
//------------------------------
function pGear() {
  let temp = [];
  for (i = 0; i < 10; i++) {
    temp = [925, 80 * i + 5, 70, 70, "white"];
    pGearList[i] = temp;
  }
}

// used to draw the ball
function circle(x, y, r) {
  CTX.beginPath();
  CTX.arc(x, y, r, 0, Math.PI * 2, true);
  CTX.closePath();
  CTX.fill();
}

// used to draw each brick & the paddle
function rect(x, y, w, h) {
  CTX.beginPath();
  CTX.rect(x, y, w, h);
  CTX.closePath();
  CTX.fill();
}

// clear the screen in between drawing each animation
function clear() {
  CTX.clearRect(0, 0, width, height);
  rect(0, 0, width, height);
}

// What do to when the mouse moves within the canvas
function onMouseMove(evt) {
  // set the paddle position if the mouse position 
  // is within the borders of the canvas
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    paddlex = Math.max(evt.pageX - canvasMinX - (paddlew / 2), 0);
    paddlex = Math.min(width - paddlew, paddlex);
  }
}

function onKeyPress(evt) {
  evt.preventDefault();
  pause();
}

function pause() {
  if (paused) { // if paused, begin animation again
    start_animation();
  } else { // if unpaused, clear the animation
    stop_animation();
  }
  paused = !paused;
}

// initialize array of bricks to be visible (true)
function init_bricks() {
  bricks = new Array(nrows);
  brickColor = new Array(nrows);
  for (i = 0; i < nrows; i++) { // for each row of bricks
    bricks[i] = new Array(ncols);
    brickColor[i] = new Array(ncols);
    for (j = 0; j < ncols; j++) { // for each column of bricks
      bricks[i][j] = true;
      brickColor[i][j] = "";
    }
  }
}

// render the bricks
function draw_bricks() {
  for (i = 0; i < nrows; i++) { // for each row of bricks
    for (j = 0; j < ncols; j++) { // for each column of bricks
      // set the colors to alternate through
      // all colors in brick_colors array
      // modulus (%, aka remainder) ensures the colors
      // rotate through the whole range of brick_colors
      CTX.fillStyle = brick_colors[(i + j) % brick_colors.length];
      brickColor[i][j] = brick_colors[(i + j) % brick_colors.length];
      if (bricks[i][j]) {
        rect((j * (brickWidth + padding)) + padding,
          (i * (brickHeight + padding)) + padding,
          brickWidth, brickHeight);
      }
    }
  }
}

function drawWall() {
  let pushMe = true;
  for (let j = 500; j < 600; j += 20) {
    CTX.beginPath();
    if (pushMe) {
      for (let i = 40; i < 760; i += 40) {
        CTX.fillStyle = "red";
        CTX.fillRect(i, j, 30, 20);

        // the outline rectangle
        CTX.strokeStyle = "blue";
        CTX.lineWidth = 1;
        CTX.strokeRect(i, j, 30, 20)
      }
      pushMe = false;
    } else {
      for (let i = 60; i < 760; i += 40) {
        pushMe = true;
        // the filled rectangle
        CTX.fillStyle = "red";
        CTX.fillRect(i, j, 30, 20);

        // the outline rectangle
        CTX.strokeStyle = "blue";
        CTX.lineWidth = 1;
        CTX.strokeRect(i, j, 30, 20)
      }
    }
  }
}

function drawPlayer() {
  for (let i = 20; i < 300; i += 70) {
    CTX.beginPath();
    CTX.fillStyle = "green";
    CTX.fillRect(i + next, 400, 60, 60);
  }

  CTX.beginPath();
  CTX.fillStyle = "blue";
  CTX.fillRect(300 + next, 400, 60, 60);


  for (let i = 370; i < 650; i += 70) {
    CTX.beginPath();
    CTX.fillStyle = "green";
    CTX.fillRect(i + next, 400, 60, 60);
  }
}

function draw() {
  // before drawing, change the fill color
  drawBG();
  clear();
  drawGround();
  drawSky();
  drawCity();
  drawNPC();
  drawEGear();
  drawEGearIcon();
  drawEEnergyBar();
  drawPGear();
  drawPGearIcon();
  drawPEnergyBar();

  // Enemy base movement
  if (eX <= 105) {
    edX = 1;
  } else if (eX >= 845) {
    edX = -1;
  }
  eX = eX + edX;

  // Enemy energy growth
  if (eEnergy < 791) {
    eEnergy += 1;
  }

  // Player energy growth
  if (pEnergy < 791) {
    pEnergy += 1;
  }

  // Check enemy energy level
  for (let i = 0; i < 10; i++) {
    if (eEnergy <= GEARLEVELLIST[i]) {
      break;
    } else {
      eGearList[9 - i][4] = "gold";
    }
  }

  // Check player energy level
  for (let i = 0; i < 10; i++) {
    if (pEnergy <= GEARLEVELLIST[i]) {
      break;
    } else {
      pGearList[9 - i][4] = "gold";
    }
  }

  CTX.fillStyle = ballcolor;
  //draw the ball
  circle(x, y, ballRadius);
  CTX.fillStyle = paddlecolor;
  //draw the paddle
  rect(paddlex, height - paddleh, paddlew, paddleh);
  draw_bricks();
  drawWall();
  drawPlayer(next);

  //check if we have hit a brick
  rowheight = brickHeight + padding;
  colwidth = brickWidth + padding;
  row = Math.floor(y / rowheight);
  col = Math.floor(x / colwidth);
  //if so reverse the ball and mark the brick as broken
  if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
    dy = -dy;
    bricks[row][col] = false;
    //"burlywood", "chocolate", "firebrick", "midnightblue"
    switch (brickColor[row][col]) {
      case "burlywood":
        score = score + 10;
        break;
      case "chocolate":
        score = score + 20;
        break;
      case "firebrick":
        score = score + 5;
        break;
      case "midnightblue":
        score = score + 1;
        break;
      default:
      // code block
    }
    //score = score + 1;
    update_score_text();
  }

  //contain the ball by rebouding it off the walls of the canvas
  if (x + dx > width || x + dx < 0)
    dx = -dx;

  if (y + dy < 0) {
    dy = -dy;
  } else if (y + dy > height - paddleh) {
    // check if the ball is hitting the 
    // paddle and if it is rebound it
    if (x > paddlex && x < paddlex + paddlew) {
      dy = -dy;
    }
  }
  if (y + dy > height) {
    //game over, so stop the animation
    stop_animation();
  }
  x += dx;
  y += dy;
  if (next > 20) {
    direction = "left";
  }
  if (next < 0) {
    direction = "right";
  }
  if (direction = "right") {
    next += 2;
  } else {
    next = next - 2;
  }
}

function update_score_text() {
  // You can send data to your HTML
  // just like setting styles in CSS
  // Put <div id="score"></div> in
  // your HTML for thjis text to display
  //$('#score').text("Score: " + score);
}

function start_animation() {
  intervalId = setInterval(draw, 10);
  update_score_text();
}

function stop_animation() {
  clearInterval(intervalId);
}

//-------------------------
// MAIN EXECUTION
//-------------------------
//$(document).mousemove(onMouseMove); // register the mouse move function
//$(document).keypress(onKeyPress);   // register onKeyPress function
init(); // initialize & begin game
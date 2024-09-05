// Title: Reversed Envaders
// Author: Timothy Batchelder

//-------------------------
// GLOBAL VARIABLES
//-------------------------
// Canvas constants
const CTX = document.getElementById("myCanvas").getContext("2d");
const CANVASMINX = 0;
const CANVASMINY = 0;
const CANVASMAXX = 800;
const CANVASMAXY = 800;
const BGColor = "#75f075";

// Game constants

// Game variables
var eLevel = 0;         // NPC level
var eShielded = false;  // NPC shield is built
var eX = 400;           // NPC x position
var edX = 0;            // NPC movement direction
var eOut = false;       // NPC knocked out (start new level if player alive)
var paused = true;      // Is the game paused (initially, yes)

// Player variables
var score = 0;          // Player score




var x = 200;      // starting horizontal position of ball
var y = 150;      // starting vertical position of ball
var dx = 1;       // amount ball should move horizontally
var dy = -3;      // amount ball should move vertically
// variables set in init()
var ctx, width, height, paddlex, bricks, brickWidth;
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
  width = 800;
  height = 800;
  paddlex = width / 2;
  brickWidth = (width / ncols) - 1;
  canvasMinX = 0;
  canvasMaxX = canvasMinX + width;
  // run draw function every 10 milliseconds to give 
  // the illusion of movement
  init_bricks();
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
  CTX.fillStyle = BGColor;
}
function drawGround() {
  CTX.fillStyle = "brown";
  CTX.fillRect(0, 700, 800, 100);
}
function drawSky() {
  CTX.fillStyle = "blue";
  CTX.fillRect(0, 0, 800, 100);
}

// Draw the NPC city
function drawCity() {

}

// Draw the NPC 
function drawNPC() {

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
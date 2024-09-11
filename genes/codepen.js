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
//const GEARLEVELLIST = [70, 150, 230, 310, 390, 470, 550, 630, 710, 790];
const GEARLEVELLIST = [790, 710, 630, 550, 470, 390, 310, 230, 150, 70];

// Game variables
var paused = true;                  // Is the game paused (initially, yes)

// Enemy variables
var eCityList = new Array();  // List of buildings in the city
var eGearList = new Array();  // List of NPC gear icons
var eBulletList = new Array();  // List of NPC bullets
var eShieldList = new Array();      // List of NPC shields
var eShieldListLvl1 = new Array();  // List of NPC shields on the first level
var eShieldListLvl2 = new Array();  // List of NPC shields on the second level
var eShieldListLvl3 = new Array();  // List of NPC shields on the third level
var eShieldListLvl4 = new Array();  // List of NPC shields on the fourth level
var eShieldListLvl5 = new Array();  // List of NPC shields on the fifth level

var eX = 500;                      // NPC x start position
var edX = 0;                        // NPC movement direction

var eGearEnergy = 0;            // NPC energy level
var eGearEnergyRate = 1;            // Rate NPC builds up gear energy
var eShielded = false;        // Is the NPC shield up

var eOut = false;                 // NPC has been stunned and can't do anything

// Player variables
var score = 0;                      // Player score

var pGearList = new Array();      // List of player gear icons
var pPlayerList = new Array();      // List of players
var pBulletList = new Array();      // List of player bullets
var pShieldList = new Array();      // List of player shields

var pEnergy = 0;                    // Player energy level
var pERate = 0.1;                   // Rate at which player gun is recharged
var pSRate = 0.05;                  // Rate at which player shield is recharged

var pdX = 1;                        // Player speed


//-------------------------
// FUNCTION DECLARATIONS
//-------------------------
//------------------------------
// LANDSCAPE BUILDING FUNCTIONS
//------------------------------

//------------------------------
// GAMEPIECE BUILDING FUNCTIONS
//------------------------------
function bullet(entity, x, y, t) {
  if (entity == "e") {
    switch (t) {
      case 0:
        temp = [x, y, 10, 20, "grey"];
        break;
    }
    eBulletList.push(temp);
  } else {
    switch (t) {
      case 0:
        temp = [x, y, 10, 20, "brown"];
        break;
    }
    pBulletList.push(temp);
  }
}

//------------------------------
// NPCPIECE BUILDING FUNCTIONS
//------------------------------
function buildEGear() {
  for (let i = 0; i < 10; i++) {
    let temp = [5, 720 - 80 * i + 5, 70, 70, "white"];
    eGearList[i] = temp;
  }
}
function buildCity() {
  for (let i = 0; i < 10; i++) {
    // Should generate a value 1 - 10
    let rnd = Math.round(Math.random() * 9) + 1;
    // X pos, Y Pos, Width, Height, building level (1 - 10)
    let temp = [105 + 80 * i, 800 - rnd * 10, 70, rnd * 10, rnd];
    eCityList[i] = temp;
  }
}

//------------------------------
// PLAYER BUILDING FUNCTIONS
//------------------------------
function buildPGear() {
  for (let i = 0; i < 10; i++) {
    let temp = [925, 720 - 80 * i + 5, 70, 70, "white"];
    pGearList[i] = temp;
  }
}
function buildPlayerList() {
  // Start at the bottom and build up
  // [x pos, y pos, width, heigt, color, special type, energy, shield energy]
  for (let r = 0; r < 4; r++) {
    var temp = [];
    for (let c = 0; c < 4; c++) {
      temp.push([110 + 10 * c + 50 * c, 400 - 60 * r, 50, 50, "green", 0, 100, 100]);
    }
    for (let c = 0; c < 2; c++) {
      temp.push([350 + 10 * c + 50 * c, 400 - 60 * r, 50, 50, "blue", 1, 100, 100]);
    }
    for (let c = 0; c < 4; c++) {
      temp.push([470 + 10 * c + 50 * c, 400 - 60 * r, 50, 50, "green", 0, 100, 100]);
    }
    pPlayerList[r] = temp;
  }
}

//------------------------------
// LANDSCAPE DRAWING FUNCTIONS
//------------------------------
function drawBG() {
  CTX.fillStyle = BGCOLOR;
}
function drawGround() {
  CTX.fillStyle = "brown";
  CTX.fillRect(100, 690, 800, 110);
}
function drawSky() {
  CTX.fillStyle = "blue";
  CTX.fillRect(100, 0, 800, 150);
}

//------------------------------
// GAMEPIECE DRAWING FUNCTIONS
//------------------------------
function drawEGear() {
  CTX.fillStyle = "black";
  CTX.fillRect(0, 0, 100, 800);
}
function drawPGear() {
  CTX.fillStyle = "black";
  CTX.fillRect(900, 0, 100, 800);
}
function drawBullets() {
  if (eBulletList != []) {
    for (let i = 0; i < eBulletList.length; i++) {
      CTX.fillStyle = eBulletList[i][4];
      CTX.fillRect(eBulletList[i][0], eBulletList[i][1], eBulletList[i][2], eBulletList[i][3]);
    }
  }
  if (pBulletList != []) {
    for (let i = 0; i < pBulletList.length; i++) {
      CTX.fillStyle = pBulletList[i][4];
      CTX.fillRect(pBulletList[i][0], pBulletList[i][1], pBulletList[i][2], pBulletList[i][3]);
    }
  }
}

//------------------------------
// NPCPIECE DRAWING FUNCTIONS
//------------------------------
// Draw the NPC city
function drawCity() {
  CTX.fillStyle = "white";
  for (let i = 0; i < 10; i++) {
    CTX.fillRect(eCityList[i][0], eCityList[i][1], eCityList[i][2], eCityList[i][3]);
    CTX.strokeStyle = "black";
    CTX.strokeRect(eCityList[i][0], eCityList[i][1], eCityList[i][2], eCityList[i][3]);
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
function drawEGearIcon() {
  for (let i = 0; i < 10; i++) {
    CTX.fillStyle = eGearList[i][4];
    CTX.fillRect(eGearList[i][0], eGearList[i][1], eGearList[i][2], eGearList[i][3]);
  }
}
function drawEEnergyBar() {
  CTX.fillStyle = "gold";
  CTX.fillRect(80, 795 - eGearEnergy, 15, eGearEnergy);
}

//------------------------------
// PLAYER DRAWING FUNCTIONS
//------------------------------
function drawPGearIcon() {
  for (let i = 0; i < 10; i++) {
    CTX.fillStyle = pGearList[i][4];
    CTX.fillRect(pGearList[i][0], pGearList[i][1], pGearList[i][2], pGearList[i][3]);
    CTX.fillStyle = "black";
    CTX.font = "24px Arial";
    if (i == 0) {
      CTX.fillText(i.toString(), pGearList[i][0] + 46, pGearList[i][1] + 24);
    } else {
      CTX.fillText(i.toString(), pGearList[i][0] + 46, pGearList[i][1] + 24);
    }
  }
}
function drawPEnergyBar() {
  CTX.fillStyle = "gold";
  CTX.fillRect(905, 795 - pEnergy, 15, pEnergy);
}
function drawPlayer() {
  for (let pr = 0; pr < 4; pr++) {
    for (let pc = 0; pc < 10; pc++) {
      CTX.fillStyle = pPlayerList[pr][pc][4];
      CTX.fillRect(pPlayerList[pr][pc][0], pPlayerList[pr][pc][1], pPlayerList[pr][pc][2], pPlayerList[pr][pc][3]);
      drawPlayerEnergy(pPlayerList[pr][pc][0], pPlayerList[pr][pc][1], pPlayerList[pr][pc][6]);
      drawPlayerShieldEnergy(pPlayerList[pr][pc][0], pPlayerList[pr][pc][1], pPlayerList[pr][pc][7]);
      drawPlayerShield(pPlayerList[pr][pc][0], pPlayerList[pr][pc][1]);
    }
  }
}
function drawPlayerEnergy(x, y, e) {
  eH = 100 - e;
  CTX.fillStyle = "gold";
  CTX.fillRect(x, y + eH / 2, 5, e / 2);
}
function drawPlayerShieldEnergy(x, y, e) {
  eH = 100 - e;
  CTX.fillStyle = "purple";
  CTX.fillRect(x + 45, y + eH / 2, 5, e / 2);
}
function drawPlayerShield(x, y) {
  CTX.fillStyle = "white";
  CTX.fillRect(x, y + 50, 50, 5);
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

function onKeyDown(evt) {
  evt.preventDefault();
  switch (event.key) {
    // Create a normal player bullet :: bottom row ONLY
    case "a":
      if (pPlayerList[0][0][6] > 0) {
        bullet("p", pPlayerList[0][0][0] + 25, 450, pPlayerList[0][0][5]);
        pPlayerList[0][0][6] = pPlayerList[0][0][6] - 10;
      }
      break;
    case "s":
      if (pPlayerList[0][1][6] > 0) {
        bullet("p", pPlayerList[0][1][0] + 25, 450, pPlayerList[0][1][5]);
        pPlayerList[0][1][6] = pPlayerList[0][1][6] - 10;
      }
      break;
    case "d":
      if (pPlayerList[0][2][6] > 0) {
        bullet("p", pPlayerList[0][2][0] + 25, 450, pPlayerList[0][2][5]);
        pPlayerList[0][2][6] = pPlayerList[0][2][6] - 10;
      }
      break;
    case "f":
      if (pPlayerList[0][3][6] > 0) {
        bullet("p", pPlayerList[0][3][0] + 25, 450, pPlayerList[0][3][5]);
        pPlayerList[0][3][6] = pPlayerList[0][3][6] - 10;
      }
      break;
    case "j":
      if (pPlayerList[0][6][6] > 0) {
        bullet("p", pPlayerList[0][6][0] + 25, 450, pPlayerList[0][6][5]);
        pPlayerList[0][6][6] = pPlayerList[0][6][6] - 10;
      }
      break;
    case "k":
      if (pPlayerList[0][7][6] > 0) {
        bullet("p", pPlayerList[0][7][0] + 25, 450, pPlayerList[0][7][5]);
        pPlayerList[0][7][6] = pPlayerList[0][7][6] - 10;
      }
      break;
    case "l":
      if (pPlayerList[0][8][6] > 0) {
        bullet("p", pPlayerList[0][8][0] + 25, 450, pPlayerList[0][8][5]);
        pPlayerList[0][8][6] = pPlayerList[0][8][6] - 10;
      }
      break;
    case ";":
      if (pPlayerList[0][9][6] > 0) {
        bullet("p", pPlayerList[0][9][0] + 25, 450, pPlayerList[0][9][5]);
        pPlayerList[0][9][6] = pPlayerList[0][9][6] - 10;
      }
      break;
    default:
    // code block
  }
  //if (event.key = "a") {
  //bullet("e",eX + 25,620);
  //bullet("p",pPlayerList[0][0][0] + 25,450);
  //}
  //pause();
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
var paused = false; // keeps track of whether the game is paused (true) or not (false)
var ballRadius = 10; // size of ball (pixels)
// change colors of bricks -- add as many colors as you like
var brick_colors = ["burlywood", "chocolate", "firebrick", "midnightblue"];
var paddlecolor = "black";
var ballcolor = "black";


var next = 20;
var direction = "right";

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
  buildEGear();
  buildPGear();
  buildPlayerList();
  start_animation();
  bullet("e", eX, 620);
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
  drawPlayer();
  drawBullets();

  // Enemy base movement
  if (eX <= 105) {
    edX = 1;
  } else if (eX >= 845) {
    edX = -1;
  }
  eX = eX + edX;

  // Enemy energy growth
  if (eGearEnergy < 791) {
    eGearEnergy += eGearEnergyRate;
  }

  // Player energy growth
  if (pEnergy < 791) {
    pEnergy += 1;
  }

  // Check enemy energy level
  for (let i = 0; i < 10; i++) {
    if ((865 - eGearEnergy) > GEARLEVELLIST[i]) {
      break;
    } else {
      eGearList[i][4] = "gold";
    }
  }

  // Check player energy level
  for (let i = 0; i < 10; i++) {
    if ((865 - pEnergy) > GEARLEVELLIST[i]) {
      break;
    } else {
      pGearList[i][4] = "gold";
    }
  }

  // Move the player
  for (let r = 0; r < 4; r++) {
    if (pPlayerList[0][9][0] > 850) {
      pdX = -1;
    }
    if (pPlayerList[0][0][0] < 110) {
      pdX = 1;
    }
    for (let c = 0; c < 10; c++) {
      pPlayerList[r][c][0] += pdX;

      // Power up the player
      if (pPlayerList[r][c][6] < 100) {
        pPlayerList[r][c][6] += pERate;
      }
    }
  }

  // Make the gun fire
  // Let's just make it move first
  if (eBulletList.length > 0) {
    for (let i = 0; i < eBulletList.length; i++) {
      eBulletList[i][1] = eBulletList[i][1] - 2;
    }
  }
  if (pBulletList.length > 0) {
    for (let i = 0; i < pBulletList.length; i++) {
      pBulletList[i][1] = pBulletList[i][1] + 2;
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
// (CALLING FUNCTIONS)
//-------------------------
// main functionality begins here
// what should happen when the user moves the mouse?
theGame = document.getElementById("myCanvas");
//document.mousemove(onMouseMove); // register the mouse move function
//document.keypress(onKeyPress);   // register onKeyPress function
theGame.addEventListener('keydown', function (event) {
  onKeyDown(event);
}, false);
theGame.addEventListener('mousemove', function (event) {
  onMouseMove(event);
}, false);
init();                             // initialize & begin game
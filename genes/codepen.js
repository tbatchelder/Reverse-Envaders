// Title: Reversed Envaders
// Author: Timothy Batchelder

//-------------------------
// VARIABLES INITIALIZATION
//-------------------------
// Global container for variables and objects
let g = [];   

// Canvas constants
g.CTX        = document.getElementById("myCanvas").getContext("2d");
g.CANVASMINX = 0;
g.CANVASMINY = 0;
g.CANVASMAXX = 1000;
g.CANVASMAXY = 800;

// Game constants
g.const                = [];
g.const.BGCOLOR        = "#75f075";
// List of when each gear item becomes available (both)
g.const.GEARLEVELLIST  = [790, 710, 630, 550, 470, 390, 310, 230, 150, 70];
// List of y position for each NPC shield row
g.const.NPCSHIELDLIST  = [580, 560, 540, 520, 500];
// List of NPC shield colors based on level
g.const.NPCSHIELDCOLOR = ["red", "orange", "yellow", "green", "blue", "purple"];

// Game variables
g.game              = [];
g.game.paused       = true;          // Is the game paused (initially, yes)

// Enemy variables
g.e                 = [];
g.e.list            = [];
g.e.list.City       = [];           // List of buildings in the city
g.e.list.Gear       = [];           // List of NPC gear icons
g.e.list.Bullet     = [];           // List of NPC bullets
g.e.list.Shield     = [];           // List of NPC shields

g.e.pos             = [];
g.e.pos.X           = 500;          // NPC x start position
g.e.pos.dX          = 0;            // NPC movement direction

g.e.energy          = [];
g.e.energy.Gear     = 0;            // NPC energy level
g.e.energy.GearRate = 1;            // Rate NPC builds up gear energy

g.e.def             = [];
g.e.def.Shielded    = false;        // Is the NPC shield up
g.e.def.ShieldLevel = 0;            // The shield level current obtained

g.e.Out             = false;        // NPC has been stunned and can't do anything

// Player variables
g.p                 = [];
g.p.score           = 0;            // Player score

g.p.pos             = [];
g.p.pos.X           = 1;            // Player speed

g.p.list            = [];
g.p.list.Gear       = [];           // List of player gear icons
g.p.list.Player     = [];           // List of players
g.p.list.Bullet     = [];           // List of player bullets
g.p.list.Shield     = [];           // List of player shields

g.p.energy          = [];
g.p.energy.Gear     = 0;            // Player energy level
g.p.energy.Bullet   = 0.1;          // Rate at which player gun is recharged
g.p.energy.Shield   = 0.05;         // Rate at which player shield is recharged




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
    switch(t) {
      case 0:
        temp = [x, y, 10, 20, "grey"];
        break;
    }
    g.e.list.Bullet.push(temp);
  } else {
    switch(t) {
      case 0:
        temp = [x, y, 10, 20, "brown"];
        break;
    }
    g.p.list.Bullet.push(temp);
  }
}

//------------------------------
// NPC PIECE BUILDING FUNCTIONS
//------------------------------
function buildEGearList() {
  for (let i = 0; i < 10; i++) {
    let temp = [5, 720 - 80 * i + 5, 70, 70, "white"];
    g.e.list.Gear[i] = temp;
  }
}
function buildECityList() {
  for (let i = 0; i < 10; i++) {
    // Should generate a value 1 - 10
    let rnd = Math.round(Math.random() * 9) + 1;
    // X pos, Y Pos, Width, Height, building level (1 - 10)
    let temp = [105 + 80 * i, 800 - rnd * 10, 70, rnd * 10, rnd];   
    g.e.list.City[i] = temp;
  }
}
function buildEShieldList(r, l) {
  let r1 = 4;
  let l1 = 36;
  // Determine the color of the row
  // Every 30 levels, the # of rows impacted needs to be reset so it stays between 0 - 5
  let levelAdjustment = Math.floor(l1 / 30);
  let numRowsImpacted = Math.floor((l1 - 30 * levelAdjustment) / 5);
  // To get the right color, it needs to use the original level value adjusted down by 5
  let rowColorNumber = 0;  // It also can't be negative (rounds to -1)
  if (l1 > 4) {
    rowColorNumber = Math.floor(Math.floor((l1 - 5) / 5) / 5);
  }
  // Once found, the color needs to be kept within the list 0 - 5
  if (rowColorNumber > 5) {
    rowColorNumber = 5;
  }
  sColor = g.const.NPCSHIELDCOLOR[rowColorNumber];
  // Determine indent from left side based on the row created
  let row = 0;
  let direction = 1;
  while (row < (r1 + 1)) {
    switch(row) {
      case 0:
      case 2:
      case 4:
        x = 110; 
        break;
      case 1:
      case 3:
        x = 150;
        break;
    }
    y = g.const.NPCSHIELDLIST[row];
    // Build the final list
    let tempRow = [];
    for (let c = 0; c < 15; c++) {
      // x, y, width, height, color, direction (1=right, -1=left)
      let temp = [x + c * 50, y, 40, 20, sColor, direction];
      // Check for a better level
      if (numRowsImpacted > 0) {
        temp[4] = g.const.NPCSHIELDCOLOR[rowColorNumber + 1];
      }
      tempRow.push(temp);
    }
    g.e.list.Shield.push(tempRow);
    // Once a row is done and pushed, lower the row impacted count and change the direction
    numRowsImpacted -= 1;
    direction = direction * -1;
    row++;
  }
}
function drawWall() {
  for (let r = 0; r < g.e.list.Shield.length;  r++) {
    // Get the direction to move each row
    for (let c = 0; c < 15; c++) {
      g.CTX.fillStyle = g.e.list.Shield [r][c][4];
      // Move the x position of each shield by the direction value
      g.e.list.Shield [r][c][0] = g.e.list.Shield [r][c][0] + g.e.list.Shield[r][0][5];
      // Check if the shield hit the wall and bounce it back
      if ( (g.e.list.Shield[r][c][5] == 1) && (g.e.list.Shield[r][14][0] == 855) ) {
        g.e.list.Shield[r][c][5] = g.e.list.Shield[r][c][5] * -1;
      }
      if ( (g.e.list.Shield[r][c][5] == -1) && (g.e.list.Shield[r][0][0] == 105) ) {
        g.e.list.Shield[r][c][5] = g.e.list.Shield[r][c][5] * -1;
      }
      g.CTX.fillRect(g.e.list.Shield[r][c][0], g.e.list.Shield[r][c][1], g.e.list.Shield[r][c][2], g.e.list.Shield[r][c][3]);
      
      // the outline rectangle
      g.CTX.strokeStyle = "blue";
      g.CTX.lineWidth = 1;
      g.CTX.strokeRect(g.e.list.Shield[r][c][0], g.e.list.Shield[r][c][1], 40, 20);
    }
  }
}

//------------------------------
// PLAYER BUILDING FUNCTIONS
//------------------------------
function buildPGearList() {
  for (let i = 0; i < 10; i++) {
    let temp = [925, 720 - 80 * i + 5, 70, 70, "white"];
    g.p.list.Gear[i] = temp;
  }
}
function buildPList() {
  // Start at the bottom and build up
  // [x pos, y pos, width, heigt, color, special type, energy, shield energy]
  for (let r = 0; r < 4; r++) {
    var temp = [];
    for (let c = 0; c < 4; c++) {
      temp.push([110 + 10 * c + 50 * c, 400 - 60 * r, 50, 50, "green",0,100,100]);
    }
    for (let c = 0; c < 2; c++) {
      temp.push([350 + 10 * c + 50 * c, 400 - 60 * r, 50, 50, "blue",1,100,100]);
    }
    for (let c = 0; c < 4; c++) {
      temp.push([470 + 10 * c + 50 * c, 400 - 60 * r, 50, 50, "green",0,100,100]);
    }
    g.p.list.Player[r] = temp;
  }
}
function buildPShieldList() {
  let temp = [[],[],[],[],[],[],[],[],[],[]];
  for (t = 0; t < 4; t++) {
    g.p.list.Shield.push(temp);
  }
}

//------------------------------
// LANDSCAPE DRAWING FUNCTIONS
//------------------------------
function drawBG() {
  g.CTX.fillStyle = g.const.BGCOLOR;
  g.CTX.fillRect(0, 0, 1000, 800);
}
function drawGround() {
  g.CTX.fillStyle = "brown";
  g.CTX.fillRect(100, 690, 800, 110);
}
function drawSky() {
  g.CTX.fillStyle = "blue";
  g.CTX.fillRect(100, 0, 800, 150);
}

//------------------------------
// GAMEPIECE DRAWING FUNCTIONS
//------------------------------
function drawEGear() {
  g.CTX.fillStyle = "black";
  g.CTX.fillRect(0, 0, 100, 800);
}
function drawPGear() {
  g.CTX.fillStyle = "black";
  g.CTX.fillRect(900, 0, 100, 800);
}
function drawBullets() {
  if (g.e.list.Bullet != []) {
    for (let i = 0; i < g.e.list.Bullet.length; i++) {
      g.CTX.fillStyle = g.e.list.Bullet[i][4];
      g.CTX.fillRect(g.e.list.Bullet[i][0],g.e.list.Bullet[i][1],g.e.list.Bullet[i][2],g.e.list.Bullet[i][3]);
    }
  }
  if (g.p.list.Bullet != []) {
    for (let i = 0; i < g.p.list.Bullet.length; i++) {
      g.CTX.fillStyle = g.p.list.Bullet [i][4];
      g.CTX.fillRect(g.p.list.Bullet [i][0], g.p.list.Bullet [i][1], g.p.list.Bullet [i][2], g.p.list.Bullet [i][3]);
    }
  }
}

//------------------------------
// NPCPIECE DRAWING FUNCTIONS
//------------------------------
// Draw the NPC city
function drawCity() {
  g.CTX.fillStyle = "white";
  for (let i = 0; i < 10; i++) {
    g.CTX.fillRect(g.e.list.City[i][0], g.e.list.City[i][1], g.e.list.City[i][2], g.e.list.City[i][3]);
    g.CTX.strokeStyle = "black";
    g.CTX.strokeRect(g.e.list.City[i][0], g.e.list.City[i][1], g.e.list.City[i][2], g.e.list.City[i][3]);
  }
}
// Draw the NPC 
function drawNPC() {
  g.CTX.fillStyle = "red";
  g.CTX.beginPath();
  g.CTX.moveTo(g.e.pos.X, 675);
  g.CTX.lineTo(g.e.pos.X + 50, 675);
  g.CTX.lineTo(g.e.pos.X + 50, 655);
  g.CTX.lineTo(g.e.pos.X + 30, 655);
  g.CTX.lineTo(g.e.pos.X + 30, 640);
  g.CTX.lineTo(g.e.pos.X + 20, 640);
  g.CTX.lineTo(g.e.pos.X + 20, 655);
  g.CTX.lineTo(g.e.pos.X, 655);
  g.CTX.closePath();
  g.CTX.fill();
}
function drawEGearIcon() {
  for (let i = 0; i < 10; i++) {
    g.CTX.fillStyle = g.e.list.Gear[i][4];
    g.CTX.fillRect(g.e.list.Gear[i][0], g.e.list.Gear[i][1], g.e.list.Gear[i][2], g.e.list.Gear[i][3]);
  }
}
function drawEEnergyBar() {
  g.CTX.fillStyle = "gold";
  g.CTX.fillRect(80, 795 - g.e.energy.Gear, 15, g.e.energy.Gear);
}

//------------------------------
// PLAYER DRAWING FUNCTIONS
//------------------------------
function drawPGearIcon() {
  for (let i = 0; i < 10; i++) {
    g.CTX.fillStyle = g.p.list.Gear[i][4];
    g.CTX.fillRect(g.p.list.Gear[i][0], g.p.list.Gear[i][1], g.p.list.Gear[i][2], g.p.list.Gear[i][3]);
    g.CTX.fillStyle = "black";
    g.CTX.font = "24px Arial";
    g.CTX.fillText(i.toString(), g.p.list.Gear[i][0] + 54, g.p.list.Gear[i][1]+20);
  }
}
function drawPEnergyBar() {
  g.CTX.fillStyle = "gold";
  g.CTX.fillRect(905, 795 - g.p.energy.Gear, 15, g.p.energy.Gear);
}
function drawPlayer() {
  for (let pr = 0; pr < 4; pr ++) {
    for (let pc = 0; pc < 10; pc++) {
      g.CTX.fillStyle = g.p.list.Player[pr][pc][4];
      g.CTX.fillRect(g.p.list.Player[pr][pc][0], g.p.list.Player[pr][pc][1], g.p.list.Player[pr][pc][2], g.p.list.Player[pr][pc][3]);
      drawPlayerEnergy(g.p.list.Player[pr][pc][0], g.p.list.Player[pr][pc][1],g.p.list.Player[pr][pc][6]);
      drawPlayerShieldEnergy(g.p.list.Player[pr][pc][0], g.p.list.Player[pr][pc][1],g.p.list.Player[pr][pc][7]);
      drawPlayerShield(g.p.list.Player[pr][pc][0], g.p.list.Player[pr][pc][1]);
    }
  }
}
function drawPlayerEnergy(x,y,e) {
  eH = 100 - e;
  g.CTX.fillStyle = "gold";
  g.CTX.fillRect(x,y + eH / 2,5,e / 2);
}
function drawPlayerShieldEnergy(x,y,e){
  eH = 100 - e;
  g.CTX.fillStyle = "purple";
  g.CTX.fillRect(x + 45,y + eH / 2,5,e / 2);
}
function drawPlayerShield(x,y) {
  g.CTX.fillStyle = "white";
  g.CTX.fillRect(x,y + 50,50,5);
}



// clear the screen in between drawing each animation
function clear() {
  g.CTX.clearRect(0, 0, width, height);
}

function onKeyDown(evt) {
  evt.preventDefault();
  switch(event.key) {
    // Create a normal player bullet :: bottom row ONLY
    case "a":
      if (g.p.list.Player[0][0][6] > 10) {
        bullet("p",g.p.list.Player[0][0][0] + 25,450,g.p.list.Player[0][0][5]);
        g.p.list.Player[0][0][6] = g.p.list.Player[0][0][6] - 10;
      }
      break;
    case "s":
      if (g.p.list.Player[0][1][6] > 10) {
        bullet("p",g.p.list.Player[0][1][0] + 25,450,g.p.list.Player[0][1][5]);
        g.p.list.Player[0][1][6] = g.p.list.Player[0][1][6] - 10;
      }
      break;
    case "d":
      if (g.p.list.Player[0][2][6] > 10) {
        bullet("p",g.p.list.Player[0][2][0] + 25,450,g.p.list.Player[0][2][5]);
        g.p.list.Player[0][2][6] = g.p.list.Player[0][2][6] - 10;
      }
      break;
    case "f":
      if (g.p.list.Player[0][3][6] > 10) {
        bullet("p",g.p.list.Player[0][3][0] + 25,450,g.p.list.Player[0][3][5]);
        g.p.list.Player[0][3][6] = g.p.list.Player[0][3][6] - 10;
      }
      break;
    case "g":
      if (g.p.list.Player[0][4][6] > 10) {
        bullet("p",g.p.list.Player[0][4][0] + 25,450,g.p.list.Player[0][4][5]);
        g.p.list.Player[0][4][6] = g.p.list.Player[0][4][6] - 10;
      }
      break;
    case "h":
      if (g.p.list.Player[0][5][6] > 10) {
        bullet("p",g.p.list.Player[0][5][0] + 25,450,g.p.list.Player[0][5][5]);
        g.p.list.Player[0][5][6] = g.p.list.Player[0][5][6] - 10;
      }
      break;
    case "j":
      if (g.p.list.Player[0][6][6] > 10) {
        bullet("p",g.p.list.Player[0][6][0] + 25,450,g.p.list.Player[0][6][5]);
        g.p.list.Player[0][6][6] = g.p.list.Player[0][6][6] - 10;
      }
      break;
    case "k":
      if (g.p.list.Player[0][7][6] > 10) {
        bullet("p",g.p.list.Player[0][7][0] + 25,450,g.p.list.Player[0][7][5]);
        g.p.list.Player[0][7][6] = g.p.list.Player[0][7][6] - 10;
      }
      break;
    case "l":
      if (g.p.list.Player[0][8][6] > 10) {
        bullet("p",g.p.list.Player[0][8][0] + 25,450,g.p.list.Player[0][8][5]);
        g.p.list.Player[0][8][6] = g.p.list.Player[0][8][6] - 10;
      }
      break;
    case ";":
      if (g.p.list.Player[0][9][6] > 10) {
        bullet("p",g.p.list.Player[0][9][0] + 25,450,g.p.list.Player[0][9][5]);
        g.p.list.Player[0][9][6] = g.p.list.Player[0][9][6] - 10;
      }
      break;
    default:
      pause();
  }
}

function pause() {
  if (g.game.paused) { // if paused, begin animation again
    start_animation();
  } else { // if unpaused, clear the animation
    stop_animation();
  }
  g.game.paused = !g.game.paused;
}

var width, height;
var intervalId = 0; 

// initialize game
function init() {
  width = 1000;
  height = 800;
  buildECityList();
  buildEGearList();
  buildEShieldList(4,0);
  buildPGearList();
  buildPList();
  buildPShieldList();
  
  start_animation();
}

function reload() {
  stop_animation(); // clear out the animation - it's cause the ball to speed up
  init();
}

function draw() {
  // before drawing, change the fill color
  clear();
  drawBG();
  
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
  if (g.e.pos.X <= 105) {
    g.e.pos.dX = 1;
  } else if (g.e.pos.X >= 845) {
    g.e.pos.dX = -1;
  }
  g.e.pos.X = g.e.pos.X + g.e.pos.dX;

  // Enemy energy growth
  if (g.e.energy.Gear < 791) {
    g.e.energy.Gear += g.e.energy.GearRate;
  }

  // Player energy growth
  if (g.p.energy.Gear < 791) {
    g.p.energy.Gear += 1;
  }

  // Check enemy energy level
  for (let i = 0; i < 10; i++) {
    if ((855 - g.e.energy.Gear) >= g.const.GEARLEVELLIST[i]) {
      break;
    } else {
      g.e.list.Gear[i][4] = "gold";
    }
  }

  // Check player energy level
  for (let i = 0; i < 10; i++) {
    if ((855 - g.p.energy.Gear) > g.const.GEARLEVELLIST[i]) {
      break;
    } else {
      g.p.list.Gear[i][4] = "gold";
    }
  }

  // Move the player
  for (let r = 0; r < 4; r++) {
      if (g.p.list.Player[0][9][0] > 845) {
        g.p.pos.X = -1;
      } 
      if (g.p.list.Player[0][0][0] < 110) {
        g.p.pos.X = 1;
      }
    for (let c = 0; c < 10; c++) {
      g.p.list.Player[r][c][0] += g.p.pos.X;
      
      // Power up the player
      if (g.p.list.Player[r][c][6] < 100) {
        g.p.list.Player[r][c][6] += g.p.energy.Bullet;
      }
    }
  }
  
  // Make the gun fire
  // Let's just make it move first
  if (g.e.list.Bullet.length > 0) {
    for (let i = 0; i < g.e.list.Bullet.length; i++) {
      g.e.list.Bullet[i][1] = g.e.list.Bullet[i][1] - 2;
    }
  }
  if (g.p.list.Bullet.length > 0) {
    for (let i = 0; i < g.p.list.Bullet.length; i++) {
      g.p.list.Bullet [i][1] = g.p.list.Bullet [i][1] + 2;
    }
  }
  drawWall();
}

function start_animation() {
  intervalId = setInterval(draw, 10);
  //update_score_text();
}

function stop_animation() {
  clearInterval(intervalId);
}

//-------------------------
// MAIN EXECUTION
//-------------------------
theGame = document.getElementById("myCanvas");
theGame.addEventListener('keydown', function(event) {
  onKeyDown(event);
}, false);
init();







// used to draw the ball
//function circle(x, y, r) {
//  CTX.beginPath();
//  CTX.arc(x, y, r, 0, Math.PI * 2, true);
//  CTX.closePath();
//  CTX.fill();
//}

// used to draw each brick & the paddle
//function rect(x, y, w, h) {
//  CTX.beginPath();
//  CTX.rect(x, y, w, h);
//  CTX.closePath();
//  CTX.fill();
//}

// clear the screen in between drawing each animation
//function clear() {
//  g.CTX.clearRect(0, 0, width, height);
  //rect(0, 0, width, height);
//}

// What do to when the mouse moves within the canvas
//function onMouseMove(evt) {
  // set the paddle position if the mouse position 
  // is within the borders of the canvas
  //if (evt.pageX > g.CANVASMINX && evt.pageX < g.CANVASMAXX) {
    //paddlex = Math.max(evt.pageX - g.CANVASMINX - (paddlew / 2), 0);
    //paddlex = Math.min(width - paddlew, paddlex);
  //}
//}

//function onKeyDown(evt) {
  //evt.preventDefault();
  
  //}
  //if (event.key = "a") {
    //bullet("e", g.e.pos.X + 25,620);
    //bullet("p",g.p.list.Player[0][0][0] + 25,450);
  //}
  //pause();
//}

//function pause() {
  //if (g.game.paused) { // if paused, begin animation again
    //start_animation();
  //} else { // if unpaused, clear the animation
    //stop_animation();
  //}
 // g.game.paused = !g.game.paused;
//}

// initialize array of bricks to be visible (true)
//function init_bricks() {
  //bricks = new Array(nrows);
  //brickColor = new Array(nrows);
  //for (i = 0; i < nrows; i++) { // for each row of bricks
    //bricks[i] = new Array(ncols);
    //brickColor[i] = new Array(ncols);
    //for (j = 0; j < ncols; j++) { // for each column of bricks
      //bricks[i][j] = true;
      //brickColor[i][j] = "";
    //}
  //}
//}

// render the bricks
//function draw_bricks() {
  //for (i = 0; i < nrows; i++) { // for each row of bricks
    //for (j = 0; j < ncols; j++) { // for each column of bricks
      // set the colors to alternate through
      // all colors in brick_colors array
      // modulus (%, aka remainder) ensures the colors
      // rotate through the whole range of brick_colors
      //CTX.fillStyle = brick_colors[(i + j) % brick_colors.length];
      //brickColor[i][j] = brick_colors[(i + j) % brick_colors.length];
      //if (bricks[i][j]) {
        //rect((j * (brickWidth + padding)) + padding,
          //(i * (brickHeight + padding)) + padding,
          //brickWidth, brickHeight);
      //}
    //}
  //}
//}





//var x = 200;      // starting horizontal position of ball
//var y = 150;      // starting vertical position of ball
//var dx = 1;       // amount ball should move horizontally
//var dy = -3;      // amount ball should move vertically
// variables set in init()
//var width, height;//, paddlex, bricks, brickWidth;
//var paddleh = 10; // paddle height (pixels)
//var paddlew = 75; // paddle width (pixels)
//var g.CANVASMINX = 0; // minimum canvas x bounds
//var g.CANVASMAXX = 0; // maximum canvas x bounds
//var intervalId = 0; // track refresh rate for calling draw()
//var nrows = 6; // number of rows of bricks
//var ncols = 8; // number of columns of bricks
//var brickHeight = 15; // height of each brick
//var padding = 1;  // how far apart bricks are spaced
//var paused = false; // keeps track of whether the game is paused (true) or not (false)
//var ballRadius = 10; // size of ball (pixels)
// change colors of bricks -- add as many colors as you like
//var brick_colors = ["burlywood", "chocolate", "firebrick", "midnightblue"];
//var paddlecolor = "black";
//var ballcolor = "black";


//var next = 20;
//var direction = "right";

// initialize game
//function init() {
  //width = 1000;
  //height = 800;
  //paddlex = width / 2;
  //brickWidth = (width / ncols) - 1;
  //g.CANVASMINX = 0;
  //g.CANVASMAXX = g.CANVASMINX + width;
  // run draw function every 10 milliseconds to give 
  // the illusion of movement
  //init_bricks();
  //buildECityList();
  //buildEGearList();
  //buildEShieldList(4,0);
  //buildPGearList();
  //buildPList();
  //buildPShieldList();
  
  //start_animation();
  //bullet("e",eX,620);
//}

//function reload() {
  //stop_animation(); // clear out the animation - it's cause the ball to speed up
  //x = 200;      // starting horizontal position of ball
  //y = 150;      // starting vertical position of ball
  //dx = 1;       // amount ball should move horizontally
  //dy = -3;      // amount ball should move vertically
  //score = 0;
  //next = 0;
  //init();
//}

//function draw() {
  // before drawing, change the fill color
  //clear();
  //drawBG();
  
  //CTX.fillStyle = ballcolor;
  //draw the ball
  //circle(x, y, ballRadius);
  //CTX.fillStyle = paddlecolor;
  //draw the paddle
  //rect(paddlex, height - paddleh, paddlew, paddleh);
  //draw_bricks();

  //check if we have hit a brick
  //rowheight = brickHeight + padding;
  //colwidth = brickWidth + padding;
  //row = Math.floor(y / rowheight);
  //col = Math.floor(x / colwidth);
  //if so reverse the ball and mark the brick as broken
  //if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
    //dy = -dy;
    //bricks[row][col] = false;
    //"burlywood", "chocolate", "firebrick", "midnightblue"
    //switch (brickColor[row][col]) {
      //case "burlywood":
        //score = score + 10;
        //break;
      //case "chocolate":
        //score = score + 20;
        //break;
      //case "firebrick":
        //score = score + 5;
        //break;
      //case "midnightblue":
        //score = score + 1;
        //break;
      //default:
      // code block
    //}
    //score = score + 1;
    //update_score_text();
  //}

  //contain the ball by rebouding it off the walls of the canvas
  //if (x + dx > width || x + dx < 0)
    //dx = -dx;

  //if (y + dy < 0) {
    //dy = -dy;
  //} else if (y + dy > height - paddleh) {
    // check if the ball is hitting the 
    // paddle and if it is rebound it
    //if (x > paddlex && x < paddlex + paddlew) {
      //dy = -dy;
    //}
  //}
  //if (y + dy > height) {
    //game over, so stop the animation
    //stop_animation();
  //}
  //x += dx;
  //y += dy;
  //if (next > 20) {
    //direction = "left";
  //}
  //if (next < 0) {
    //direction = "right";
  //}
  //if (direction = "right") {
    //next += 2;
  //} else {
    //next = next - 2;
  //}
//}

//function update_score_text() {
  // You can send data to your HTML
  // just like setting styles in CSS
  // Put <div id="score"></div> in
  // your HTML for thjis text to display
  //$('#score').text("Score: " + score);
//}

//function start_animation() {
  //intervalId = setInterval(draw, 10);
  //update_score_text();
//}

//function stop_animation() {
  //clearInterval(intervalId);
//}

//-------------------------
// MAIN EXECUTION
// (CALLING FUNCTIONS)
//-------------------------
// main functionality begins here
// what should happen when the user moves the mouse?
//theGame = document.getElementById("myCanvas");
//document.mousemove(onMouseMove); // register the mouse move function
//document.keypress(onKeyPress);   // register onKeyPress function
//theGame.addEventListener('keydown', function(event) {
  //onKeyDown(event);
//}, false);
//theGame.addEventListener('mousemove', function(event) {
  //onMouseMove(event);
//}, false);
//init();                             // initialize & begin game

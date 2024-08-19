// Sprite object properties, functions and information
var objectGeneral =
  {
    // The tile map information of the image
    sourceX: 0,
    sourceY: 0,
    sourceH: 32,
    sourceW: 32,
    
    // The position information of the object on the canvas
      // vx, vy are the vectors of the sprite
    x: 0,
    y: 0,
    w: 32,
    h: 32,
    vx: 0,
    vy: 0,
    
    // State of the Object; 0 = dead, 1 = alive
    state: 1,
 
    // Getters
    centerX: function()
      {
        return this.x + (this.w / 2);
      },
    centerY: function()
      {
        return this.y + (this.h / 2);
      },
    halfWidth: function()
      {
        return this.w / 2;
      },
    halfHeight: function()
      {
        return this.h / 2;
      }
  };
  
var objectPlayerAlien =
  {
    // The tile map information of the image
    sourceX: 0,
    sourceY: 0,
    sourceH: 32,
    sourceW: 32,
    
    // The position information of the object on the canvas
      // vx, vy are the vectors of the sprite
      // l is the life (visibility) of th sprite
    x: 0,
    y: 0,
    w: 32,
    h: 32,
    vx: 0,
    vy: 0,
    l: true,
    
    // State of the Object; 0 = dead, 1 = alive
    state: 1,
    
    // How many hits can the alien take
    hp: 1,
    
    // What direction is the alien moving
    direction: "left",
    
    // What type of alien is it
    type: "normal",
    
    // Energy held by the alien
    power: 10,
    
    // Can the alien fire
    fire: 1
 
    // Getters
    centerX: function()
      {
        return this.x + (this.w / 2);
      },
    centerY: function()
      {
        return this.y + (this.h / 2);
      },
    halfWidth: function()
      {
        return this.w / 2;
      },
    halfHeight: function()
      {
        return this.h / 2;
      }
  };

//--- The alien object

var alienObject = Object.create(spriteObject);
alienObject.NORMAL = 1;
alienObject.EXPLODED = 2;
alienObject.state = alienObject.NORMAL;
alienObject.update = function()
{
  this.sourceX = this.state * this.width;
};

//--- The message object

var messageObject =
{
  x: 0,
  y: 0,
  visible: true,
  text: "Message",
  font: "normal bold 20px Helvetica",
  fillStyle: "red",
  textBaseline: "top"
};


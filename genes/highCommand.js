// Main Program body - this is an "immediate function" and keeps all variables locked within it so they don't interfere elsewhere
(function()
  {
    /* ###################################################################################################################################################### */
    // INITIALIZATION

    // Game variables
    var canvas = findHTML("canvas");        // Reference to the game grid
    var stage = canvas.getContext("2d");    // Reference to the 2d element of the game grid
    var sprites = [];                       // Sprite array holder
    var bullets = [];                       // Bullet sprite array holder
    var assetsLoaded = [];                  // Assets the game will use - images, sounds, etc
    var assetCount = 0;                     // Counter for the number of assests loaded
      
    // Constants
    var LOADING = 0;
    var PLAYING = 1;
    var PAUSE = 2;
    var OVER = 3;
        
    // Player variables
    var gameState = LOADING;                // Is the player alive
    var score = 0;                          // Score
    var playerEnergy = 0;                   // Energy level
    var playerAliens = [];                  // Array for player sprites
    
    // Computer variables
    var compEnergy = 0;                     // Energy level
    var compEnemy = [];                     // Array for computer sprites
    /* ###################################################################################################################################################### */
    
    /* ###################################################################################################################################################### */
    // ASSESTS
    
    // Load the tilesheet
    var tileSheet = new Image();
    tileSheet.addEventListener("load", loadHandler, false);
    tileSheet.src = "../scans/alienArmada.png";
    assetsLoaded.push(tileSheet);
    /* ###################################################################################################################################################### */
        
    /* ###################################################################################################################################################### */
    // OBJECTS
    
    // Background object
    var background = Object.create(objectGeneral);
    background.sourceX = 0;
    background.sourceY = 32;
    background.sourceH = 320;
    background.sourceW = 480;
    background.x = 0;
    background.y = 0;
    background.h = 320;
    background.w = 480;
    sprites.push(background);
    
    // Player starting aliens
    for(var i = 0; i < 40; ++i)
      {
        var tileSheet = Object.create(objectPlayerAlien);
        pAliens.push(t);
      }
    
    // Computer items
    //var compCannon = 
    /* ###################################################################################################################################################### */

    /* ###################################################################################################################################################### */
    // LISTENERS
    
    // Keyboard listener
    window.addEventListener("keydown", keyHandler, false);
    /* ###################################################################################################################################################### */
    
    /* ###################################################################################################################################################### */
    // GAMELOOP
    
    update();
    /* ###################################################################################################################################################### */
    
    /* ###################################################################################################################################################### */
    // FUNCTIONS
        
    // Main control of the player actions
    function keyHandler(event)
      {
        switch(event.keyCode)
          {
            case 49: /* 1 */
              conDisplay("1");
              break;
            case 50: /* 2 */
              conDisplay("2");
              break;
            case 51: /* 3 */
              conDisplay("3");
              break;
            case 52: /* 4 */
              conDisplay("4");
              break;
            case 53: /* 5 */
              conDisplay("5");
              break;
            case 54: /* 6 */
              conDisplay("6");
              break;
            case 55: /* 7 */
              conDisplay("7");
              break;
            case 56: /* 8 */
              conDisplay("8");
              break;
            case 57: /* 9 */
              conDisplay("9");
              break;
            case 48: /* 0 */
              conDisplay("0");
              break;
            default:
              conDisplay("NaN");
	       }
      }
    /* ####################################################################################################################################################### */
    
    /* ####################################################################################################################################################### */
    // HELPER FUNCTION
        
    /* Display some data in the console */
    function conDisplay(theText)
      {
        console.log(theText);
      };
        
    /* Joins two text string together with a space between */
    function joinText(firstString, secondString)
      {
        return firstString + " " + secondString;
      }
        
    /* Generates a random number */
    function ranNum(num1, num2, upDown)
      {
        if(upDown != null)
          {
    	    return Math.random() * num1;
          }
        else if(upDown)
          {
    	    return Math.ceil(Math.random() * num1);
          }
        else
          {
    	    return Math.floor(Math.random() * num1);
          }
      }
        
    /* Perform math on 2 numbers and return an integer */
    function intNum(calcType, num1, num2)
      {
        switch(calcType)
       	  {
        		case "+":
       			  return Math.round(num1 + num2);
         			break;
       			
        		case "-":
       			  return Math.round(num1 - num2);
         			break;
        		
            case "*":
         			return Math.round(num1 * num2);
         			break;
            
            case "/":
         			return Math.round(num1 / num2);
         			break;
            
        		default:
       			  return 0;
         	}
      }
      
    /* Return a HTML object */
    function findHTML(elementName)
      {
        return document.querySelector(elementName);
      }
    /* ####################################################################################################################################################### */
   }()
);
  
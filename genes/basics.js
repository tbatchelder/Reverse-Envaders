const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("scream");

ctx.fillStyle = "red";
ctx.fillRect(0, 0, 150, 75);

// Create a Canvas: above

// Define a new path
ctx.beginPath();

// Set a start-point
ctx.moveTo(0, 0);

// Set an end-point
ctx.lineTo(200, 100);

// Stroke it (Do the Drawing)
ctx.stroke();

ctx.beginPath();
ctx.arc(350, 50, 40, 0, 2 * Math.PI);
ctx.stroke();

// Draw a shield wall
// ctx.beginPath();
// ctx.arc(400,1000,450,86,86.1);
// ctx.lineWidth = 5;
// ctx.lineCap = "square";
// ctx.stroke();

let pushMe = true
for (let j = 500; j < 560; j += 10) {
  // for (let i = 85.4; i < 87.5; i += 0.2) {
  ctx.beginPath();
  if (pushMe) {
    for (let i = 20; i < 780; i += 40) {
      // ctx.moveTo(i, j);
      // ctx.lineTo(i + 10, j);
      // ctx.arc(400,1000,j,i,i + 0.1);
      // the filled rectangle
      ctx.fillStyle = "red";
      ctx.fillRect(i,j,30,10);

      // the outline rectangle
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.strokeRect(i,j, 30,10)
    }
    pushMe = false;
  } else {
      // ctx.arc(400,1000,j,i + 0.1, i + 0.2);
    for (let i = 40; i < 780; i += 40) {
    //   ctx.moveTo(i, j);
    //   ctx.lineTo(i + 10, j);
      pushMe = true;
            // the filled rectangle
      ctx.fillStyle = "red";
      ctx.fillRect(i,j,30,10);
      
      // the outline rectangle
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.strokeRect(i,j, 30,10)
    }
  }
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = "blue";
  // ctx.lineCap = "square";
  // ctx.stroke();
}

image.addEventListener("load", (e) => {
  ctx.drawImage(image, 10, 10);
});



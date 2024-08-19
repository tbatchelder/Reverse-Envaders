var animate, left = 0, imgObj = null;

function init() {

  imgObj = document.getElementById('myImage');
  imgObj.style.position = 'relative';
  imgObj.style.top = '240px';
  imgObj.style.left = '-300px';
  imgObj.style.visibility = 'hidden';

  moveRight();
}

function moveRight() {
  left = parseInt(imgObj.style.left, 10);

  if (10 >= left) {
    imgObj.style.left = (left + 5) + 'px';
    imgObj.style.visibility = 'visible';

    animate = setTimeout(function () { moveRight(); }, 20); // call moveRight in 20msec
  } else {
    stop();
    moveLeft();
  }
}

function moveLeft() {
  right = parseInt(imgObj.style.right, 10);

  if (right >= -300) {
    imgObj.style.right = (right + 5) + 'px';
    imgObj.style.visibility = 'visible';

    animate = setTimeout(function () { moveLeft(); }, 20); // call moveRight in 20msec
  } else {
    stop();
    moveRight();
  }
}

function stop() {
  clearTimeout(animate);
}

window.onload = function () { init(); };
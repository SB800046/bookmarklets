var appletDots = [];
var createdDots = 0;
var dotColor = "blue";
var enable = false;

addGui();

function clickCapture(event) {
  switch(event.which) {
    case 1: // Left-Click
      if(enable == true) {
        createNewDot(event);
      }
      break;
    case 2: // Middle-Click
      toggleOpertion();
      break;
    case 3: // Right-Click
      if(enable == true) {
        removeClosest(event);
      }
      break;
    default:
      break;
  }
  updateCount();
}

function toggleOpertion() {
  enable = !enable;
  if(enable) {
    disableContextMenu();
  }
  else {
    enableContextMenu();
  }
}

function counterDot(xPos, yPos) {
  this.dotId = "dot_" + createdDots++;
  this.xPosition = xPos;
  this.yPosition = yPos;
  this.color = dotColor;
  this.size = 4;
}

function createNewDot(event) {
  var mouseX = event.pageX;
  var mouseY = event.pageY;

  var newDot = new counterDot(mouseX, mouseY);
  appletDots.push(newDot);
  drawDot(newDot);
}

function findDots(xPos, yPos) {
  var foundDots = [];
  var currentDot;
  var distance;
  for(var i = 0; i < appletDots.length; i++) {
    currentDot = appletDots[i];
    distance = pythag(currentDot.xPosition, xPos, currentDot.yPosition, yPos);
    if(distance <= currentDot.size) {
      foundDots.push(currentDot);
    }
  }
  if(foundDots.length > 0) {
    foundDots.sort(function(a,b){return pythag(a.xPosition, xPos, a.yPosition, yPos) - pythag(b.xPosition, xPos, b.yPosition, yPos)});
    return foundDots;
  }
  else {
    return null;
  }
}

function removeDot(dot) {
  var toRemove = dot;
  document.body.removeChild(document.getElementById(toRemove.dotId));
  var dotIndex = appletDots.indexOf(toRemove);
  appletDots.splice(dotIndex, 1);
  if(appletDots.length == 0) {
    createdDots = 0;
  }
}

function removeClosest(event) {
  var mouseX = event.pageX;
  var mouseY = event.pageY;

  var dots = findDots(mouseX, mouseY);
  if(dots != null) {
    removeDot(dots[0]);
  }
}

function removeAll() {
  while(appletDots.length > 0) {
    removeDot(appletDots[0]);
  }
}

function drawDot(counterDot) {
  var newDot = document.createElement("div");
  newDot.id = counterDot.dotId;
  newDot.className = "cd-dot";
  newDot.style.height = (counterDot.size * 2) + "px";
  newDot.style.width = (counterDot.size * 2) + "px";
  newDot.style.borderRadius = counterDot.size + "px";
  newDot.style.background = counterDot.color;
  newDot.style.position = "absolute";
  newDot.style.left = (counterDot.xPosition - counterDot.size) + "px";
  newDot.style.top = (counterDot.yPosition - counterDot.size) + "px";
  document.body.appendChild(newDot);
}

function pythag(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function disableContextMenu() {
  document.addEventListener("contextmenu", prevent);
	document.addEventListener("selectstart", prevent);
}

function enableContextMenu() {
  document.removeEventListener("contextmenu", prevent);
	document.removeEventListener("selectstart", prevent);
}

function prevent(e) {
  e.preventDefault();
}

function cycleColor() {
	var colors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"];
	var pos = colors.indexOf(dotColor);
	dotColor = colors[++pos % colors.length];
	document.getElementById("js_counterBox").style.color = dotColor;
}

function addGui() {
  var counterBox = document.createElement("div");
  counterBox.id = "js_counterBox";
  counterBox.style.padding = "10px";
  counterBox.style.borderRadius = "4px";
  counterBox.style.color = dotColor;
  counterBox.style.fontFamily = "sans-serif";
  counterBox.style.background = "#696969";
  counterBox.style.position = "fixed";
  counterBox.style.zIndex = "512";
	counterBox.onclick = cycleColor;
	counterBox.title = "LeftClick: place dot | RightClick: Remove selected dot | MiddleClick: Remove all dots | Click this counter to change colour";
	document.body.appendChild(counterBox);

  updateCount();
}

function updateCount() {
  document.getElementById("js_counterBox").innerHTML = appletDots.length;
}

document.addEventListener("mousedown", clickCapture);

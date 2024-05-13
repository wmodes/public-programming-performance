/**
* 
* Created initally by Wes Modes and CMPM department for CMPM 147
* 
* Modified by CMPM 147 class on 5/10/2024
* 
*/

"use strict";

//world seed declaration
let worldSeed;

//color declaration, only used once
let trimColor;

//array to encapsulate boat objext
var boats = [];

//Ripple globals
let rippleYOffsets = {};
let activeRipples = [];

//empty clicks object which will store instances of clicks on a specific tile
let clicks = {};

//colors
let islandHighColor
let islandLowColor
let islandColor1
let islandColor2
let islandColor3
let islandColor4
let islandColor5

/**
 * @function p3_preload preload any required content before setup
 * @returns {void}
 */
function p3_preload() { }

/**
 * @function p3_setup setup function that can be run inside p5 setup()
 * @returns {void}
 */
function p3_setup() {
  islandHighColor = color(252, 240, 0);// Bright Yellow
  islandLowColor = color(252, 180, 0); // Bright Orange
  islandColor1 = color("#F9EDE3"); // Light Sand
  islandColor2 = color("#E3D2B5"); // Dark Sand
  islandColor3 = color("#BCD817"); // light vegetation
  islandColor4 = color("#686D35"); // Dark vegetation
  islandColor5 = color("#B7A487"); // Rock
}

/**
 * @function p3_worldKeyChanged updates the seed value based on a given world key
 * @param {string | number} key the key to be hashed and seeded into engine
 * @returns {void} 
 */
function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  trimColor = random(['red', '#44ff88', '#aaeeff']);
}

/**
 * @function p3_tileWidth getter for current tile width
 * @returns {number}
 */
function p3_tileWidth() {
  return 32;
}

/**
 * @function p3_tileHeight getter for current tile height
 * @returns {number}
 */
function p3_tileHeight() {
  return 16;
}

//array refrence to both getters for width and height
let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

/**
 * @function p3_tileClicked refrence tracker for any tiles that have been clicked on. Increments a value stored in the clicks objet.
 * @param {number} i the x coordinate corresponding to the tile location that was clicked
 * @param {number} j the y coordinate corresponding to the tile location that was clicked
 * @returns {void}
 */
function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  // addBoat(i, j);
  activeRipples.push(new Ripple(i, j));
}

/**
 * @function p3_drawBefore any prerendering can be done here
 * @returns {void}
 */
function p3_drawBefore() { }

/**
 * @function p3_drawTile renders a tile at the appropriate x,y coordinate in the array
 * @param {number} i the x coordinate within the array to render at
 * @param {number} j the y coordinate within the array to render at
 8 @returns {void}
*/

function p3_drawTile(i, j) {

  // do not write any logic in here, just call functions that have been written

  noStroke();
  push();

  let onIsland = renderTerrain(i, j);
  //click logic
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    if (!onIsland) {
      //base boat drawing logic
      drawBoat();
    } else {
      //TODO: clicking on island...
    }
  }
  pop();
}

/**
 * @function p3_drawSelectedTile draw an outline over the mouse cursers hovered tile
 * @param {number} i the x coordinate of the tile
 * @param {number} j the y coordinate of the tile
 * @returns {void}
*/
function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

/**
 * @function p3_drawAfter post drawing render function
 * @returns {void}
 */
function p3_drawAfter() { }



//*****************************************************CLASS FUNCTIONS GO BELOW HERE **************************************************************************************/
/**
 * @function renderTerrain render islands across the water, elevates the islands slightly. Sets boolean flag for ship placement.
 * @param {number} i the x coordinate of given tile
 * @param {number} j the y coordinate of given tile
 * @returns {boolean} boolean value for given i and j
 */
function renderTerrain(i, j) {

  // Time, apply this change noise  
  let t = millis() / 1000.0

  //terrain code - Luke
  let zoom = 0.1;
  let noiseVal = noise(i * zoom, j * zoom);
  let colorVal;
  let onIsland = false;

  if (!isIsland(i, j)) {
    colorVal = color(100, 150, 233, 64 + 256 * noise(-t + i / 5, j / 5, t));
    fill(colorVal);
    extruded_tile(0, colorVal)
  }
  else {
    colorVal = lerpColor(islandHighColor, islandLowColor, map(noiseVal, .5, 1, 0, 1));
    fill(colorVal);
    onIsland = true;
    extruded_tile(map(noiseVal, .6, .8, 5, 25), colorVal)
  }

  return onIsland
}

/**
 * @function extruded_tile 
 * @param {number} height the height to raise the tile by
 * @param {number} colorVal color value to fill extruded tile with
 * @returns {void}
 * @author Luke
 */
function extruded_tile(height, colorVal) {
  fill(colorVal)
  //top
  beginShape();
  vertex(-tw, 0 + height);
  vertex(0, th + height);
  vertex(tw, 0 + height);
  vertex(0, -th + height);
  endShape(CLOSE);
  if (height > 0) {
    fill(modifyColor(colorVal, .2, 0));
    //left
    beginShape();
    vertex(-tw, 0 + height);
    vertex(-tw, 0);
    vertex(0, th);
    vertex(0, th + height);
    endShape(CLOSE);

    fill(modifyColor(colorVal, .2, 1));
    //right
    beginShape();
    vertex(tw, 0 + height);
    vertex(tw, 0);
    vertex(0, th);
    vertex(0, th + height);
    endShape(CLOSE);
  }
}

/**
 * 
 * @param {p5.color} col color value from p5 lib
 * @param {number} factor scalar number to modify color by
 * @param {?} type unused as of now...
 * @returns {p5.color}
 */
function modifyColor(col, factor, type) {
  //luke
  let r = red(col);
  let g = green(col);
  let b = blue(col);

  if (type == 0) {
    r = min(255, r + 255 * factor);
    g = min(255, g + 255 * factor);
    b = min(255, b + 255 * factor);
  }
  else {
    r *= (1 - factor);
    g *= (1 - factor);
    b *= (1 - factor);
  }

  return color(r, g, b);
}

/**
 * @function isIsland determine if the given i,j location is a tile...
 * @param {number} i i coordinate to check
 * @param {number} j j coordinate to check
 * @returns {boolean}
 * @author {Aiden}
 */
function isIsland(i, j) {
  let zoom = 0.1;
  let noiseVal = noise(i * zoom, j * zoom);
  return noiseVal < .5;
}

/**
 * @function isAdjacent
 * @param {number}
 * @param {number}
 * @param {number}
 * @param {number}
 * @author Aiden
 */
function isAdjacent(i1, j1, i2, j2) {
  if (j1 === j2) {
    if (i1 === i2 + 1 || i1 === i2 - 1) {
      console.log([i1, j1, i2, j2]);
      return true;
    }
  }
  if (i1 === i2) {
    if (j1 === j2 + 1 || j1 === j2 - 1) {
      console.log([i1, j1, i2, j2]);
      return true;
    }
  }
  return false;
}

/**
* @function drawBoat renders a boat to the canvas
* @returns {void}
* @author James
*  James is here!
*  Lets start with drawing the new boats instead of the lawn chairs
*  I'm gonna try to make a 1 tile boat here:
*  This code is straight from chat gpt
*  I'm gonna try to make it smaller and map it to a tile. 
*/
function drawBoat() {
  // basic boat shape v1.0
  let bh = 20; // boat height
  // front face
  fill("#65350f");
  beginShape();
  vertex(-10 / 16 * tw, -2 / 16 * th); // 0
  vertex(-10 / 16 * tw, -2 / 16 * th - bh); // 0^
  vertex(1 / 8 * tw, 5 / 8 * th - bh); // 3^
  vertex(1 / 8 * tw, 5 / 8 * th); // 3
  endShape();

  // side face
  fill("#3c280d")
  beginShape();
  vertex(10 / 16 * tw, 2 / 16 * th); // 2
  vertex(10 / 16 * tw, 2 / 16 * th - bh); // 2^
  vertex(1 / 8 * tw, 5 / 8 * th - bh); // 3^
  vertex(1 / 8 * tw, 5 / 8 * th); // 3
  endShape();

  // top face
  fill("#3f301d")
  beginShape();
  vertex(-10 / 16 * tw, -2 / 16 * th - bh); // 0
  vertex(-1 / 8 * tw, -5 / 8 * th - bh); // 1
  vertex(10 / 16 * tw, 2 / 16 * th - bh); // 2
  vertex(1 / 8 * tw, 5 / 8 * th - bh); // 3
  endShape();
}

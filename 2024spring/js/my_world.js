/**
* 
* Created initally by Wes Modes and CMPM department for CMPM 147
* 
* Modified by CMPM 147 class on 5/10/2024
* 
*/

"use strict";

//
// GLOBALS
//

//world seed declaration
let worldSeed;

//color declaration, only used once
let trimColor;

//array to encapsulate boat objext
var boats = [];

//Ripple globals
let activeRipples = [];

//empty clicks object which will store instances of clicks on a specific tile
let clicks = {};
let peopleTiles = {}
//colors
let islandHighColor
let islandLowColor
let islandColor1
let islandColor2
let islandColor3
let islandColor4
let islandColor5
let islandColors

// instantiate some objects in the global state
// ideally, this whole file would be its own manager class
// and these would be instantiated in the constructor
// but that's a can of worms for another day
const tiles = new TileRenderer();

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
  islandColors = [
    color("#F9EDE3"), // Light Sand
    color("#E3D2B5"), // Dark Sand
    color("#BCD817"), // light vegetation
    color("#686D35"), // Dark vegetation
    color("#B7A487"), // Rock
  ];
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
  if(!tile.isIsland(i, j)){
    addBoat(i, j);
  } else {
    addPerson(i,j)
  }
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
 * @returns {void}
*/

function p3_drawTile(i, j) {

  // do not write any logic in here, just call functions that have been written

  noStroke();
  push();

  let onIsland = tile.renderTerrain(i, j);
  //click logic
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    if (onIsland) {
      // draw the people 
      //drawPerson(i,j)
    }
  }
  Boat.drawBoats(i, j);
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
function p3_drawAfter() {
  for (const ripple of activeRipples) {
    for (const key of Object.keys(ripple.rippleYOffsets)) {
      console.log(key)
    }

    //ripple.update()
  }
}


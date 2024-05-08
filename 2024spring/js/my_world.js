/**
 * 
 * Created initally by Wes Modes and CMPM department for CMPM 147
 * 
 * Modified by CMPM 147 class on 5/8/2024
 * 
 */

"use strict";


//world seed declaration
let worldSeed;

//color declaration, only used once
let trimColor;

/**
 * @function p3_preload preload any required content before setup
 * @returns {void}
 */
function p3_preload() { }


/**
 * @function p3_setup setup function that can be run inside p5 setup()
 * @returns {void}
 */
function p3_setup() { }


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

//empty clicks object which will store instances of clicks on a specific tile
let clicks = {};

/**
 * @function p3_tileClicked refrence tracker for any tiles that have been clicked on. Increments a value stored in the clicks objet.
 * @param {number} i the x coordinate corresponding to the tile location that was clicked
 * @param {number} j the y coordinate corresponding to the tile location that was clicked
 * @returns {void}
 */
function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

/**
 * @function isIsland
 * @param {number} i the x coordinate to verify
 * @param {number} j the y coordinate to verify
 * @returns {boolean}
 * @author Will
 */
function isIsland(i, j) {
  return noise(i * 0.001, j * 0.001) > 0.5
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

  noStroke();
  //terrain code - Luke
  let zoom = 0.1;
  let noiseVal = noise(i * zoom, j * zoom);
  let terrainType;
  let colorVal;
  if (noiseVal < .6) {
    terrainType = 'water';
    colorVal = color(0, map(noiseVal, 0, 1, 20, 100), map(noiseVal, 0, 1, 50, 255));
    fill(colorVal);
  }
  else {
    terrainType = 'sand'
    colorVal = color(252, map(noiseVal, .5, 1, 240, 180), 0);
    fill(colorVal);
  }


  //let boatWidth = 5;

  // Old code for drawing lawn chair
  let onBoat = false;

  // // Draws the water1 *
  // if (true/*on island*/) {
  //   // water
  //   let t = millis()/1000.0
  //   fill(100, 150, 233, 64+256*noise(-t+i/5,j/5,t));
  //   //
  // }
  // else {//on island

  // }

  // calling boat function
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    // drawBoat()
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();
}


/**
 * @function drawBoat renders a boat to the canvas
 * @returns {void}
 * @author James
 * 
 *  James is here!
 *  Lets start with drawing the new boats instead of the lawn chairs
 *  I'm gonna try to make a 1 tile boat here:
 *  This code is straight from chat gpt
 *  I'm gonna try to make it smaller and map it to a tile. 
 */
function drawBoat() {

  fill(boatColor);
  beginShape();
  vertex(-50, 0, 0);
  vertex(50, 0, 0);
  vertex(40, -30, 0);
  vertex(-40, -30, 0);
  endShape(CLOSE);

  // Draw boat base
  fill(boatColor);
  beginShape();
  vertex(-50, 0, 0);
  vertex(50, 0, 0);
  vertex(50, 0, 20);
  vertex(-50, 0, 20);
  endShape(CLOSE);

  // Draw sail
  fill(255);
  beginShape();
  vertex(0, -50);
  vertex(0, 50);
  vertex(0, 50);
  vertex(50, 0);
  vertex(0, -50);
  endShape(CLOSE);
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
 * @function extruded_tile 
 * @param {number} height the height to raise the tile by
 * @param {?} color unused as of now
 * @returns {void}
 * @author Luke
 */
function extruded_tile(height, color) {
  //top face
  beginShape();
  vertex(-tw, 0 + height);
  vertex(0, th + height);
  vertex(tw, 0 + height);
  vertex(0, -th + height);
  endShape(CLOSE);
  //left face
  //right face
}

/**
 * @function p3_drawAfter post drawing render function
 * @returns {void}
 */
function p3_drawAfter() { }

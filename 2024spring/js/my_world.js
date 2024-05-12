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

//array to encapsulate boat objext
var boats = [];

/**
 * boat object
 * @class 
 */
class Boat {
  static updateInterval = 250
  static headingMomentum = 0.9
  /**
   * @constructor 
   * @param {number} x x coordinate to render to
   * @param {number} y y coordinate to rener to 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tiles = {};
    this.color = color(Math.random() * 255);
    this.dist = 0;
    this.lastUpdateTime = 0;
    this.heading = "N";
  }

  /**
   * @returns {undefined}
   */
  draw() {

  }

  /**
   * @returns {void}
   */
  update() {
    if (millis() - this.lastUpdateTime > Boat.updateInterval) {
      return;
    }
    this.lastUpdateTime = millis();
    if (random() > Boat.headingMomentum) {
      // Change Heading
    }
    
    // Move
    
  }

  /**
   * @param {number} i x coordinate to add to
   * @param {number} j y coordinate to add to
   * @returns {void}
   */
  addBoatTile(i, j){
    let tmpDist = dist(this.x, this.y, i, j);
    //this.tiles.push({i:i - this.x, j:j - this.y, dist: tmpDist});
    this.tiles[[i - this.x, j - this.y]] = {i:i - this.x, j:j - this.y, dist: tmpDist};
    if(tmpDist > this.dist){
      this.dist = tmpDist;
    }
  }

  boatTiles = {}; 
  // boatTiles[[i, j]] = 1;
  
  /*
  checkMove(di, dj){
    for(let tile in this.tiles){
      if(isIsland(this.x + tile.i + di, this.y + tile.j + dj)){
        return false;
      }
    }
    return true;
  }
  */

}

/*
var sqDist = function(x1, y1, x2, y2){
  return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
};
*/

/**
 * @function isAdjacent
 * @param {number}
 * @param {number}
 * @param {number}
 * @param {number}
 * @author Aiden
 */
var isAdjacent = function(i1, j1, i2, j2) {
  if(j1 === j2){
    if(i1 === i2 + 1 || i1 === i2 - 1){
      console.log([i1, j1, i2, j2]);
      return true;
    }
  }
  if(i1 === i2){
    if(j1 === j2 + 1 || j1 === j2 - 1){
      console.log([i1, j1, i2, j2]);
      return true;
    }
  }
  return false;
}

/**
 * @function addBoat
 * @author Aiden
 * @param {number}
 */
var addBoat = function(i, j){
  for(let o = 0; o < boats.length; o++){
    //console.log(dist(i, j, boats[o].x, boats[o].y) + "----" + boats[o].dist);
    if(dist(i, j, boats[o].x, boats[o].y) < boats[o].dist + 4){
      //for(let p = 0; p < boats[o].tiles.length; p++){
      for(let tile in boats[o].tiles){
        let I = tile.i;
        let J = tile.j;
        
        if(isAdjacent(i, j, boats[o].x + tile.i, boats[o].y + tile.j)){
          boats[o].addBoatTile(i, j);
          return;
        }
      }
    }
  }
  let tmp = new Boat(i, j);
  tmp.addBoatTile(i, j);
  boats.push(tmp);
}



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

// WILL'S RIPPLE CLASS

let rippleYOffsets = {};
let activeRipples = [];

/**
 * boat object
 * @class 
 */
class Ripple {
  /**
   * @constructor 
   * @param {number} i i coordinate of ripple center
   * @param {number} j j coordinate of ripple center
   */
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.maxRadius = 10;
    this.currentRadius = 0;
    this.maxHeight = 10;
    this.currentHeight = this.maxHeight;
    this.speed = 0.1; // range of 0 to 1
  }
  /**
   * @returns {undefined}
   */
  update() {
    this.currentRadius += this.speed * this.maxRadius;
    this.currentHeight -= this.height * this.maxHeight;
    for (let i = this.i - this.maxRadius; i < this.i + this.currentRadius; i++) {
      for (let j = this.j - this.maxRadius; j < this.j + this.maxRadius; j++) {
        let distFromCenter = distance(this.i, this.j, i, j);
        let distanceFromRipple = abs(distFromCenter - this.currentRadius);
        rippleYOffsets[[i, j]] = constrain(lerp(this.currentHeight, 0, distanceFromRipple), 0, this.currentHeight);
      }
    }
  }
}

/**
 * @function p3_tileClicked refrence tracker for any tiles that have been clicked on. Increments a value stored in the clicks objet.
 * @param {number} i the x coordinate corresponding to the tile location that was clicked
 * @param {number} j the y coordinate corresponding to the tile location that was clicked
 * @returns {void}
 */
function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  addBoat(i, j);
  activeRipples.push(new Ripple(i, j));
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

  //refactored most of the body here to a function for legibility
  let onIsland = renderTerrain(i, j);

  push();

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) { //click logic
    if (!onIsland) { //base boat drawing logic
      //drawBoat();
      //fill(139, 69, 19);
    } else {
      //TODO: clicking on island...
      // drawPerson()
    }
  }


  for(let I = 0; I < boats.length; I++){
    //for(let O = 0; O < boats[I].tiles.length; O++){
    for(let tile in boats[I].tiles){
      if(i === boats[I].x + tile.i && j === boats[I].y + tile.j){
        fill( boats[I].color);
        beginShape();
        vertex(-tw, 0);
        vertex(0, th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
        // temp 
        //drawBoat();
      }
    }
  }


  
  pop();
}

var isIsland = function(i, j){
  let zoom = 0.1;
  let noiseVal = noise(i * zoom, j * zoom);
  let terrainType;
  let colorVal;
  let onIsland = false;
  return noiseVal < .5;
}

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
  let terrainType;
  let colorVal;
  let onIsland = false;
  if (!isIsland(i,j)) {
    terrainType = 'water';
    colorVal = color(100, 150, 233, 64 + 256 * noise(-t + i / 5, j / 5, t));
    fill(colorVal);
  }
  else {
    // wes adding more colors here...
    terrainType = 'sand'
    // let lerpValue = map(noiseVal, .6, 1, 0, 1) + map           *declared but never read
    let islandHighColor = color(252, 240, 0);// Bright Yellow
    let islandLowColor = color(252, 180, 0); // Bright Orange
    // let islandColor1 = color("#F9EDE3"); // Light Sand
    // let islandColor2 = color("#E3D2B5"); // Dark Sand
    // let islandColor3 = color("#BCD817"); // light vegetation
    // let islandColor4 = color("#686D35"); // Dark vegetation
    // let islandColor5 = color("#B7A487"); // Rock
    colorVal = lerpColor(islandHighColor, islandLowColor, map(noiseVal, .5, 1, 0, 1));
    fill(colorVal);
    onIsland = true;
    extruded_tile(0 ,colorVal)
  }



  // elevate islands
  if (terrainType == 'sand') {
  // p3_drawTile is rendering over this causing it to break
    extruded_tile(map(noiseVal,.6,.8,5,25),colorVal)
  }
  else{
    extruded_tile(0 ,colorVal)
    }

  return onIsland
}

// Boat Stuff -------------------------------------------------------
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

function drawBoat(){
  // this code is straight from chat gpt
  // I'm gonna try to make it smaller and map it to a tile.
  drawBoatv2();
  
}
function drawBoatv2() {
    // basic boat shape v1.0
    let bh = 20; // boat height
    
    // front face
    fill("#65350f");
    beginShape();
    vertex(-10/16*tw, -2/16*th); // 0
    vertex(-10/16*tw, -2/16*th-bh); // 0^
    vertex(1/8*tw, 5/8*th-bh); // 3^
    vertex(1/8*tw, 5/8*th); // 3
    endShape();
    
    // side face
    fill("#3c280d")
    beginShape();
    vertex(10/16*tw, 2/16*th); // 2
    vertex(10/16*tw, 2/16*th-bh); // 2^
    vertex(1/8*tw, 5/8*th-bh); // 3^
    vertex(1/8*tw, 5/8*th); // 3
    endShape();
    
    // top face
    fill("#3f301d")
    beginShape();
    vertex(-10/16*tw, -2/16*th-bh); // 0
    vertex(-1/8*tw, -5/8*th-bh); // 1
    vertex(10/16*tw, 2/16*th-bh); // 2
    vertex(1/8*tw, 5/8*th-bh); // 3
    endShape();
  }
function drawOneBoat(){
  let boatColor = 'brown';
  fill(boatColor);
  beginShape();
  vertex(-5, 0, 0);
  vertex(5, 0, 0);
  vertex(4, -3, 0);
  vertex(-4, -3, 0);
  endShape(CLOSE);

  // Draw boat base
  fill(boatColor);
  beginShape();
  vertex(-5, 0, 2);
  vertex(5, 0, 2);
  vertex(5, 0, 0);
  vertex(-5, 0, 0);
  endShape(CLOSE);

  // Draw sail
  fill(255);
  beginShape();
  vertex(0, -12);
  vertex(0, -2);
  vertex(0, -2);
  vertex(5, -7);
  vertex(0, -12);
  endShape(CLOSE);

}

// 
/*
function checkboat(i,j){ // If there is a boat on this tile return true
  if ( clicks[[i,j]] || 0 == true){
    return(true)
  }
  return(false);
}

function boatCode i, j) { // returns 
  // In the order: North, South, East, West
  let n = checkboat( i - 1, j) ? 0 : 1;
  let s = checkboat( i + 1, j) ? 0 : 1;
  let e = checkboat( i , j + 1) ? 0 : 1;
  let w = checkboat( i , j - 1) ? 0 : 1;
  return (n << 0) + (s << 1) + (e << 2) + (w << 3);
}


  
*/
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
 * @param {number} colorVal color value to fill extruded tile with
 * @returns {void}
 * @author Luke
 */
function extruded_tile(height, colorVal) {
  fill(colorVal)
  //top
  beginShape();
  vertex(-tw, 0-height);
  vertex(0, th-height);
  vertex(tw, 0-height);
  vertex(0, -th-height);
  endShape(CLOSE);
  if(height>0){
    fill(modifyColor(colorVal,.2,0));
    //left
    beginShape();
    vertex(-tw, 0-height);
    vertex(-tw,0);
    vertex(0, th);
    vertex(0, th-height);
    endShape(CLOSE);

    fill(modifyColor(colorVal,.2,1));
    //right
    beginShape();
    vertex(tw,0-height);
    vertex(tw,0);
    vertex(0, th);
    vertex(0, th-height);
    endShape(CLOSE); 
  }
}
function modifyColor(col, factor, type) {
  //luke
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  
  if(type==0){
    r = min(255, r + 255 * factor);
    g = min(255, g + 255 * factor);
    b = min(255, b + 255 * factor);
  }
  else{
    r *= (1 - factor);
    g *= (1 - factor);
    b *= (1 - factor);
  }
  
  return color(r, g, b);
}

/**
 * @function p3_drawAfter post drawing render function
 * @returns {void}
 */
// function p3_drawAfter() {
//   for (let ripple of activeRipples) {
//     ripple.update();  
//   }
// }


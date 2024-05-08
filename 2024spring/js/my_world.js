"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
var boats = [];
class boat {
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tiles = [];
    thi
  }

  draw() {
    //
  }
  
  addTile(i, j){
    this.tiles.push({i:i, j:j, sqDist: sqDist(this.x, this)});
  }


}

/*
var sqDist = function(x1, y1, x2, y2){
  return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
};
*/

var addBoat = function(i, j){
  //for(let o = 0; o < boats.length; o++){
  //  if() 
  //})
}




function p3_preload() {}

function p3_setup() {}

let worldSeed;

let trimColor;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  
  trimColor = random(['red','#44ff88','#aaeeff']);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}


function p3_drawBefore() {}

function p3_drawTile(i, j) {
  
  noStroke();
  // Time, apply this change noise  
  let t = millis() / 1000.0
  //terrain code - Luke
  let zoom = 0.1;
  let noiseVal = noise(i*zoom,j*zoom);
  let terrainType;
  let colorVal;
  let onIsland = false;
  if(noiseVal<.6){
    terrainType = 'water';
    colorVal = color(100, 150, 233, 64+256*noise(-t+i/5,j/5,t));
    fill(colorVal);
  }
  else{
    terrainType = 'sand'
    // colorVal = color(252,map(noiseVal,.5,1,240,180),0);
    let lerpValue = map(noiseVal, .6, 1, 0, 1) + map
    let islandHighColor = color(252, 240, 0);// Bright Yellow
    let islandLowColor = color(252, 180, 0); // Bright Orange
    colorVal = lerpColor(islandHighColor, islandLowColor, map(noiseVal, .5, 1, 0, 1));
    fill(colorVal);
    onIsland = true;

    // Height adjustingsh    
    // translate(
  }

  // Draw Boat
  if(!onIsland){
  let n = clicks[[i, j]] | 0;
     if (n % 2 == 1) {
      //drawBoat()
      fill(139,69,19);
     }
  }
  
  push();

  // function to elevate islands
  if (terrainType == 'sand') {
    translate(0, -5);
  }
  
 beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);


  pop();
}

// James is here!
// Lets start with drawing the new boats instead of the lawn chairs
// I'm gonna try to make a 1 tile boat here:
function drawBoat(){
  // this code is straight from chat gpt
  // I'm gonna try to make it smaller and map it to a tile.
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
  vertex(-5, 0, 0);
  vertex(5, 0, 0);
  vertex(5, 0, 2);
  vertex(-5, 0, 2);
  endShape(CLOSE);

  // Draw sail
  fill(255);
  beginShape();
  vertex(0, -5);
  vertex(0, 5);
  vertex(0, 5);
  vertex(5, 0);
  vertex(0, -5);
  endShape(CLOSE);
}


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

function extruded_tile(height,color){
  //luke
  //top face
  beginShape();
  vertex(-tw, 0+height);
  vertex(0, th+height);
  vertex(tw, 0+height);
  vertex(0, -th+height);
  endShape(CLOSE);
  //left face
  
  //right face
  
}
function p3_drawAfter() {}

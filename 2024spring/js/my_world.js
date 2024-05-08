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

// Will's Island Noise
function isIsland(i, j) {
  return noise(i * 0.001, j * 0.001) > 0.5
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  
  noStroke();
  //terrain code - Luke
  let zoom = 0.1;
  let noiseVal = noise(i*zoom,j*zoom);
  let terrainType;
  let colorVal;
  if(noiseVal<.6){
    terrainType = 'water';
    colorVal = color(0,map(noiseVal,0,1,20,100),map(noiseVal,0,1,50,255));
    fill(colorVal);
  }
  else{
    terrainType = 'sand'
    colorVal = color(252,map(noiseVal,.5,1,240,180),0);
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
      drawBoat()
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



// James is here!
// Lets start with drawing the new boats instead of the lawn chairs
// I'm gonna try to make a 1 tile boat here:
function drawBoat(){
  // this code is straight from chat gpt
  // I'm gonna try to make it smaller and map it to a tile. 
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

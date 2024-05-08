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

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  
  noStroke();
  let boatWidth = 5;
  
  
  let onBoat = false;
  if (j < -boatWidth || j > boatWidth) {
    // water
    let t = millis()/1000.0;
    fill(100, 150, 233, 64+256*noise(-t+i/5,j/5,t));
    
  } else {
    onBoat = true;
    if (j == -boatWidth || j == boatWidth) {
      
      translate(0,-th/2);

      fill(trimColor);
    } else {
      fill(200);
      
    }
  }

  
  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  if(onBoat) {
    let n = clicks[[i, j]] | 0;
    if (n % 2 == 1) {
      fill(0, 0, 0, 32);
      rect(0, 0, 10, 5);
      translate(0, -10);
      fill(0, 0, 0, 128);
      rect(0, 0, 10, 10);
    }
  }
  

  pop();
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

function p3_drawAfter() {}

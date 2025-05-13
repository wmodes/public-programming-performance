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

/** This class stores all the info for a world generation. */
class World{

constructor(p){
  this.p = p;
  this.worldSeed;
  this.trimColor;
  [this.tw, this.th] = [TILE_WIDTH,TILE_HEIGHT];
  this.clicks = {};
  console.log("World Created");
}

  /** This is called on p3 preload call */
p3_preload() {}

/** This is called on the p3 setup call */
p3_setup() {}

/** This is called if someone changes the seed */
p3_worldKeyChanged(key) {
  this.worldSeed = XXH.h32(key, 0);
  this.p.noiseSeed(this.worldSeed);
  this.p.randomSeed(this.worldSeed);
  
  this.trimColor = this.p.random(['red','#44ff88','#aaeeff']);
}

p3_tileWidth() { return TILE_WIDTH; }
p3_tileHeight() { return TILE_HEIGHT; }

/** this is called when the tile at i,j is clicked */
p3_tileClicked(i, j) {
  let key = [i, j];
  this.clicks[key] = 1 + (this.clicks[key] | 0);
}

/** This is called before the tile is drawn. */
p3_drawBefore() {

}

/** This draws the tile at that location */
p3_drawTile(i, j) {
  
  this.p.noStroke();

  // this is the alorithm that determines whether it is a boat
  // this sets the color of the tile
  let boatWidth = 5;
  let onBoat = false;
  if (j < -boatWidth || j > boatWidth) {
    // water
    // if the tile is out of the boat dimentions then draw water there.
    // t is for the shade of the water
    let t = this.p.millis()/1000.0;
    this.p.fill(100, 150, 233, 64+256*this.p.noise(-t+i/5,j/5,t));
  } else {
    onBoat = true;
    if (j == -boatWidth || j == boatWidth) {
      // the tile is moved up if it is on ge the enge 
      this.p.translate(0,-this.th/2);

      this.p.fill(this.trimColor);
    } else {
      this.p.fill(200);
      
    }
  }

  // this is adding the verticies for the shape  
  this.p.push();
  this.p.beginShape();
  this.p.vertex(-this.tw, 0);
  this.p.vertex(0, this.th);
  this.p.vertex(this.tw, 0);
  this.p.vertex(0, -this.th);
  this.p.endShape(this.p.CLOSE);

  if(onBoat) {
    // this checks which tile is clicked 
    let n = this.clicks[[i, j]] | 0; // if it is null then it is 0
    // if n is 1 then add a block
    if (n % 2 == 1) {
      // draw the thing that you can click add on
      this.p.fill(0, 0, 0, 32);
      this.p.rect(0, 0, 10, 5);
      this.p.translate(0, -10);
      this.p.fill(0, 0, 0, 128);
      this.p.rect(0, 0, 10, 10);
    }
  }
  this.p.pop();
}

/** draws outline around the tile. */
p3_drawSelectedTile(i, j) {
  this.p.noFill();
  this.p.stroke(0, 255, 0, 128);

  // this draws the outline
  this.p.beginShape();
  this.p.vertex(-this.tw, 0);
  this.p.vertex(0, this.th);
  this.p.vertex(this.tw, 0);
  this.p.vertex(0, -this.th);
  this.p.endShape(this.p.CLOSE);

  this.p.noStroke();
  this.p.fill(0);

  // this adds the text above the tile
  this.p.text("tile " + [i, j], 0, 0);
}

/** This is called after draw */
  p3_drawAfter() {
    
  }
}
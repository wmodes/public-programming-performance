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

class World {
  constructor(p) {
    this.p = p;
    this.worldSeed;
    this.trimColor;
    [this.tw, this.th] = [TILE_WIDTH, TILE_HEIGHT];
    this.clicks = {};
    console.log("World Created");
  }
  p3_preload() { }

  p3_setup() { }


  p3_worldKeyChanged(key) {
    this.worldSeed = XXH.h32(key, 0);
    this.p.noiseSeed(this.worldSeed);
    this.p.randomSeed(this.worldSeed);

    this.trimColor = this.p.random(['red', '#44ff88', '#aaeeff']);
  }

  p3_tileWidth() {
    return TILE_WIDTH;
  }
  p3_tileHeight() {
    return TILE_HEIGHT;
  }

  p3_tileClicked(i, j) {
    let key = [i, j];
    this.clicks[key] = 1 + (this.clicks[key] | 0);
  }

  p3_drawBefore() { }

  p3_drawTile(i, j) {

    this.p.noStroke();

    // Water
    let t = this.p.millis() * WATER_ANIMATION_RATE;
    this.p.fill(100, 150, 233, 64 + 256 * this.p.noise(-t + i / 5, j / 5, t));

    // Draw tile
    this.p.push();

    this.p.beginShape();
    this.p.vertex(-this.tw, 0);
    this.p.vertex(0, this.th);
    this.p.vertex(this.tw, 0);
    this.p.vertex(0, -this.th);
    this.p.endShape(this.p.CLOSE);

    this.p.pop();
  }

  p3_drawSelectedTile(i, j) {
    this.p.noFill();
    this.p.stroke(0, 255, 0, 128);

    this.p.beginShape();
    this.p.vertex(-this.tw, 0);
    this.p.vertex(0, this.th);
    this.p.vertex(this.tw, 0);
    this.p.vertex(0, -this.th);
    this.p.endShape(this.p.CLOSE);

    this.p.noStroke();
    this.p.fill(0);
    this.p.text("tile " + [i, j], 0, 0);
  }

  p3_drawAfter() { }
}
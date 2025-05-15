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

class SoundEngine{
  constructor(p){
    this.p = p;
    this.waterClickSound = p.loadSound('sounds/Water Drop - Sound Effects.mp3');
    this.dirtClickSound = p.loadSound('sounds/Dirt Drop - Sound Effects.mp3');
    this.sandClickSound = p.loadSound('sounds/Sand Drop - Sound Effects.mp3');
    this.landAmbience = p.loadSound('sounds/Land Ambience - Background.mp3');
    this.waterAmbience = p.loadSound('sounds/Water Ambience - Background.mp3');
    this.landTilesDrawn = 0;
    this.waterTilesDrawn = 0;
  }

  tileClicked(tileType = "water") {
    if (tileType == "water") {
      this.waterClickSound.play(0, 1, 1, this.waterClickSound.duration() * 2/7);
    } else if (tileType == "dirt") {
      this.dirtClickSound.play();
    } else if (tileType == "sand") {
      this.sandClickSound.play();
    }
  }

  dynamicBackground() {
    let totalTiles = this.waterTilesDrawn + this.landTilesDrawn;
    let waterTilesPercent = this.waterTilesDrawn/totalTiles;
    let landTilesPercent = this.landTilesDrawn/totalTiles;
    let fadeTimeSec = 1;
    if (!this.landAmbience.isPlaying()) {
      this.landAmbience.play(0, 1, 0)
    }
    if (!this.waterAmbience.isPlaying()) {
      this.waterAmbience.play(0, 1, 0)
    }
    this.landAmbience.setVolume(landTilesPercent * 0.2, fadeTimeSec);
    this.waterAmbience.setVolume(waterTilesPercent * 1, fadeTimeSec);
  }

  clearTileCount() {
    this.landTilesDrawn = 0;
    this.waterTilesDrawn = 0;
  }
}



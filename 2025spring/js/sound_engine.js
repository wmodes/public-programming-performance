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
  constructor(p5Instance){
    this.p5Instance = p5Instance;
    this.waterClickSound = p5Instance.loadSound('sounds/Water Drop - Sound Effects.mp3');
    this.dirtClickSound = p5Instance.loadSound('sounds/Dirt Drop - Sound Effects.mp3');
    this.sandClickSound = p5Instance.loadSound('sounds/Sand Drop - Sound Effects.mp3');
    this.landAmbience = p5Instance.loadSound('sounds/Land Ambience - Background.mp3');
    this.waterAmbience = p5Instance.loadSound('sounds/Water Ambience - Background.mp3');
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

  dynamicBackground(waterTilesDrawn, landTilesDrawn) {
    let totalTiles = waterTilesDrawn + landTilesDrawn;
    let waterTilesPercent = waterTilesDrawn/totalTiles;
    let landTilesPercent = landTilesDrawn/totalTiles;
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
}



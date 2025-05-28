/**
 * @file World.js
 * Defines the World class and its p3.js lifecycle methods and helpers.
 * Handles tile drawing, world state changes, and user interaction.
 */

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
class World {
  constructor(p) {
    this.p = p;
    this.worldSeed;
    this.trimColor;
    [this.tw, this.th] = [TILE_WIDTH, TILE_HEIGHT]; // tw = tile width, th = tile height
    this.clicks = {};
    this.island = new Island(p); // Use the new Island class
    this.tileTypes = { OCEAN: [], SAND: [], ROCK: [], GRASS: [], DIRT: [], SNOW: [], FILLER: []};
    this.tiles = {};
    this.landTiles = 0;
    this.oceanTiles = 0;
    this.soundEngine = new SoundEngine(p);
    console.log("World Created");
    this.npc_manager = new NpcManager();
  }

  quickLoad(asset,type,subdir="assets/tiles/"){

    this.ocean = this.p.loadImage(
      subdir+asset,
      () => {
        console.log("loaded "+asset);
      },
      () => {
        console.log("failed to load "+asset);
      }
    );
    this.tileTypes[type].push(this.ocean);
  }
  /** This is called on p3 preload call */
  p3_preload() {
    this.quickLoad("water_base.png","OCEAN");

    this.quickLoad("xavier_sand.png","SAND");

    this.quickLoad("rock_base_retouch.png","ROCK");

    this.quickLoad("rock_base.png","ROCK");

    this.quickLoad("rock_base_retouch_rock0.png","ROCK");

    this.quickLoad("xavier_grass.png","GRASS");

    this.quickLoad("xavier_grass_tree0.png","GRASS","assets/decor/");

    this.quickLoad("xavier_grass_tree1.png","GRASS","assets/decor/");
    
    this.quickLoad("xavier_grass_tree2.png","GRASS","assets/decor/");
    
    this.quickLoad("xavier_grass_tree3.png","GRASS","assets/decor/");

    //this.quickLoad("xavier_grass_tree4.png","GRASS","assets/decor/");
    
    //this.quickLoad("xavier_grass_tree5.png","GRASS","assets/decor/");

    this.quickLoad("dirt_base.png","DIRT");

    this.quickLoad("snow_base.png","SNOW");

    this.quickLoad("snow_snowman.png","SNOW","assets/decor/");

    this.quickLoad("snow_snowmanMelted.png","SNOW","assets/decor/");

    this.quickLoad("dirt_column.png","FILLER","assets/decor/");

    this.quickLoad("sand_column.png","FILLER","assets/decor/");

    this.quickLoad("rock_column.png","FILLER","assets/decor/");
    
    this.boatParts = [
      this.p.loadImage(
        "assets/tiles/boat_front.png",
        () => {
          console.log("loaded boat_front.png");
        },
        () => {
          console.log("failed to boat_front.png");
        }
      ),
      this.p.loadImage(
        "assets/tiles/boat_middle_sail.png",
        () => {
          console.log("loaded boat_middle_sail.png");
        },
        () => {
          console.log("failed to boat_middle_sail.png");
        }
      ),
      this.p.loadImage(
        "assets/tiles/boat_middle.png",
        () => {
          console.log("loaded boat_middle.png");
        },
        () => {
          console.log("failed to boat_middle.png");
        }
      ),
      this.p.loadImage(
        "assets/decor/boat_butt.png",
        () => {
          console.log("loaded boat_butt.png");
        },
        () => {
          console.log("failed to boat_butt.png");
        }
      ),
      this.p.loadImage(
        "assets/decor/explosion.png",
        () => {
          console.log("loaded explosion.png");
        },
        () => {
          console.log("failed to explosion.png");
        }
      ),
      this.p.loadImage(
        "assets/decor/boat_debris1.png",
        () => {
          console.log("loaded boat_debris1.png");
        },
        () => {
          console.log("failed to boat_debris1.png");
        }
      ),
      this.p.loadImage(
        "assets/decor/boat_debris2.png",
        () => {
          console.log("loaded boat_debris2.png");
        },
        () => {
          console.log("failed to boat_debris2.png");
        }
      ),
      this.p.loadImage(
        "assets/decor/boat_debris3.png",
        () => {
          console.log("loaded boat_debris3.png");
        },
        () => {
          console.log("failed to boat_debris3.png");
        }
      )
    ];

    
    this.turtlesheet = this.p.loadImage("assets/npc/turtle_NPC_spritesheet.png")
    this.seagullsheet = this.p.loadImage("assets/npc/seagull_NPC_spritesheet.png")
    this.whalesheet = this.p.loadImage("assets/npc/whale_NPC_spritesheet.png")
  }

  /** This is called on the p3 setup call */
  p3_setup() {
    this.npc_manager.spawnEntity(new PathfindingTestNpc(0,0,5));
    //for (let i = 0; i < 100; i++){
    this.npc_manager.spawnEntity(new AnimalNPC(0,0,5,this.spriteSheetCutter(2,4,this.turtlesheet)));
    this.npc_manager.spawnEntity(new AnimalNPC(0,0,5,this.spriteSheetCutter(2,4,this.seagullsheet)));
    this.npc_manager.spawnEntity(new AnimalNPC(0,0,5,this.spriteSheetCutter(2,4,this.whalesheet)));
    //}
  }

  getTileKey(i, j) {
    return `${i},${j}`;
  }

  /** This is called if someone changes the seed */
  p3_worldKeyChanged(key) {
    this.worldSeed = XXH.h32(key, 0);
    this.p.noiseSeed(this.worldSeed);
    this.p.randomSeed(this.worldSeed);

    this.trimColor = this.p.random(["red", "#44ff88", "#aaeeff"]);
  }

  p3_tileWidth() {
    return TILE_WIDTH;
  }
  p3_tileHeight() {
    return TILE_HEIGHT;
  }

  /** this is called when the tile at i,j is clicked */
  p3_tileClicked(i, j) {
    let key = this.getTileKey(i, j);
    this.clicks[key] = 1 + (this.clicks[key] | 0);
    let type = "NONE";
    let tile = this.tiles[key];
    if (tile && tile.getType())
      type = tile.getType();
    this.soundEngine.tileClicked(type);
    if (type == "OCEAN") {
      let temp = this.p.random([0,1,2,3])
      switch(temp){
        case 0:
          this.npc_manager.spawnEntity(new Boat(this.boatParts, i, j, 5));
          break;
        case 1:
          this.npc_manager.spawnEntity(new AnimalNPC(i,j,5,this.spriteSheetCutter(2,4,this.turtlesheet)));
          break;
        case 2:
          this.npc_manager.spawnEntity(new AnimalNPC(i,j,5,this.spriteSheetCutter(2,4,this.seagullsheet)));
          break
        case 3:
          this.npc_manager.spawnEntity(new AnimalNPC(i,j,5,this.spriteSheetCutter(2,4,this.whalesheet)));
          break;
      }
    }
  }

  /** This is called before the tile is drawn. */
  p3_drawBefore() {
    this.landTiles = 0;
    this.oceanTiles = 0;
  }

  /** This draws the tile at that location */
  p3_drawTile(i, j) {
    let key = this.getTileKey(i, j);
    let tile = this.island.drawTile(i, j, this);
    this.tiles[key] = tile;
    if (this.tiles[key].getType() == "OCEAN") {
      this.oceanTiles++
    } else {
      this.landTiles++
    }
    return tile;
  }

  /** draws outline around the tile. */
  p3_drawSelectedTile(i, j) {
    //this.p.noFill();
    this.p.fill(0, 255, 0, 50);
    this.p.stroke(0, 255, 0, 128);
    let key = this.getTileKey(i, j);
    if (this.tiles[key] == undefined)
      return;

    let y = this.tiles[key].height;

    // this draws the outline
    this.p.beginShape();
    this.p.vertex(-this.tw, this.th);
    this.p.vertex(-this.tw, this.th + y);
    this.p.vertex(0, y);
    this.p.vertex(this.tw, this.th + y);
    this.p.vertex(this.tw, this.th);
    this.p.vertex(0, this.th*2);
    this.p.endShape(this.p.CLOSE);

    this.p.fill(255, 0, 0, 50);

    this.p.beginShape();
    this.p.vertex(-this.tw, this.th + y);
    this.p.vertex(0, y);
    this.p.vertex(this.tw, this.th + y);
    this.p.vertex(0, this.th*2 + y);
    this.p.endShape(this.p.CLOSE);

    this.p.noStroke();
    this.p.fill(0);

    // this adds the text above the tile
    this.p.text("tile " + [i, j], 0, 0);
    this.p.text("tile type " + this.tiles[key].type, 0, 20);
  }

  p3_drawAfter(camera_offset) {
    this.npc_manager.update(this);
    this.npc_manager.draw(this.p, camera_offset);
    this.soundEngine.dynamicBackground(this.oceanTiles, this.landTiles);
    this.island.drawClouds(camera_offset, this);
  }

  tileAt(i, j) {
    let key = this.getTileKey(i, j);
    return this.tiles[key];
  }

  spriteSheetCutter(cols,rows, sheet){
    let frameWidth = sheet.width / cols;
    let frameHeight = sheet.height / rows;
    let frameArr = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let frame = sheet.get(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
        frameArr.push(frame);
      }
    }
    let temparr = []
    for (let i = 0; i < frameArr.length; i+=2){
      let temp = [frameArr[i], frameArr[i + 1]];
      temparr.push(temp)
    }
    return temparr;
  }
}

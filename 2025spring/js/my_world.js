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
    this.tileTypes = { OCEAN: [], SAND: [], GRASS: [], DIRT: [], SNOW: [] };
    this.tiles = {};
    this.landTiles = 0;
    this.oceanTiles = 0;
    this.soundEngine = new SoundEngine(p);
    console.log("World Created");
    this.npc_manager = new NpcManager();
  }

  /** This is called on p3 preload call */
  p3_preload() {
    this.ocean = this.p.loadImage(
      "assets/tiles/water_base.png",
      () => {
        console.log("loaded ocean.png");
      },
      () => {
        console.log("failed to load ocean.png");
      }
    );
    this.tileTypes.OCEAN.push(this.ocean);

    this.sand = this.p.loadImage(
      "assets/tiles/xavier_sand.png",
      () => {
        console.log("loaded xavier_grass.png");
      },
      () => {
        console.log("failed to xavier_grass.png");
      }
    );
    this.tileTypes.SAND.push(this.sand);

    this.grass = this.p.loadImage(
      "assets/tiles/xavier_grass.png",
      () => {
        console.log("loaded grass_tile.png");
      },
      () => {
        console.log("failed to grass_tile.png");
      }
    );
    this.tileTypes.GRASS.push(this.grass);

    this.tree0 = this.p.loadImage(
      "assets/decor/xavier_grass_tree0.png",
      () => {
        console.log("loaded xavier_grass_tree0.png");
      },
      () => {
        console.log("failed to load xavier_grass_tree0.png");
      }
    );
    this.tileTypes.GRASS.push(this.tree0);

    this.tree1 = this.p.loadImage(
      "assets/decor/xavier_grass_tree1.png",
      () => {
        console.log("loaded xavier_grass_tree1.png");
      },
      () => {
        console.log("failed to load xavier_grass_tree0.png");
      }
    );
    this.tileTypes.GRASS.push(this.tree1);

    this.tree2 = this.p.loadImage(
      "assets/decor/xavier_grass_tree2.png",
      () => {
        console.log("loaded xavier_grass_tree0.png");
      },
      () => {
        console.log("failed to load xavier_grass_tree2.png");
      }
    );
    this.tileTypes.GRASS.push(this.tree2);

    this.dirt = this.p.loadImage(
      "assets/tiles/dirt_base.png",
      () => {
        console.log("loaded dirt_tile.png");
      },
      () => {
        console.log("failed to load dirt_tile.png");
      }
    );
    this.tileTypes.DIRT.push(this.dirt);

    this.snow = this.p.loadImage(
      "assets/tiles/snow_base.png",
      () => {
        console.log("loaded snow_base.png");
      },
      () => {
        console.log("failed to load snow_base.png");
      }
    );
    this.tileTypes.SNOW.push(this.snow);

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
      ),
    ];

    this.bird1 = this.p.loadImage("./assets/npc/seagull.png");
    this.bird2 = this.p.loadImage("./assets/npc/seagull2.png");
  }

  /** This is called on the p3 setup call */
  p3_setup() {
    this.npc_manager.spawnEntity(new PathfindingTestNpc(0, 0, 5));
    for (let i = 0; i < 100; i++) {
      this.npc_manager.spawnEntity(
        new AnimalNPC(0, 0, 5, [
          [this.bird1, this.bird2],
          [this.bird1, this.bird2],
          [this.bird1, this.bird2],
          [this.bird1, this.bird2],
        ])
      );
    }
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
    let key = [i, j];
    let type = this.tiles[i + ", " + j].getType();
    this.soundEngine.tileClicked(type);
    if (type == "OCEAN") {
      // let boat = new Boat(this.p, this.boatParts, i, j, 1);
      this.npc_manager.spawnEntity(new Boat(this.boatParts, i, j, 5));
      // boat.draw();
    }
  }

  /** This is called before the tile is drawn. */
  p3_drawBefore() {
    this.landTiles = 0;
    this.oceanTiles = 0;
  }

  /** This draws the tile at that location */
  p3_drawTile(i, j) {
    this.tiles[i + ", " + j] = this.island.drawTile(i, j, this);
    if (this.tiles[i + ", " + j].getType() == "OCEAN") {
      this.oceanTiles++;
    } else {
      this.landTiles++;
    }
    //console.log("(" + i + ", " + j + ")  " + this.tiles[i + ", " + j]);
    return this.tiles[(i, j)] && this.tiles[(i, j)].isLand();
  }

  /** draws outline around the tile. */
  p3_drawSelectedTile(i, j) {
    this.p.noFill();
    this.p.stroke(0, 255, 0, 128);

    // Added temp code for adjusting selected tile based on height, will improve later
    let y =
      this.tiles[(i, j)] && this.tiles[(i, j)].getType() == "OCEAN" ? 8 : 0;

    // this draws the outline
    this.p.beginShape();
    this.p.vertex(-this.tw, 0 + y);
    this.p.vertex(0, this.th + y);
    this.p.vertex(this.tw, 0 + y);
    this.p.vertex(0, -this.th + y);
    this.p.endShape(this.p.CLOSE);

    this.p.noStroke();
    this.p.fill(0);

    // this adds the text above the tile
    this.p.text("tile " + [i, j], 0, 0);
  }

  p3_drawAfter(camera_offset) {
    this.npc_manager.update(this);
    this.npc_manager.draw(this.p, camera_offset);
    this.soundEngine.dynamicBackground(this.oceanTiles, this.landTiles);
  }

  tileAt([i, j]) {
    return this.tiles[i + ", " + j];
  }
}

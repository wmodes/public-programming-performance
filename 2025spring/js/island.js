/**
 * @file island.js
 * Contains all island-specific drawing and logic for the world.
 */

"use strict";

class Island {
  constructor(p) {
    this.p = p;
    // Island & chunk properties
    this.ISLAND_SIZE = 24; // tile units (not pixels)
    this.CHUNK_GRID_SIZE = this.ISLAND_SIZE;
    this.ISLAND_PRESENCE_THRESHOLD = 0.55;

    // Noise parameters
    this.NOISE_SCALE_ROUGH = 0.085;
    this.NOISE_SCALE_DETAIL = 0.18;
    this.CHUNK_PRESENCE_NOISE_SCALE = 0.1;
    this.ISLAND_SHAPE_SEED_NOISE_SCALE = 0.05;
    this.BIOME_NOISE_SCALE = 0.13; // New: scale for biome selection

    // Thresholds for land formation
    this.SAND_THRESHOLD = 0.18;
    this.LAND_THRESHOLD = 0.28;
  }

  // Returns true if an island should exist at chunk (cX, cY)
  hasIslandAt(cX, cY) {
    let n = this.p.noise(
      cX * this.CHUNK_PRESENCE_NOISE_SCALE,
      cY * this.CHUNK_PRESENCE_NOISE_SCALE
    );
    return n > this.ISLAND_PRESENCE_THRESHOLD;
  }

  // Returns the shape seeds for an island at chunk (cX, cY)
  getIslandShapeSeeds(cX, cY) {
    let sx =
      this.p.noise(
        cX * this.ISLAND_SHAPE_SEED_NOISE_SCALE + 10.3,
        cY * this.ISLAND_SHAPE_SEED_NOISE_SCALE + 20.7
      ) * 100000;
    let sy =
      this.p.noise(
        cX * this.ISLAND_SHAPE_SEED_NOISE_SCALE + 30.5,
        cY * this.ISLAND_SHAPE_SEED_NOISE_SCALE + 40.1
      ) * 100000;
    return [sx, sy];
  }

  // Returns the biome for an island at chunk (cX, cY)
  getIslandBiome(cX, cY) {
    // Use noise to pick a biome deterministically per chunk
    let n = this.p.noise(
      cX * this.BIOME_NOISE_SCALE + 100.1,
      cY * this.BIOME_NOISE_SCALE + 200.2
    );
    // if (n < 0.5) return "SNOW";
    // if (n < 0.5) return "ROCK";
    // if (n < 0.75) return "SAND";
    return "GRASS";
  }

  // Returns "water", "sand", or "land" for a given tile in an island
  getIslandTileType(localX, localY, shapeSeedX, shapeSeedY) {
    // Perlin Noise Pass 1: Rough Outline
    let n1X = localX * this.NOISE_SCALE_ROUGH + shapeSeedX;
    let n1Y = localY * this.NOISE_SCALE_ROUGH + shapeSeedY;
    let noiseValueRough = this.p.noise(n1X, n1Y);

    // Perlin Noise Pass 2: Details
    let n2X = localX * this.NOISE_SCALE_DETAIL + shapeSeedX + 200.5;
    let n2Y = localY * this.NOISE_SCALE_DETAIL + shapeSeedY + 300.5;
    let noiseValueDetail = this.p.noise(n2X, n2Y);

    // Combine Noise Values
    let combinedNoise = noiseValueRough * 0.7 + noiseValueDetail * 0.3;

    // Central Bias / Radial Falloff
    let centerX = this.ISLAND_SIZE / 2;
    let centerY = this.ISLAND_SIZE / 2;
    let distToCenter = this.p.dist(localX, localY, centerX, centerY);
    let falloffRadius = this.ISLAND_SIZE * 0.48;
    let falloff = Math.pow(Math.max(0, 1 - distToCenter / falloffRadius), 1.6);
    let finalNoiseValue = combinedNoise * falloff;

    // Thresholding
    if (finalNoiseValue > this.LAND_THRESHOLD) {
      return "LAND";
    } else if (finalNoiseValue > this.SAND_THRESHOLD) {
      return "SAND";
    } else {
      return "OCEAN";
    }
  }

  // Draws a tile at world (i, j) using the island algorithm
  drawTile(i, j, world) {
    // Find which chunk this tile is in
    let cX = Math.floor(i / this.CHUNK_GRID_SIZE);
    let cY = Math.floor(j / this.CHUNK_GRID_SIZE);

    let tile = new Tile(this.p, world);

    if (!this.hasIslandAt(cX, cY)) {
      // Water everywhere if no island in this chunk
      //world.p.image(world.ocean, -30, -24, 60, 50, 0, 32 - 24, 32, 24);
      tile.changeAttributes("OCEAN");
      tile.draw(8, world.p.millis() % 1000 < 500 ? 0 : 32, 8 - 56);
      return tile;
    }

    // Get island shape seeds
    let [shapeSeedX, shapeSeedY] = this.getIslandShapeSeeds(cX, cY);

    // Get biome for this island
    let biome = this.getIslandBiome(cX, cY);

    // Local coordinates within the island
    let localX = i - cX * this.CHUNK_GRID_SIZE;
    let localY = j - cY * this.CHUNK_GRID_SIZE;

    // Out of bounds (shouldn't happen, but just in case)
    if (
      localX < 0 ||
      localY < 0 ||
      localX >= this.ISLAND_SIZE ||
      localY >= this.ISLAND_SIZE
    ) {
      //world.p.image(world.ocean, -30, -24, 60, 50, 0, 32 - 24, 32, 24);
      tile.changeAttributes("OCEAN");
      tile.draw(8, world.p.millis() % 1000 < 500 ? 0 : 32, 8 - 56);
      return tile;
    }

    // Determine tile type
    let type = this.getIslandTileType(localX, localY, shapeSeedX, shapeSeedY);

    // Draw based on biome and tile type
    if (type === "LAND") {
      tile.changeAttributes(biome);
      tile.draw();
      /*
      if (biome === "snow") {
        world.p.image(world.snow, -30, -24, 60, 50, 0, 80 - 24, 32, 24);
      } else if (biome === "rock") {
        world.p.image(world.dirt, -30, -24, 60, 50, 0, 80 - 24, 32, 24);
      } else if (biome === "desert") {
        world.p.image(world.sand, -30, -24, 60, 50, 0, 80 - 24, 32, 24);
      } else {
        world.p.image(world.grass, -30, -24, 60, 50, 0, 80 - 24, 32, 24);
      }
      */
    } else if (type === "SAND") {
      // Sand edge is always sand, regardless of biome
      tile.changeAttributes(type);
      tile.draw(4);
      //world.p.image(world.sand, -30, -24, 60, 50, 0, 80 - 24, 32, 24);
    } else {
      // Animated water fill
      tile.changeAttributes(type);
      tile.draw(8, world.p.millis() % 1000 < 500 ? 0 : 32, 8 - 56);
      /*
      if (world.p.millis() % 1000 < 500) {
        world.p.image(world.ocean, -30, -24, 60, 50, 0, 32 - 24, 32, 24);
      } else {
        world.p.image(world.ocean, -30, -24, 60, 50, 32, 32 - 24, 32, 24);
      }
      */
    }
    return tile;
  }
}

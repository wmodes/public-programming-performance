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
    this.ISLAND_HEIGHT_SCALER = 200;

    // Noise parameters
    this.NOISE_SCALE_ROUGH = 0.085;
    this.NOISE_SCALE_DETAIL = 0.18;
    this.CHUNK_PRESENCE_NOISE_SCALE = 0.1;
    this.ISLAND_SHAPE_SEED_NOISE_SCALE = 0.05;
    this.BIOME_NOISE_SCALE = 0.13; // New: scale for biome selection

    // Thresholds for land formation
    this.SAND_THRESHOLD = 0.18;
    this.LAND_THRESHOLD = 0.28;
    this.DETAIL_THRESHOLD = 0.4;
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
    ) * 4;
    if (n < 1) return "SNOW";
    if (n < 2) return "GRASS";
    if (n < 3) return "ROCK";
    return "SAND";
  }

  // Returns "water", "sand", or "land" for a given tile in an island
  getIslandTileType(localX, localY, shapeSeedX, shapeSeedY, biome) {
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
      return {id: (noiseValueRough % .2 > .16) ? "DECOR" : "LAND", n: finalNoiseValue};
    } else if (finalNoiseValue > this.SAND_THRESHOLD) {
      return {id: "SAND", n: finalNoiseValue};
    } else {
      return {id: "OCEAN", n: finalNoiseValue};
    }
  }

  // Draws a tile at world (i, j) using the island algorithm
  drawTile(i, j, world) {
    // Find which chunk this tile is in
    let cX = Math.floor(i / this.CHUNK_GRID_SIZE);
    let cY = Math.floor(j / this.CHUNK_GRID_SIZE);

    let tile = new Tile(this.p, world);

    // Helper: calculate wave offset for OCEAN tiles
    function getWaterWaveOffset(i, j, p) {
      // Use frameCount if available, else fallback to millis
      let t = typeof p.frameCount !== "undefined" ? p.frameCount : p.millis() * 0.06;
      // Sine wave for smooth up/down motion
      return Math.sin(t * 0.05 + i * 0.7 + j * 0.9) * 4;
    }

    // Helper: decide which animation frame to use based on wave phase
    function getWaterFrame(i, j, p) {
      let t = typeof p.frameCount !== "undefined" ? p.frameCount : p.millis() * 0.06;
      // Use a chunked sine wave for flipping in groups
      // The chunk size controls how many tiles flip together
      let chunkSize = 4; // Increase for bigger chunks
      let chunkI = Math.floor((i+j) / chunkSize);
      let chunkJ = Math.floor((i-j) / chunkSize);
      let phase = Math.sin(t * 0.025 + chunkI * 0.7 + chunkJ * 0.9);
      // If wave is above 0, use frame 0 (high), else frame 1 (low)
      return phase > 0 ? 0 : 1;
    }

    if (!this.hasIslandAt(cX, cY)) {
      // Water everywhere if no island in this chunk
      //world.p.image(world.ocean, -30, -24, 60, 50, 0, 32 - 24, 32, 24);
      tile.changeAttributes("OCEAN");
      let waveOffset = getWaterWaveOffset(i, j, this.p);
      let frame = getWaterFrame(i, j, this.p);
      tile.draw({y:-16 + waveOffset, cropOffsetX: frame === 0 ? 0 : 32, cropOffsetY: 8});
      //tile.draw(8 , frame === 0 ? 0 : 32, 8 - 56);
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
      let waveOffset = getWaterWaveOffset(i, j, this.p);
      let frame = getWaterFrame(i, j, this.p);
      tile.draw({y:-16 + waveOffset, cropOffsetX: frame === 0 ? 0 : 32, cropOffsetY: 8});
      return tile;
    }

    // Determine tile type
    let type = this.getIslandTileType(localX, localY, shapeSeedX, shapeSeedY, biome);
    let mody = 16+(type.n-this.SAND_THRESHOLD)*this.ISLAND_HEIGHT_SCALER;

    // Draw based on biome and tile type
    switch (type.id){
      case ("DECOR"):
        tile.changeAttributes(biome, 1);
        for (let i = 60; i > -6; i -= 6){
          tile.draw({y:i-mody});
        }
        if (biome == "GRASS")
          tile.draw({y:-mody-116, cropOffsetY: 0,height:160,cropHeight:80});
        else
          tile.draw({y:-mody});
      break;
      case ("LAND"):
        tile.changeAttributes(biome);
        for (let i = 60; i > -6; i -= 6){
          tile.draw({y:i-mody});
        }
        tile.draw({y:-mody});
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
      break;
      case ("SAND"):
        // Sand edge is always sand, regardless of biome
        tile.changeAttributes(type.id);
        for (let i = 60; i > -6; i -= 6){
          tile.draw({y:i-mody});
        }
        tile.draw({y:-mody});
        //world.p.image(world.sand, -30, -24, 60, 50, 0, 80 - 24, 32, 24);
      break;
      default:
        // Animated water fill
        tile.changeAttributes(type.id);
        let waveOffset = getWaterWaveOffset(i, j, this.p);
        let frame = getWaterFrame(i, j, this.p);
        tile.draw({y:-16 + waveOffset, cropOffsetX: frame === 0 ? 0 : 32, cropOffsetY: 8});
        /*
        if (world.p.millis() % 1000 < 500) {
          world.p.image(world.ocean, -30, -24, 60, 50, 0, 32 - 24, 32, 24);
        } else {
          world.p.image(world.ocean, -30, -24, 60, 50, 32, 32 - 24, 32, 24);
        }
        */
      break;
    }

    return tile;
  }
}

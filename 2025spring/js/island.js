/**
 * @file island.js
 * Contains all island-specific drawing and logic for the world.
 */

"use strict";

const BIOME_HEIGHT_SCALE = {
  SAND: 0.5,
  ROCK: 2.5,
  GRASS: 1,
  SNOW: 1
}

class Island {
  constructor(p) {
    this.p = p;
    this.t = 0;
    this.landRatio = 0;
    // Island & chunk properties
    this.ISLAND_SIZE = 32; // tile units (not pixels) default: 24
    this.CHUNK_GRID_SIZE = this.ISLAND_SIZE;
    this.ISLAND_PRESENCE_THRESHOLD = 0.55; // default: .55
    this.ISLAND_HEIGHT_SCALER = 300;

    // Noise parameters
    this.NOISE_SCALE_ROUGH = 0.085;
    this.NOISE_SCALE_DETAIL = 0.18;
    this.CHUNK_PRESENCE_NOISE_SCALE = 0.1;
    this.ISLAND_SHAPE_SEED_NOISE_SCALE = 0.75; // default: .05
    this.BIOME_NOISE_SCALE = 0.2; // default: .1
    this.PARALLAX_SCALE = 1.5;

    // Thresholds for land formation
    this.SAND_THRESHOLD = 0.075;  // default: .28
    this.LAND_THRESHOLD = 0.15;   // default: .38
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
        cX * this.ISLAND_SHAPE_SEED_NOISE_SCALE, + 30.5,
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
    if (n < 1.2) return "SNOW";
    if (n < 1.75) return "GRASS";
    if (n < 2.5) return "ROCK";
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
    let mody = 16+(type.n-this.SAND_THRESHOLD)*this.ISLAND_HEIGHT_SCALER*BIOME_HEIGHT_SCALE[biome];

    // Draw based on biome and tile type
    switch (type.id){
      case ("DECOR"):
        let ind = this.p.floor(mody) % 5;
        tile.changeAttributes(biome, ind);
        if (biome == "GRASS")
          tile.draw({y:-mody-116, cropOffsetY: 0, height:160, cropHeight:80});
        else if (biome == "SNOW" && ind)
          tile.draw({y:-mody-84, cropOffsetY: 0, height:128, cropHeight:64});
        else
          tile.draw({y:-mody});
      break;
      case ("LAND"):
        tile.changeAttributes(biome);
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
    tile.z = tile.getType() == "OCEAN" ? -16 + getWaterWaveOffset(i, j, this.p) : mody;

    return tile;
  }

  drawClouds(offset, world) {
    let parallaxOffset = {x: offset[0]*this.PARALLAX_SCALE, y: offset[1]*this.PARALLAX_SCALE};
    let height = 400;
    let width = 800;
    let cloudDetail = 6;
    let scale = 0.008;
    let waterRatio = 1-this.landRatio;
    let cloudAlpha = 250+100*waterRatio;
    let fill = {
    //   blue color       brown color
      r: 206*waterRatio + 255*this.landRatio,
      g: 236*waterRatio + 200*this.landRatio, 
      b: 255*waterRatio + 202*this.landRatio
    }
    
    this.p.noStroke();
    for (let y = 0; y < height+20; y += cloudDetail) {
      for (let x = 0; x < width+20; x += cloudDetail) {
        let n = world.p.noise((x+parallaxOffset.x+10000) * scale, (y-parallaxOffset.y+10000) * scale, this.t); // noise based on land and time
        if (n > 0.5) {
          world.p.fill(fill.r, fill.g, fill.b, cloudAlpha * (n - 0.5) * 2);
          world.p.rect(x, y, cloudDetail, cloudDetail);
        }
      }
    }
   
    this.t += 0.001; 
  }
}

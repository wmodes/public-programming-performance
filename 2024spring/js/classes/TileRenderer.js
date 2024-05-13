/**
 * TileRenderer class
 * @class
 */
class TileRenderer {
    // class stuff goes here (thanks chatgpt)
    /**
     * @constructor
     * Terrain parameters 
     */
    constructor(){
        this.zoom = .1
    }

  /**
   * Function to return noise at coordinate
   * @function terrainNoise
   * @param {number} x the x coordinate of given tile
   * @param {number} y the y coordinate of given tile
   * @returns {number} noise value at given x and y coordinates
   * @author {Wes}
   */
  getTerrainNoise(x, y) {
    // Constants
    const tileConfig = CONFIG.tiles;
    const scale = tileConfig.terrainNoiseScale;

    let noiseVal = noise((x + 100) * scale, (y + 100) * scale);

    return noiseVal;
  }

  getWaveNoise(x,y) {
    let t = millis() / 1000.0
    let noiseVal = noise(-t + x / 5, y / 5, t);
    return noiseVal;
  }
  
  /**
   * Function to render terrain
   * @function renderTerrain render islands across the water, elevates the islands slightly. Sets boolean flag for ship placement.
   * @param {number} x the x coordinate of given tile
   * @param {number} y the y coordinate of given tile
   * @returns {boolean} boolean value for given x and y
   * @author {Luke}
   */
  renderTerrain(x, y) {

    // Time, apply this change noise  
    let t = millis() / 1000.0

    // Constants
    const tileConfig = CONFIG.tiles;
    const islandColors = tileConfig.islandColors;
    const oceanColors = tileConfig.oceanColors;
    const waveColor = tileConfig.waveColor;
    const oceanHeightMultiplier = tileConfig.oceanHeightMultiplier;
    const islandVertMultiplier = tileConfig.islandHeightMultiplier;
    const islandHeightMin = tileConfig.islandHeightMin;
  
    //terrain code - Luke
    let noiseVal = this.getTerrainNoise(x, y);
    let islandMap = map(noiseVal,0.5,0.8,0,1);
    
    let colorVal;
    let onIsland = false;
  
    // if this tile is ocean
    if (!this.isIsland(x, y)) {
      const waveNoise = this.getWaveNoise(x, y);
      const waterLowColor = color(oceanColors.low)
      const waterHighColor = color(oceanColors.high)
      colorVal = lerpColor(waterLowColor, waterHighColor, map(waveNoise, .1, 1, 0, 1));
      fill(colorVal);
      this.drawExtrudedTile(waveNoise * oceanHeightMultiplier, colorVal)
    }
    // if this tile is island
    else {
      colorVal = this.getIslandColor(x, y);   
      fill(colorVal);
      onIsland = true;
      const thisTileHeight = (islandMap * islandVertMultiplier) + islandHeightMin;
      this.drawExtrudedTile(thisTileHeight, colorVal);
    }
  
    return onIsland
  }

  getIslandColor(x, y) {

    // Constants
    const tileConfig = CONFIG.tiles;
    const islandColors = tileConfig.islandColors;
    const noiseVal = this.getTerrainNoise(x, y);

    // Ensure noiseVal is within the interpolation range
    let normNoiseVal = map(noiseVal, 0.5, 0.8, 0, 1);
    // Calculate which two colors to interpolate between
    let numColors = islandColors.length;
    let scale = (numColors - 1) * normNoiseVal;
    let firstColorIndex = Math.floor(scale);
    let secondColorIndex = firstColorIndex + 1;
    // Calculate how far to interpolate between the two selected colors
    let lerpFactor = scale - firstColorIndex;
  
    // Handle edge case where noiseVal maps to the end of the array
    if (secondColorIndex >= numColors) {
      secondColorIndex = firstColorIndex;
    }
  
    return lerpColor(color(islandColors[firstColorIndex]), color(islandColors[secondColorIndex]), lerpFactor);
  }

  /**
   * Function to draw extruded tile
   * @function drawExtrudedTile 
   * @param {number} height the height to raise the tile by
   * @param {number} colorVal color value to fill extruded tile with
   * @returns {void}
   * @author Luke
   */
  drawExtrudedTile(height, colorVal) {
    const colorChangePercent = 0.2;
    const darkColor = 1;
    const lightColor = 0;
    const veryLightColor = 2;
    fill(colorVal)
    //top
    beginShape();
    vertex(-tw, 0 - height);
    vertex(0, th - height);
    vertex(tw, 0 - height);
    vertex(0, -th - height);
    endShape(CLOSE);

    fill(this.determineTileEdgeColor(colorVal, colorChangePercent, lightColor));
    //left
    beginShape();
    vertex(-tw, 0 - height);
    vertex(-tw, 0);
    vertex(0, th);
    vertex(0, th - height);
    endShape(CLOSE);

    fill(this.determineTileEdgeColor(colorVal, colorChangePercent, darkColor));
    //right
    beginShape();
    vertex(tw, 0 - height);
    vertex(tw, 0);
    vertex(0, th);
    vertex(0, th - height);
    endShape(CLOSE);
  }

  /**
   * Function to determine island tile edge color
   * @function determineIslandTileEdgeColor 
   * @param {p5.color} col color value from p5 lib
   * @param {number} factor scalar number to modify color by
   * @param {number} type number used as refrence to typee of tile?
   * @returns {p5.color}
   */
  determineTileEdgeColor(col, factor, type) {
      //luke
      let r = red(col);
      let g = green(col);
      let b = blue(col);
    
      if (type == 0) {
        r = min(255, r + 255 * factor);
        g = min(255, g + 255 * factor);
        b = min(255, b + 255 * factor);
      }
      else {
        r *= (1 - factor);
        g *= (1 - factor);
        b *= (1 - factor);
      }
    
      return color(r, g, b);
    }

  /**
   * Function to check if the given location is on an island
   * @function isIsland determine if the given i,j location is a tile...
   * @param {number} x i coordinate to check
   * @param {number} y j coordinate to check
   * @returns {boolean}
   * @author {Aiden}
   */
  isIsland(x, y) {
    let zoom = 0.1;
    let noiseVal = this.getTerrainNoise(x, y);
    return noiseVal > .5;
  }

}







  
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
   * Function to render terrain
   * @function renderTerrain render islands across the water, elevates the islands slightly. Sets boolean flag for ship placement.
   * @param {number} xCoord the x coordinate of given tile
   * @param {number} yCoord the y coordinate of given tile
   * @returns {boolean} boolean value for given i and j
   * @author {Luke}
   */
  renderTerrain(xCoord, yCoord) {

    // Time, apply this change noise  
    let t = millis() / 1000.0

    // Constants
    const tileConfig = CONFIG.tiles;
    const islandColors = tileConfig.islandColors;
    const oceanColors = tileConfig.oceanColors;
    const waveColor = tileConfig.waveColor;
  
    //terrain code - Luke
    let noiseVal = noise(xCoord * tileConfig.zoom, yCoord * tileConfig.zoom);
    let colorVal;
    let onIsland = false;
  
    // if this tile is ocean
    if (!this.isIsland(xCoord, yCoord)) {
      const waveNoise = noise(-t + xCoord / 5, yCoord / 5, t);
      const waterLowColor = color(oceanColors.low)
      const waterHighColor = color(oceanColors.high)
      colorVal = lerpColor(waterLowColor, waterHighColor, map(waveNoise, .1, 1, 0, 1));
      fill(colorVal);
      this.drawExtrudedTile(waveNoise * 25, colorVal)
    }
    // if this tile is island
    else {
      let islandMap = map(noiseVal,0.5,0.8,0,1);
      colorVal = color('yellow');    
      if(islandMap<.1){
        colorVal = lerpColor(color(islandColors[(0)]), color(islandColors[(1)]), islandMap);
      }
      else if(islandMap<.2){
        colorVal = lerpColor(color(islandColors[(1)]), color(islandColors[(2)]), islandMap);
      }
      else if(islandMap<.8){
        colorVal = lerpColor(color(islandColors[(2)]), color(islandColors[(3)]), islandMap);
      }
      else{
        colorVal = lerpColor(color(islandColors[(3)]), color(islandColors[(4)]), islandMap);
      }
      
      fill(colorVal);
      onIsland = true;
      this.drawExtrudedTile((islandMap*30)+5, colorVal);
    }
  
    return onIsland
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
   * @param {number} i i coordinate to check
   * @param {number} j j coordinate to check
   * @returns {boolean}
   * @author {Aiden}
   */
  isIsland(i, j) {
    let zoom = 0.1;
    let noiseVal = noise(i * zoom, j * zoom);
    return noiseVal > .5;
  }

}







  
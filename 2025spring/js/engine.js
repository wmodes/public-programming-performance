/**
 * @file main.js
 * Entry point for the isometric tile-based p5.js world.
 * Handles camera movement, user interaction, and coordinate transformations.
 */

"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

// Project base code provided by {amsmith,ikarth}@ucsc.edu

var s = function (p) {
  // Tile rendering step sizes
  let tile_width_step_main;  // Half the width of a tile
  let tile_height_step_main; // Half the height of a tile

  // World and camera globals
  let tile_rows, tile_columns;
  let camera_offset;
  let camera_velocity;

  /////////////////////////////
  // Coordinate system transforms
  /////////////////////////////

  // Convert world position to screen position (offset by camera)
  p.worldToScreen = function([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i + camera_x, j + camera_y];
  }

  // Convert world position to camera-relative position
  p.worldToCamera = function([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i, j];
  }

  // Used to determine draw order of tiles
  p.tileRenderingOrder = function(offset) {
    return [offset[1] - offset[0], offset[0] + offset[1]];
  }

  // Convert screen position to world tile position
  p.screenToWorld = function([screen_x, screen_y], [camera_x, camera_y]) {
    screen_x -= camera_x;
    screen_y -= camera_y;
    screen_x /= tile_width_step_main * 2;
    screen_y /= tile_height_step_main * 2;
    screen_y += 0.5;
    return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
  }

  // Convert camera offset to world tile offset
  p.cameraToWorldOffset = function([camera_x, camera_y]) {
    let world_x = camera_x / (tile_width_step_main * 2);
    let world_y = camera_y / (tile_height_step_main * 2);
    return { x: Math.round(world_x), y: Math.round(world_y) };
  }

  // Convert world offset to camera position
  p.worldOffsetToCamera = function([world_x, world_y]) {
    let camera_x = world_x * (tile_width_step_main * 2);
    let camera_y = world_y * (tile_height_step_main * 2);
    return new p5.Vector(camera_x, camera_y);
  }

  // World instance is set up and preloaded here
  p.preload = function () {
    w = new World(p);
    if (w.p3_preload) {
      w.p3_preload();
    }
  }

  let w;
  p.setup = function () {
    let canvas = p.createCanvas(800, 400);
    canvas.parent("container");

    // Prevent arrow keys from scrolling the page
    window.addEventListener("keydown", function(e) {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
      }
    }, false);

    camera_offset = new p5.Vector(-p.width / 2, p.height / 2);
    camera_velocity = new p5.Vector(0, 0);

    if (w.p3_setup) {
      w.p3_setup();
    }

    // UI elements
    let label = p.createP();
    label.html("World key: ");
    label.parent("container");

    let input = p.createInput("Boaty McLongBoat");
    input.parent(label);
    input.input(() => {
      p.rebuildWorld(input.value());
    });

    p.createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

    p.rebuildWorld(input.value());
  }

  // Rebuild the world grid using a new key
  p.rebuildWorld = function(key) {
    if (w.p3_worldKeyChanged) {
      w.p3_worldKeyChanged(key);
    }
    tile_width_step_main = w.p3_tileWidth ? w.p3_tileWidth() : 32;
    tile_height_step_main = w.p3_tileHeight ? w.p3_tileHeight() : 14.5;
    tile_columns = Math.ceil(p.width / (tile_width_step_main * 2));
    tile_rows = Math.ceil(p.height / (tile_height_step_main * 2));
  }

  // Mouse click handler for selecting world tiles
  p.mouseClicked = function() {
    let world_pos = p.screenToWorld(
      [0 - p.mouseX, p.mouseY],
      [camera_offset.x, camera_offset.y]
    );

    if (w.p3_tileClicked) {
      w.p3_tileClicked(world_pos[0], world_pos[1]);
    }
    return false;
  }

  // Main render loop
  p.draw = function() {
    // Apply keyboard camera controls
    if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) camera_velocity.x -= 1;
    if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) camera_velocity.x += 1;
    if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) camera_velocity.y -= 1;
    if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) camera_velocity.y += 1;

    let camera_delta = new p5.Vector(0, 0);
    camera_velocity.add(camera_delta);
    camera_offset.add(camera_velocity);
    camera_velocity.mult(0.95); // easing
    if (camera_velocity.mag() < 0.01) camera_velocity.setMag(0);

    let world_pos = p.screenToWorld([0 - p.mouseX, p.mouseY], [camera_offset.x, camera_offset.y]);
    let world_offset = p.cameraToWorldOffset([camera_offset.x, camera_offset.y]);

    p.background(100);

    if (w.p3_drawBefore) {
      w.p3_drawBefore();
    }

    // Render all tiles (odd and even rows)
    let overdraw = 0.1;
    let y0 = Math.floor((0 - overdraw) * tile_rows);
    let y1 = Math.floor((1 + overdraw) * tile_rows);
    let x0 = Math.floor((0 - overdraw) * tile_columns);
    let x1 = Math.floor((1 + overdraw) * tile_columns);

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        p.drawTile(p.tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [camera_offset.x, camera_offset.y]);
      }
      for (let x = x0; x < x1; x++) {
        p.drawTile(
          p.tileRenderingOrder([x + 0.5 + world_offset.x, y + 0.5 - world_offset.y]),
          [camera_offset.x, camera_offset.y]
        );
      }
    }

    p.describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

    if (w.p3_drawAfter) {
      w.p3_drawAfter();
    }
  }

  // Draw a tooltip-like description of the tile under the mouse
  p.describeMouseTile = function([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = p.worldToScreen([world_x, world_y], [camera_x, camera_y]);
    p.drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
  }

  // Render a visual description of a tile
  p.drawTileDescription = function([world_x, world_y], [screen_x, screen_y]) {
    p.push();
    p.translate(screen_x, screen_y);
    if (w.p3_drawSelectedTile) {
      w.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
    }
    p.pop();
  }

  // Draw a single tile at given coordinates
  p.drawTile = function([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = p.worldToScreen([world_x, world_y], [camera_x, camera_y]);
    p.push();
    p.translate(0 - screen_x, screen_y);
    if (w.p3_drawTile) {
      w.p3_drawTile(world_x, world_y, -screen_x, screen_y);
    }
    p.pop();
  }
}

// Bootstrap the sketch
var myp5_1 = new p5(s, "container");

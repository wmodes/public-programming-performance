class Boat extends PathfindingNPC {
    constructor(x, y, speed/*, imagePath*/) {
        super(x, y, speed, objective, path); // not sure about those last 2
        // this.image = loadImage(imagePath);
        
    }

    draw() {
        // push();
        // imageMode(CENTER);
        // image(this.image, this.x, this.y);
        // pop();
        stroke(0, 255, 0, 128);
        beginShape();
        vertex(-this.tw, 0);
        vertex(0, this.th);
        vertex(this.tw, 0);
        vertex(0, -this.th);
        endShape();
    }
}

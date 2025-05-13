class Boat extends PathfindingNPC {
    constructor(x, y, speed, imagePath) {
        super(x, y, speed, objective, path); // not sure about those last 2
        this.image = loadImage(imagePath);
    }

    draw() {
        push();
        imageMode(CENTER);
        image(this.image, this.x, this.y);
        pop();
    }
}












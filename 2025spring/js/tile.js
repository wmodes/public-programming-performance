class Tile {
    constructor(p, type)
    {
        this.p = p;
        this.height;
        this.width;
        this.sprite;
        this.type; // either ocean or island (maybe biomes too later)
        this.image = [];
    }

    

    draw(y)
    {
        this.p.noStroke();
        world.p.image(this.image, -30, -30 + y, 60, 60);
        if (this.sprite) {
            world.p.image(this.sprite);
        }
    }
    
    setImage(image)
    {
        this.image = image;
    }

    getType() { return this.type; }
}
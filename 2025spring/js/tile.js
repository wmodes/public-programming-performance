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

    draw(x, y)
    {
        this.p.noStroke();
        
        
    }
    
    setImage(image)
    {
        this.image = image;
    }

    getType() { return this.type; }
}
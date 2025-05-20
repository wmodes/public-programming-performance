
class Tile {
    constructor(p, world)
    {
        this.p = p;
        this.world = world;
        this.height;
        this.width;
        this.sprite;
        this.type;
        this.subtype;
        this.surface;
        this.image = [];
        
    }

    changeAttributes(type, subtype = 0)
    {
        this.setType(type);
        this.setImage(this.world.tileTypes[type]);
        this.surface = type == "OCEAN" ? "LAND" : "WATER";
        this.subtype = subtype % this.image.length;
    }

    draw(args = {x: -30,y: -24,width: 64,height: 48,cropOffsetX: 0,cropOffsetY: 56,cropHeight: 24,cropWidth: 32})
    {
        let defaults = {x: -30,y: -24,width: 64,height: 48,cropOffsetX: 0,cropOffsetY: 56,cropHeight: 24,cropWidth: 32};
        let keys = Object.getOwnPropertyNames(defaults);
        for (let i = 0; i < keys.length; i++){
            //console.log(keys[i]);
            if (args[keys[i]] != undefined){
                defaults[keys[i]] = args[keys[i]];
            }
        }
        
        this.p.noStroke();
        this.world.p.image(this.image[this.subtype], defaults.x, defaults.y, defaults.width, defaults.height, defaults.cropOffsetX, defaults.cropOffsetY, defaults.cropWidth, defaults.cropHeight);
    
        if (this.sprite) {
            this.world.p.image(this.sprite, -30, -30 + y, 60, 60);
        }
    }
    

    setType(type)
    {
        this.type = type;
    }

    getType()
    {
        return this.type;
    }

    isLand()
    {
        return this.surface == "LAND" ? true : false;
    }

    setImage(image)
    {
        this.image = image;
    }

    getType() { return this.type; }
}
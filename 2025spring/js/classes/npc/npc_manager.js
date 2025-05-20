const MAX_ENTITIES = 300;

class NpcManager {
    constructor() {
        this.entities = [];
    }

    spawnEntity(entity) {
        if (this.entities.length >= MAX_ENTITIES) {
            this.entities.shift()
        }
        this.entities.push(entity)
    }

    draw(p, camera_offset) {
        for (let entity of this.entities) {
            entity.draw(p, camera_offset);
        }
    }

    update(world) {
        for (let entity of this.entities) {
            entity.update(world);
        }        
    }
}
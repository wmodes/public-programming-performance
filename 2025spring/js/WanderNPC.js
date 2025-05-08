class WanderNPC extends NPC{
    update(){
        this.move([
            Math.pow(-1,get_random_int_between_inclusive(0,1)),
            Math.pow(-1,get_random_int_between_inclusive(0,1))])
    }
}
function get_random_int_between_inclusive(x,y){
    return Math.floor(Math.random() * (y + 1 - x)) + x
    
}
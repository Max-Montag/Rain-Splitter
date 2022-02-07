class RainSimulationEnv{
    constructor(wrapperID, dropAmount){
        this.p5Obj = null;
        this.wrapperID = wrapperID;
        this.frameFrate = 30;
        this.backgroundColor = 40; // 0 to 255

        this.dropAmount = dropAmount;
        this.raindrops = [];
    }

    // set p5 instance
    setP5(p){
        this.p5Obj = p;
    }

    getRaindrops(){
        return this.raindrops;
    }

    // generateR
}

class rainDrop{
    constructor(born, length, x, y, speed){
        this.born = born; // timestamp of creation
        this.length = length;
        this.pos = { 'x': x, 'y': y }; 
        this.speed = speed;
    }

    getX(time){ 
        return this.pos.x + ( time - this.born ) * this.speed;
    }

    getY(time){ 
        return this.pos.y; 
    }

    getLength(){
        return this.length;
    }
}

function rainSimulationCanvas(env) {

    // attach new canvas element to wrapper
    document.getElementById(env.wrapperID).innerHTML = '';

    // create p5 instance
    new p5((p)=>{

        // connect to environment
        env.setP5(p);

        // run once
        p.setup = function () {

            // create new canvas - fill wrapper
            p.createCanvas(
                document.getElementById(env.wrapperID).clientWidth, 
                document.getElementById(env.wrapperID).clientHeight
            );
        }

        // run continous (frameRate)
        p.draw = function () {
    
            // set FrameRate
            p.frameRate(env.frameFrate);
    
    
            // draw background
            p.background(env.backgroundColor);

            // TODO code goes here
    
            if (p.mouseIsPressed) {
                p.fill(0);
              } else {
                p.fill(255);
              }
            
            p.ellipse(p.mouseX, p.mouseY, 80, 80);

        }
    }, env.wrapperID); // attach to DOM
    
}
class RainSimulationEnv{
    constructor(wrapperID, backgroundColor, dropAmount, heaviness){ 
        this.frameRate = 30;
        this.wrapperID = wrapperID;
        this.backgroundColor = backgroundColor; // 0 <= backgroundColor < 256
        this.p5Obj = null;
        this.canvas = null;

        this.dropAmount = dropAmount;
        this.heaviness = ( heaviness > 100 ) ? 100 : heaviness; // 0 < heaviness < 100; drops per second
        this.raindrops = [];
    }

    getwrapperID(){ return this.wrapperID }

    // connect p5 instance
    setP5(p){ this.p5Obj = p }

    // connect canvas
    setCanvas(canvas){ this.canvas = canvas }

    getRaindrops(){ return this.raindrops }

    getFrameRate(){ return this.frameRate }

    getBackgroundColor(){ return this.backgroundColor }

    getTime(){ 

        // return current time based on canvas age
        return this.p5Obj.millis()
    }

    getWidth(){
        return this.canvas.width;
    }

    getHeight(){
        return this.canvas.height;
    }

    // create a random raindrop
    randomDrop(){
        return new rainDrop(
            this, // pass this environment to the raindrop
            this.p5Obj.millis(),
            Math.random() * 100, // length
            Math.random() * this.canvas.width, // x position
            - ( Math.random() * 300 ) - 100, // y position
            Math.random() * 100, // speed
        );
    }

    rain(){

        // counter for interation over the drop array
        var dropIndex = 0;

        // fill array initialy
        while(this.raindrops.length < this.dropAmount)
            this.raindrops.push(this.randomDrop())

            /*
        setInterval(() => {
            
            dropIndex++; // increment each timestep

            if(dropIndex > this.dropAmount)
                dropIndex = 0;

            // generate random raindrop
            this.raindrops[dropIndex] = this.randomDrop();
            
        }, 1100 - (this.heaviness * 100) );
        */
    }

}

class rainDrop{
    constructor(env, born, length, x, y, speed){
        this.env = env;
        this.born = born; // timestamp of creation
        this.length = length;
        this.pos = { 'x': x, 'y': y }; 
        this.speed = speed;
    }

    getX(){ 
        return this.pos.x; 
    }

    getY(){ 
        return ( ( this.env.getTime() - this.born ) * this.speed + this.pos.y ) % this.env.getHeight();
    }

    getLength(){
        return this.length;
    }
}

function rainSimulationCanvas(env) {

    // attach new canvas element to wrapper
    document.getElementById(env.getwrapperID()).innerHTML = '';

    // create p5 instance
    new p5((p)=>{

        // connect to environment
        env.setP5(p);

        // run once
        p.setup = function () {

            // create new canvas - fill wrapper
            canvas = p.createCanvas(
                document.getElementById(env.getwrapperID()).clientWidth, 
                document.getElementById(env.getwrapperID()).clientHeight
            );

            // connect to canvas
            env.setCanvas(canvas);
        }

        // run continous (frameRate)
        p.draw = function () {
    
            // set FrameRate
            p.frameRate(env.getFrameRate());
    
    
            // draw background
            p.background(env.getBackgroundColor());

            p.fill(255);

            // draw raindrops
            for(let drop of env.getRaindrops()){
                console.log(drop.getY())

                // draw raindrop
                p.line(drop.getX(), drop.getY(), drop.getX(), drop.getY()  + drop.getLength())
            }

            // draw cursor for testing
            p.ellipse(p.mouseX, p.mouseY, 40, 40);

        }
    }, 'rainSimulation-wrapper'); // attach to DOM
    
}
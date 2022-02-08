class RainSimulationEnv{
    constructor(wrapperID, settings, randomize = true){ 
        this.frameRate = settings.frameRate || 60;
        this.wrapperID = wrapperID;
        this.backgroundColor = settings.backgroundColor || 50; // 0 <= backgroundColor < 256
        this.p = null;
        this.canvas = null;

        this.dropAmount = settings.dropAmount || 20;
        this.speed = settings.speed || 10;
        this.xSpeed = settings.xSpeed || 4;
        this.speedSpread = settings.speedSpread || 15;
        this.thickness = settings.thickness || 1;
        this.minLength = settings.minLength ||20;
        this.lenSpread = settings.lenSpread || 20;
        this.rainColor = settings.rainColor || 100;
        this.umbrellaColor = settings.umbrellaColor || 240;
        this.umbrellaSize = settings.umbrellaSize || 100;
        this.raindrops = [];
        this.umbrella = new umbrella(this, this.umbrellaSize);
        this.randomize = settings.randomize || true;
    }

    // connect p5 instance
    setP5(p){
        this.p = p;
    }

    // connect canvas
    setCanvas(canvas){ this.canvas = canvas }

    // get Canvas width
    getWidth(){ return this.canvas.width }

    // get Canvas height
    getHeight(){ return this.canvas.height }

    // create a random raindrop
    randomDrop(){
        return new rainDrop(
            this, // pass this environment to the raindrop
            this.minLength + Math.random() * this.lenSpread, // length
            Math.random() * this.canvas.width, // x position
            - (Math.random() * this.canvas.height), // y position
            this.speed + (Math.random() * this.speedSpread)// speed
        );
    }

    rain(){
        // fill array initialy
        while(this.raindrops.length < this.dropAmount)
            this.raindrops.push(this.randomDrop())

        // randomize environment values
        /* TODO 
        if(this.randomize){

            let randomSeed = 0;

            setInterval(()=>{

                // inkecrement random seed
                randomSeed += 0.01;
                let noise = this.p.noise(randomSeed) - 0.5;

                console.log(noise)

                // randomize
                this.dropAmount = this.dropAmount + noise;
                this.speed = this.speed + noise;
                this.xSpeed = this.xSpeed + noise;

            }, 100); // randomize rate
        }
        */
    }

    resizeCanvas() {
        this.p.resizeCanvas(document.getElementById(this.wrapperID).clientWidth, document.getElementById(this.wrapperID).clientHeight);
    }

}

class rainDrop{
    constructor(env, length, x, y, speed){
        this.env = env;
        this.length = length;
        this.pos = { 'x': x, 'y': y }; 
        this.speed = speed;
    }

    getPos(){
        let x = this.pos.x + this.env.xSpeed;
        let y = this.pos.y + this.speed;

        // check if bottom has been reached
        if( y > this.env.getHeight() ||
            (y + this.length > this.env.umbrella.getY() && //check if umbrella was hit
             y + this.length < this.env.umbrella.getY() + this.env.umbrella.stickLength &&
             x > this.env.umbrella.getX1() &&
             x < this.env.umbrella.getX2() )) {

            // set raindrop to top
            x = Math.random() * this.env.getWidth();
            y = - (Math.random() * this.env.getHeight());
        }

        // update pos
        this.pos = { 'x': x, 'y': y }

        return this.pos;
    }

    getLength(){
        return this.length;
    }
}

class umbrella{
    constructor(env, width, stickLength = width / 2, handleRadius = width / 8) {
        this.env = env
        this.width = width;
        this.stickLength = stickLength;
        this.handleRadius = handleRadius;
    }

    getX(){ return this.env.p.mouseX }
    getX1(){ return this.env.p.mouseX - this.width / 2 }
    getX2(){ return this.env.p.mouseX + this.width / 2 }
    getY(){ return this.env.p.mouseY }
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

            //hide cursor
            p.noCursor();

            // create new canvas - fill wrapper
            canvas = p.createCanvas(
                document.getElementById(env.wrapperID).clientWidth, 
                document.getElementById(env.wrapperID).clientHeight
            );

            // connect to canvas
            env.setCanvas(canvas);
        }

        // run continous (frameRate)
        p.draw = function () {
    
            // set FrameRate
            p.frameRate(env.frameRate);
    
            // draw background
            p.background(env.backgroundColor);

            // switch to rain thickness
            p.strokeWeight(env.thickness);

            // draw raindrops
            for(let drop of env.raindrops) {
                let pos = drop.getPos();

                // noisy line color
                p.stroke(env.rainColor /*+ env.p.noise(pos.y) */);

                // draw raindrop
                p.line(pos.x, pos.y, pos.x, pos.y + drop.getLength());
            }

            // switch to umbrella color
            p.stroke(0);
            p.fill(env.umbrellaColor);
            p.strokeWeight(1);

            // draw umbrella
            p.arc(env.umbrella.getX(), env.umbrella.getY(), env.umbrella.width, env.umbrella.width, p.PI , p.PI * 2,  p.PIE);

            // draw umbrella stick
            p.line(env.umbrella.getX(), env.umbrella.getY(), env.umbrella.getX(), env.umbrella.getY() + env.umbrella.stickLength);

            // draw umbrella handle
            p.noFill();
            p.arc(env.umbrella.getX() - env.umbrella.handleRadius / 2, env.umbrella.getY() + env.umbrella.stickLength,
            env.umbrella.handleRadius, env.umbrella.handleRadius, 0, p.PI,  p.OPEN);

        }
    }, env.wrapperID); // attach to DOM

    // handle resizeEvents -> resize canvas to fill wrapper
    document.getElementById(env.wrapperID).onresize = function() {
        canvasManager.resizeCanvas(document.getElementById(env.wrapperID).clientWidth, document.getElementById(env.wrapperID).clientHeight);
    };
    
}
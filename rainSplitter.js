class RainSimulationEnv{
    constructor(wrapperID, settings){ 
        this.frameRate = settings.frameRate || 60;
        this.wrapperID = wrapperID;
        this.backgroundColor = settings.backgroundColor || 50; // 0 <= backgroundColor < 256
        this.p = null;
        this.canvas = null;

        this.dropAmount = settings.dropAmount || 20;
        this.speed = settings.speed || 15;
        this.xSpeed = settings.xSpeed || 4;
        this.speedSpread = settings.speedSpread || 15;
        this.thickness = settings.thickness || 1;
        this.minLength = settings.minLength ||20;
        this.lenSpread = settings.lenSpread || 20;
        this.rainColor = settings.rainColor || 100;
        this.rainNoiseStep = settings.rainNoiseStep || 0.2;
        this.rainNoiseFactor = settings.rainNoiseFactor || 0.2;
        this.noiseSeed = 0;
        this.raindrops = [];

        if(!this.plainRain){
            this.umbrellaColor = settings.umbrellaColor || 70;
            this.umbrellaSize = settings.umbrellaSize || 200;
            this.avatarColor = settings.avatarColor || 240;
            this.avatarWidth = settings.avatarWidth || 40;
            this.avatarHeight = settings.avatarHeight || 80;
            this.avatarSpeed = settings.avatarSpeed || 5;
        }
    }

    // connect p5 instance
    setP5(p){
        this.p = p;
    }

    setCanvas(canvas){ 

        // connect environment to canvas
        this.canvas = canvas;

        // add raindrops
        while(this.raindrops.length < this.dropAmount){
            let drop = new RainDrop(this);
            this.raindrops.push(drop);
        }

        // init avatar & umbrella
        if(!this.plainRain){
            this.avatar = new Avatar (this, this.avatarWidth, this.avatarHeight, this.avatarSpeed);
            this.umbrella = new Umbrella(this, this.umbrellaSize);
        }
    }

    // get Canvas width
    getWidth(){ return this.canvas.width }

    // get Canvas height
    getHeight(){ return this.canvas.height }

    // create a random raindrop
    randomDrop(){
        return new RainDrop(
            this, // pass this environment to the raindrop
            this.minLength + Math.random() * this.lenSpread, // length
            Math.random() * this.canvas.width, // x position
            - (Math.random() * this.canvas.height), // y position
            this.speed + (Math.random() * this.speedSpread) // speed
        );
    }

    // reset game objects (player has died)
    reset(){
        this.umbrella.resize();
        this.avatar.pos.x = this.avatarWidth / 2;
        this.avatar.speed = this.avatarSpeed;
    }

    wind(){
        if(this.rainNoiseFactor > 0){
            this.noiseSeed += this.rainNoiseStep;
            this.xSpeed = (this.p.noise(this.noiseSeed) - 0.5) * this.rainNoiseFactor;
        }
    }

    resizeCanvas() {
        this.p.resizeCanvas(document.getElementById(this.wrapperID).clientWidth, document.getElementById(this.wrapperID).clientHeight);
    }
}

class RainDrop{
    constructor(env){
        this.env = env;
        this.length = this.env.minLength + Math.random() * this.env.lenSpread;
        this.pos = { 'x': 0, 'y': 0 }; 
        this.speed = this.env.speed + (Math.random() * this.env.speedSpread);
        this.updatePos(true);
    }

    updatePos(init = false){

        // change position based on speed
        this.pos.x += this.env.xSpeed;
        this.pos.y += this.speed;

        // check if bottom has been reached or umbrella has been hit
        if(init || this.pos.y > this.env.getHeight() || !this.env.plainRain &&
            (this.pos.y + this.length > this.env.umbrella.getY() && 
            this.pos.y + this.length < this.env.umbrella.getY() + this.env.umbrella.stickLength &&
            this.pos.x > this.env.umbrella.getX() - this.env.umbrella.width / 2 &&
            this.pos.x < this.env.umbrella.getX() + this.env.umbrella.width / 2)) {

            // increase x-range based on xSpeed (wind) -> make sure it rains everywhere
            let windRange =  (this.env.getHeight() / this.env.speed) * this.env.speed;

            // set raindrop to random position in top offset
            this.pos.x = (Math.random() * (this.env.getWidth() + (2 * windRange))) - windRange;
            this.pos.y = - (Math.random() * this.env.getHeight());

        }

        // check if avatar was hit
        if(!this.env.plainRain && 
            this.env.avatar &&
            this.pos.y + this.length > this.env.getHeight() - this.env.avatar.height &&
            this.pos.x > this.env.avatar.pos.x - this.env.avatar.width / 2 &&
            this.pos.x < this.env.avatar.pos.x + this.env.avatar.width / 2){
                this.env.avatar.hit();
        }
    }
}

class Umbrella{
    constructor(env, width) {
        this.env = env;
        this.width = width;
        this.resize()
    }

    // resize (shrink for level up)
    resize(factor = 1){
        if(this.width * factor > this.env.avatar.width * 4){
            this.width = (factor == 1) ? this.width = this.env.umbrellaSize : this.width * factor;
            this.stickLength = this.width / 2;
            this.handleRadius = this.width / 8;
        }
    }

    getX(){ return this.env.p.mouseX }
    getY(){ return this.env.p.mouseY }

}

class Avatar{

    constructor(env, width, height, speed){
        this.env = env;
        this.width = width;
        this.height = height;
        this.pos = {'x': this.width / 2, 'y': this.env.getHeight() - this.height};
        this.speed = speed;
    }

    // update position based on speed
    updatePos(){

        // calc new position
        this.pos.x = this.pos.x + this.speed;

        // check for wall collision
        if(this.pos.x + this.width / 2 >= this.env.getWidth() || // right collision
           this.pos.x - this.width / 2 <= 0){ // left collision

            // turn arround & increase speed
            this.speed = -this.speed * 1.05;

            // shrink umbrella
            this.env.umbrella.resize(0.95);

        }        
    }

    hit(){
        this.env.reset();
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

            //hide cursor
            if(!env.plainRain){
                p.noCursor();
                p.rectMode(p.CENTER);
            }

            // create new canvas - fill wrapper
            canvas = p.createCanvas(
                document.getElementById(env.wrapperID).clientWidth, 
                document.getElementById(env.wrapperID).clientHeight
            );

            // connect to canvas
            env.setCanvas(canvas);

            // set FrameRate
            p.frameRate(env.frameRate);
        }

        // run continous (frameRate)
        p.draw = function () {

            // draw background
            p.background(env.backgroundColor);

            // add some random wind
            env.wind();

            // rain thickness
            p.strokeWeight(env.thickness);

            // draw raindrops
            for(let drop of env.raindrops) {

                // update position of this raindrop
                drop.updatePos();

                // noisy line color
                p.stroke(env.rainColor);

                // draw raindrop
                p.line(drop.pos.x, drop.pos.y, drop.pos.x, drop.pos.y + drop.length);
            }

            // draw additional elements
            if(!env.plainRain && env.canvas){

                // update avatar position
                env.avatar.updatePos();

                // avatar color
                p.fill(env.avatarColor);

                // draw avatar
                p.rect(env.avatar.pos.x, env.avatar.pos.y, env.avatar.width, env.avatar.height);

                // umbrella color
                p.fill(env.umbrellaColor);
                p.stroke(0);
                p.strokeWeight(2);

                // draw umbrella
                p.arc(env.umbrella.getX(), env.umbrella.getY(), env.umbrella.width, env.umbrella.width, p.PI , p.PI * 2,  p.PIE);

                // draw umbrella stick
                p.line(env.umbrella.getX(), env.umbrella.getY(), env.umbrella.getX(), env.umbrella.getY() + env.umbrella.stickLength);

                // draw umbrella handle
                p.noFill();
                p.arc(env.umbrella.getX() - env.umbrella.handleRadius / 2, env.umbrella.getY() + env.umbrella.stickLength,
                env.umbrella.handleRadius, env.umbrella.handleRadius, 0, p.PI,  p.OPEN);
                
            }
        }
    }, env.wrapperID); // attach to DOM

    // handle resizeEvents -> resize canvas to fill wrapper
    document.body.onresize = function() {
        env.resizeCanvas(document.getElementById(env.wrapperID).clientWidth, document.getElementById(env.wrapperID).clientHeight);
        env.avatar.pos = {'x': env.avatar.width / 2, 'y': env.getHeight() - env.avatar.height};
    };
    
}

class RainSimulationEnv{
    constructor(wrapperID, settings){ 
        this.frameRate = (settings.frameRate) ? settings.frameRate : 60;
        this.wrapperID = wrapperID;
        this.backgroundColor = (settings.backgroundColor) ? settings.backgroundColor : 50; // 0 <= backgroundColor < 256
        this.p = null;
        this.canvas = null;

        this.dropAmount = (settings.dropAmount) ? settings.dropAmount : 20;
        this.speed = (settings.speed) ? settings.speed : 10;
        this.minLength = (settings.minLength) ? settings.minLength : 20;
        this.lenSpread = (settings.lenSpread) ? settings.lenSpread : 20;
        this.rainColor = (settings.rainColor) ? settings.rainColor : 240;
        this.raindrops = [];
        this.umbrella = new umbrella(this, 200);
    }

    getwrapperID(){ return this.wrapperID }

    // connect p5 instance
    setP5(p){
        this.p = p;
    }

    // connect canvas
    setCanvas(canvas){ this.canvas = canvas }

    getRaindrops(){ return this.raindrops }

    getUmbrella(){ return this.umbrella }

    getFrameRate(){ return this.frameRate }

    getBackgroundColor(){ return this.backgroundColor }

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
            this.minLength + Math.random() * this.lenSpread, // length
            Math.random() * this.canvas.width, // x position
            - (Math.random() * this.canvas.height), // y position
            this.speed + (Math.random() * 10)// speed
        );
    }

    rain(){
        // fill array initialy
        while(this.raindrops.length < this.dropAmount)
            this.raindrops.push(this.randomDrop())
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
        let x = this.pos.x;
        let y = this.pos.y + this.speed;

        // check if bottom has been reached
        if( y > this.env.getHeight() ||
            (y + this.length > this.env.getUmbrella().getY() && //check if umbrella was hit
             x > this.env.getUmbrella().getX1() &&
             x < this.env.getUmbrella().getX2() )) {

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
    constructor(env, width) {
        this.env = env
        this.width = width;
    }

    getX1(){ return this.env.p.mouseX - this.width / 2}
    getX2(){ return this.env.p.mouseX + this.width / 2}
    getY(){ return this.env.p.mouseY }
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

            //hide cursor
            p.noCursor();

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

            p.fill(env.rainColor);

            // draw raindrops
            for(let drop of env.getRaindrops()) {
                let pos = drop.getPos();

                // noisy line color
                p.stroke(env.rainColor /*+ env.p.noise(pos.y) */);

                // draw raindrop
                p.line(pos.x, pos.y, pos.x, pos.y + drop.getLength());
            }

            // draw umbrella line
            p.line(p.mouseX - 100, p.mouseY, p.mouseX + 100, p.mouseY);

        }
    }, env.getwrapperID()); // TODO
    
}
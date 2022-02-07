class Env{
    constructor(wrapperID){
        this.wrapperID = wrapperID;
        this.frameFrate = 30
        this.backgroundColor = 40 // 0 to 255
    }
}

function sketchNameCanvas(env) {

    // attach new canvas element to wrapper
    document.getElementById(env.wrapperID).innerHTML = '';

    // create p5 instance
    new p5((p)=>{

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
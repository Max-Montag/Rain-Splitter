 // create environment
const rainEnv = new RainSimulationEnv(
    wrapperID = 'rainSimulation-wrapper', 
    settings = {
        'backgroundColor': 50,
        'rainColor': 250,
        'dropAmount': 60,
        'speed': 15,
        'minLength': 5,
        'lenSpread': 15
    }
)


// create canvas and attach to DOM
rainSimulationCanvas(rainEnv);

setTimeout(()=>{

    // start raining
    rainEnv.rain();

}, 2000);
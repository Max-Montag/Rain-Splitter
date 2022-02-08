 // create environment
const rainEnv = new RainSimulationEnv(
    wrapperID = 'rainSimulation-wrapper', 
    settings = {
        'backgroundColor': 50,
        'rainColor': 250,
        'dropAmount': 40,
        'heaviness': 10,
        'speed': 10,
        'minLength': 10,
        'lenSpread': 30
    }
)


// create canvas and attach to DOM
rainSimulationCanvas(rainEnv);

setTimeout(()=>{

    // start raining
    rainEnv.rain();

}, 2000);
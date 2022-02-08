 // create environment
const rainEnv = new RainSimulationEnv(
    wrapperID = 'rainSimulation-wrapper', 
    settings = {
        'backgroundColor': 50,
        'dropAmount': 700,
        'speed': 15,
        'speedSpread': 5,
        'minLength': 5,
        'lenSpread': 20
    }
)


// create canvas and attach to DOM
rainSimulationCanvas(rainEnv);

setTimeout(()=>{

    // start raining
    rainEnv.rain();

}, 2000);
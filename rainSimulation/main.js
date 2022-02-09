 // create environment
const rainEnv = new RainSimulationEnv(
    wrapperID = 'rainSimulation-wrapper', 
    settings = {
        'backgroundColor': 50,
        'dropAmount': 700,
        'speed': 15,
        'speedSpread': 5,
        'minLength': 5,
        'lenSpread': 20,
        'plainRain': false,  // draw just rain and no other components
        'avatarSpeed': 5
    }
)


// create canvas and attach to DOM
rainSimulationCanvas(rainEnv);

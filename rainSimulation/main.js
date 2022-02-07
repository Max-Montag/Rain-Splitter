 // create environment
const rainEnv = new RainSimulationEnv(
    'rainSimulation-wrapper', // wrapper id
    50, // 0 <= backgroundColor < 256
    20, // drop amount
    1 // heaviness (drops per second)
)


// create canvas and attach to DOM
rainSimulationCanvas(rainEnv);

setTimeout(()=>{

// start raining
rainEnv.rain();

}, 2000);
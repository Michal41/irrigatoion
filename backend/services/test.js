var Gpio = require('onoff').Gpio;
var PIN = new Gpio(516, 'out', { initial: 1 }); // on rasberyPI it is physical 7


const runPin = async () => {
  PIN.writeSync(0)
  await new Promise(resolve => setTimeout(resolve, 10000));
  PIN.writeSync(1)
  PIN.unexport()
}


runPin().then()


const dotenv = require('dotenv');
dotenv.config();
const preferenceService = require("../services/preference-service")

let Gpio;

if (process.env.NODE_ENV !== 'test') {
  Gpio = require('onoff').Gpio;
} else {
  Gpio = class {
    constructor() {}
    writeSync() {}
  };
}

var PIN = new Gpio(516, 'out', { initial: 1 }); // on rasberyPI it is physical 7


exports.irrigate = async (irrigationTimeInSeconds, sensorName) => {
    console.log("Start Irrigation...")
    PIN.writeSync(0)
    await new Promise(resolve => setTimeout(resolve, 1000 * irrigationTimeInSeconds));
    PIN.writeSync(1)
    console.log('Irrigation finished')
    return "Success"
}

exports.getSensorNames = async () => {
    const preferences = await preferenceService.getPreferences()
    return preferences.map(preference => preference.sensorName)
}


exports.stopIrrigation = async () => {
    PIN.writeSync(1)
}
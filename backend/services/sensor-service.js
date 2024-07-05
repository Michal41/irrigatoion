const dotenv = require('dotenv');
dotenv.config();
const preferenceService = require("../services/preference-service")
var Gpio = require('onoff').Gpio;
var PIN = new Gpio(516, 'out');


exports.irrigate = async (irrigationTimeInSeconds, sensorName) => {
    console.log("Start Irrigation...")
    PIN.writeSync(1)
    await new Promise(resolve => setTimeout(resolve, 1000 * irrigationTimeInSeconds));
    PIN.writeSync(0)
    PIN.unexport()
    console.log('Irrigation finished')
    return "Success"
}

exports.getSensorNames = async () => {
    const preferences = await preferenceService.getPreferences()
    return preferences.map(preference => preference.sensorName)
}

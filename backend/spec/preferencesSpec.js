const MeasurementService = require("../services/measurement-service");
const PreferencesService = require("../services/preference-service");
const Preference = require('../models/preferences');


describe("A suite", function() {
  it("should update user preferences", async function() {
    // create measurement to create sensor
    const sensorName = 'fox'
    const payload =  {
      irrigationTimeStart: '21:00',
      irrigationTimeEnd: '4:00',
      minIrrigationIntervalInMinutes: 5,
      irrigationTimeInSeconds: 5,
      capacityBuffer: 5,
      signalPin: 2,
      sensorName
    }
    await MeasurementService.setMeasurement(50, sensorName)
    await PreferencesService.getPreference(sensorName)
    await PreferencesService.updatePreferences(payload, sensorName)
    const preferences = await Preference.findOne({ sensorName })
    expect(preferences.irrigationTimeInSeconds).toBe(payload.irrigationTimeInSeconds);
    expect(preferences.irrigationTimeStart).toBe(payload.irrigationTimeStart);
  });
});

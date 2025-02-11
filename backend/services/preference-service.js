const Preference = require('../models/preferences');

exports.getPreference = async (sensorName) => {
    return (sensorName && sensorName !== "undefined") ? await Preference.findOneAndUpdate({
            sensorName
        }, {
            $setOnInsert: {
                irrigationTimeStart: '21:00',
                irrigationTimeEnd: '4:00',
                minIrrigationIntervalInMinutes: 15,
                irrigationTimeInSeconds: 10,
                capacityBuffer: 500,
                signalPin: 18,
                sensorName
            }
        }, {
            returnOriginal: false,
            upsert: true,
            new: true
        }) : {}
}

exports.getPreferences = async () => {
    return await Preference.find({})
}

exports.updatePreferences = async (payload, sensorName) => {
    console.log(payload)
    const preferences = {
        minIrrigationIntervalInMinutes: payload.minIrrigationIntervalInMinutes,
        irrigationTimeInSeconds: payload.irrigationTimeInSeconds,
        irrigationTimeStart: payload.irrigationTimeStart,
        irrigationTimeEnd: payload.irrigationTimeEnd,
        capacityBuffer: payload.capacityBuffer,
        signalPin: payload.signalPin,
        sensorName: payload.sensorName
    }
    const preference = await Preference.findOneAndUpdate({
        sensorName
    }, {
        $set: preferences
    }, {
        returnOriginal: false,
        upsert: true,
        new: true
    });
    return preference
}

const Irrigation = require('../models/irrigations')
const preferenceService = require("../services/preference-service")
const sensorService = require("../services/sensor-service")
const irrigationService = require("./irrigation-service")

exports.getLastIrrigation = async (sensorName) => {
    return await Irrigation.findOne({ sensorName }).sort({ timestamp: -1 });
}

exports.setIrregation = async (capacity, sensorName) => {
    return await Irrigation.create({ capacity, sensorName })
}

exports.getIrrigations = async (sensorName) => {
    return await Irrigation.find({ sensorName })
}

exports.irrigateIfNeeded = async (currentCapacity, sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName)
    if(!isInIrrigationTimeSpan(preferences)) {
        return false
    }
    if(currentCapacity > preferences.capacityBuffer) {
        irrigationService.setIrregation(currentCapacity, sensorName)
        sensorService.irrigate(preferences.irrigationTimeInSeconds, sensorName)
        return true
    } else {
        sensorService.stopIrrigation(sensorName)
    }
    return false
}


function isInIrrigationTimeSpan(preferences) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const startDate = new Date(currentYear, currentMonth, currentDay, ...preferences.irrigationTimeStart.split(':').map(Number));
    const endDate = new Date(currentYear, currentMonth, currentDay, ...preferences.irrigationTimeEnd.split(':').map(Number));
    if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }
    const currentTime = new Date();
    return currentTime >= startDate && currentTime <= endDate;
}


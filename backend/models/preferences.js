const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    minIrrigationIntervalInMinutes: {
        type: Number,
        require: true
    },
    irrigationTimeInSeconds: {
        type: Number,
        require: true
    },
    capacityBuffer: {
        type: Number,
        require: true
    },
    sensorName: {
        type: String,
        require: true
    },
    signalPin: {
        type: Number,
        required: true
    },
    irrigationTimeStart: {
        type: String,
        required: true
    },
    irrigationTimeEnd: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('preferences', preferenceSchema);

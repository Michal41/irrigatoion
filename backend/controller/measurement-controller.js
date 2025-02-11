const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")

exports.getLastMinuteMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setMinutes(new Date().getMinutes() - 1))
        }
    }
    res.json(await measurementService.getSecondlyMeasurements(queryFilter));
};

exports.getLastHourMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setHours(new Date().getHours() - 1))
        }
    }
    res.json(await measurementService.getMinutelyMeasurements(queryFilter));
};

exports.getLastDayMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
        }
    }
    res.json(await measurementService.getHourlyMeasurements(queryFilter));
};

exports.getLastWeekMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
    }
    res.json(await measurementService.getHourlyMeasurements(queryFilter));
};

exports.getLastMonthMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
    }
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.getAllMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName
    }
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.setMeasurement = async (req, res, next) => {
    const result = await measurementService.setMeasurement(req.body.capacity, req.params.sensorName);
    const irrigated = await irrigationService.irrigateIfNeeded(req.body.capacity, req.params.sensorName);
    console.log(irrigated)
    res.json({ ...result, irrigated })
};

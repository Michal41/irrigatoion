const MeasurementController = require("../controller/measurement-controller");
const sensorService = require('../services/sensor-service');
const sinon = require('sinon');


const lowMoisturePayload = {
  body: {
    capacity: 800,
  },
  params: {
    sensorName: 'fox'
  }
}

const highMoisturePayload = {
  body: {
    capacity: 1,
  },
  params: {
    sensorName: 'fox'
  }
}

describe("A suite", function() {
  let mockIrrigate;
  let mockStopIrrigate;
  let clock;
  let sandbox;
  beforeEach(function () {
      sandbox = sinon.createSandbox();
      mockIrrigate = sandbox.stub(sensorService, 'irrigate').resolves('Success');
      mockStopIrrigate = sandbox.stub(sensorService, 'stopIrrigation').resolves('Success');
      clock = sinon.useFakeTimers(new Date().getTime());
  });

  afterEach(function () {
    sandbox.restore();
    clock.restore();
  });

  // default value for capacityBuffer is 500
  it("should call irrigation fun if soil is dry", async function() {
    const res = {json: () => {}}
    await MeasurementController.setMeasurement(lowMoisturePayload, res)
    expect(mockIrrigate.calledOnce).toBe(true);
  });

  it("should not call irrigation fun if soil is wet", async function() {
    // low capacity indicate that soil is wet
    const req = {
      body: {
        capacity: 1,
      },
      params: {
        sensorName: 'fox'
      }
    }
    const res = {json: () => {}}
    await MeasurementController.setMeasurement(highMoisturePayload, res)
    expect(mockIrrigate.calledOnce).toBe(false);
  });

  it("should call stop irrigate function if soil moisture is high enough", async function() {
    const res = {json: () => {}}
    await MeasurementController.setMeasurement(lowMoisturePayload, res)
    expect(mockIrrigate.calledOnce).toBe(true);
    // Advance time by 2 hours
    clock.tick(22 * 60 * 60 * 1000);
    await MeasurementController.setMeasurement(highMoisturePayload, res)
    expect(mockStopIrrigate.calledOnce).toBe(true);
  });
});

const MeasurementController = require("../controller/measurement-controller");
const sensorService = require('../services/sensor-service');
const sinon = require('sinon');

describe("A suite", function() {
  let mockIrrigate;
  beforeEach(function () {
      // Mock the irrigate function
      mockIrrigate = sinon.stub(sensorService, 'irrigate').resolves('Success');
  });

  it("should call irrigation fun", async function() {
    const req = {
      body: {
        capacity: 600,
      },
      params: {
        sensorName: 'fox'
      }
    }
    const res = {json: () => {}}
    await MeasurementController.setMeasurement(req, res)
    expect(mockIrrigate.calledOnce).toBe(true);
    expect(true).toBe(true);
  });
});

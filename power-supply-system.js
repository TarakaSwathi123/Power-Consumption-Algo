class PowerSupplySystem {
  constructor() {
    this.MAX_CAPACITY = 100;
    this.SAFETY_LIMIT = 92;
    this.DEVICE_MAX_CAPACITY = 40;
    this.devices = []; // Queue of connected devices
    this.totalConsumption = 0;
  }

  connect(deviceId, timestamp) {
    const newDevice = { id: deviceId, timestamp, consumption: 0 };
    this.devices.push(newDevice);
    this.reallocatePower();
    this.logState();
  }

  disconnect(deviceId) {
    const index = this.devices.findIndex(device => device.id === deviceId);
    if (index !== -1) {
      this.devices.splice(index, 1);
      this.reallocatePower();
      this.logState();
    }
  }

  changeConsumption(deviceId, newConsumption) {
    const device = this.devices.find(device => device.id === deviceId);
    if (device) {
      device.consumption = Math.min(newConsumption, this.DEVICE_MAX_CAPACITY);
      this.reallocatePower();
      this.logState();
    }
  }

  reallocatePower() {
    this.totalConsumption = 0;
    this.devices.sort((a, b) => a.timestamp - b.timestamp); // Ensure FIFO order

    for (let device of this.devices) {
      const availablePower = this.SAFETY_LIMIT - this.totalConsumption;
      device.consumption = Math.min(device.consumption, availablePower, this.DEVICE_MAX_CAPACITY);
      this.totalConsumption += device.consumption;
    }
  }

  logState() {
    console.log("Current Power Allocation:");
    for (let device of this.devices) {
      console.log(`Device ${device.id}: ${device.consumption} units`);
    }
    console.log(`Total Consumption: ${this.totalConsumption} units`);
    console.log(`Available Power: ${this.SAFETY_LIMIT - this.totalConsumption} units`);
    console.log("------------------------");
  }
}

// Example usage
const powerSystem = new PowerSupplySystem();

// Scenario
powerSystem.connect("A", 0);
powerSystem.connect("B", 1);
powerSystem.connect("C", 2);
powerSystem.changeConsumption("A", 20);
powerSystem.disconnect("B");

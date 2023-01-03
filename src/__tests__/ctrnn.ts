import { Ctrnn } from "../ctrnn";

const TIMESTEP: number = 0.05;

describe("default ctrnn", () => {
  const ctrnn = new Ctrnn();
  it("starts with zero-strength synaptic connections", () => {
    expect(ctrnn.size).toBe(2);
    let voltages = ctrnn.init_voltage();
    let outputs = ctrnn.getOutputs(voltages);
    expect(outputs.length).toBe(2);
    expect(outputs[0]).toBe(0.5);
    expect(outputs[1]).toBe(0.5);
  });

  it("throws error when passed in inputs of wrong size", () => {
    let v = ctrnn.init_voltage();
    const update = (i: number[]) => () => ctrnn.update(TIMESTEP, v, i);
    expect(update([])).toThrow(RangeError);
    expect(update([0])).toThrow(RangeError);
    expect(update([0, 0])).not.toThrow(RangeError);
    expect(update([0, 0, 0])).toThrow(RangeError);
  });

  it("approaches max activation with positive input", () => {
    let inputs = [10.0, 10.0];
    let voltages = ctrnn.init_voltage();
    for (let t = 0; t < 300; t += TIMESTEP) {
      voltages = ctrnn.update(TIMESTEP, voltages, inputs);
    }
    let outputs = ctrnn.getOutputs(voltages);
    expect(outputs[0]).toBeCloseTo(1);
    expect(outputs[1]).toBeCloseTo(1);
  });

  it("approaches min activation with negative input", () => {
    let inputs = [-10.0, -10.0];
    let voltages = ctrnn.init_voltage();
    for (let t = 0; t < 300; t += TIMESTEP) {
      voltages = ctrnn.update(TIMESTEP, voltages, inputs);
    }
    let outputs = ctrnn.getOutputs(voltages);
    expect(outputs[0]).toBeCloseTo(0);
    expect(outputs[1]).toBeCloseTo(0);
  });

  it("changes activation state when input's sign changes", () => {
    let inputs = [10.0, -10.0];
    let voltages = ctrnn.init_voltage();
    for (let t = 0; t < 300; t += TIMESTEP) {
      voltages = ctrnn.update(TIMESTEP, voltages, inputs);
    }
    let outputs = ctrnn.getOutputs(voltages);
    expect(outputs[0]).toBeCloseTo(1);
    expect(outputs[1]).toBeCloseTo(0);

    inputs = inputs.map((x) => -x);
    for (let t = 0; t < 300; t += TIMESTEP) {
      voltages = ctrnn.update(TIMESTEP, voltages, inputs);
    }
    outputs = ctrnn.getOutputs(voltages);
    expect(outputs[0]).toBeCloseTo(0);
    expect(outputs[1]).toBeCloseTo(1);
  });

  it("updates correctly when a new node is addded", () => {
    const ctrnn = new Ctrnn(2);
    expect(ctrnn.size).toBe(2);
    expect(ctrnn.biases.length).toBe(2);
    expect(ctrnn.timeConstants.length).toBe(2);
    expect(ctrnn.weights.length).toBe(2);
    expect(ctrnn.weights[0].length).toBe(2);
    ctrnn.addNode();
    expect(ctrnn.size).toBe(3);
    expect(ctrnn.biases.length).toBe(3);
    expect(ctrnn.timeConstants.length).toBe(3);
    expect(ctrnn.weights.length).toBe(3);
    expect(ctrnn.weights[0].length).toBe(3);
  });
});

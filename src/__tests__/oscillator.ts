import { Ctrnn } from "../ctrnn";

const TIMESTEP: number = 0.1;

describe("simple oscillator", () => {
  const size = 2;
  const ctrnn = new Ctrnn(size);
  ctrnn.setBias(0, -2.75);
  ctrnn.setBias(1, -1.75);
  ctrnn.setWeight(0, 0, 4.5);
  ctrnn.setWeight(0, 1, -1.0);
  ctrnn.setWeight(1, 0, 1.0);
  ctrnn.setWeight(1, 1, 4.5);

  let voltages = ctrnn.init_voltage();
  function simulate(duration: number, func?: (v: number[]) => void): number[] {
    for (let t = 0; t < duration; t += TIMESTEP) {
      voltages = ctrnn.update(TIMESTEP, voltages);
      func && func(voltages);
    }
    return ctrnn.getOutputs(voltages);
  }

  it("has the correct outputs after transient period", () => {
    expect(last[0]).toBeCloseTo(0.3191);
    expect(last[1]).toBeCloseTo(0.7869);
  });

  let fitness = 0;
  let last = simulate(250);
  simulate(50, voltages => {
    let sum = 0, outputs = ctrnn.getOutputs(voltages);
    for (let i = 0; i < size; i++) sum += Math.abs(outputs[i] - last[i]);
    fitness += sum / size;
    last = outputs;
  });

  it("has the correct fitness using Beer's metric", () => {
    expect(fitness).toBeCloseTo(2.1599);
  });
});

describe("extreme oscillator", () => {
  const size = 2;
  const ctrnn = new Ctrnn(size);
  ctrnn.setBias(0, 4.515263949538321);
  ctrnn.setBias(1, -9.424874214362415);
  ctrnn.setWeight(0, 0, 5.803844919954994);
  ctrnn.setWeight(0, 1, 16.0);
  ctrnn.setWeight(1, 0, -16.0);
  ctrnn.setWeight(1, 1, 3.5073044750632754);

  let voltages = ctrnn.init_voltage();
  function simulate(duration: number, func?: (v: number[]) => void): number[] {
    for (let t = 0; t < duration; t += TIMESTEP) {
      voltages = ctrnn.update(TIMESTEP, voltages);
      func && func(voltages);
    }
    return ctrnn.getOutputs(voltages);
  }

  let fitness = 0;
  let last = simulate(250);

  it("has the correct outputs after transient period", () => {
    expect(last[0]).toBeCloseTo(0.0382);
    expect(last[1]).toBeCloseTo(0.8068);
  });

  simulate(50, voltages => {
    let sum = 0, outputs = ctrnn.getOutputs(voltages);
    for (let i = 0; i < size; i++) sum += Math.abs(outputs[i] - last[i]);
    fitness += sum / size;
    last = outputs;
  });

  it("has the correct fitness using Beer's metric", () => {
    expect(fitness).toBeCloseTo(36.6511);
  });
});

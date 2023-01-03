import { Ctrnn } from "../ctrnn";
import { ICTRNN } from "../ictrnn";
import { RlCtrnn } from "../rlctrnn";

const dt = 0.05,
  duration = 300.0;

function oscillator<T extends ICTRNN>(ctrnn: T): T {
  ctrnn.setBias(0, -2.75);
  ctrnn.setBias(1, -1.75);
  ctrnn.setWeight(0, 0, 4.5);
  ctrnn.setWeight(1, 0, +1.0);
  ctrnn.setWeight(0, 1, -1.0);
  ctrnn.setWeight(1, 1, 4.5);
  return ctrnn;
}

describe("rlctrnn", () => {
  const ctrnn = oscillator(new Ctrnn(2));
  const rlctrnn = oscillator(new RlCtrnn(2));

  describe("compared with a normal ctrnn", () => {
    let voltages = ctrnn.init_voltage();
    let rlvoltages = rlctrnn.init_voltage();
    let time = 0;

    function update() {
      voltages = ctrnn.update(dt, voltages);
      rlvoltages = rlctrnn.update(dt, rlvoltages);
      time += dt;
    }

    update();
    it("matches outputs after 1 step", () => {
      const outputs = ctrnn.getOutputs(voltages);
      const rlOutputs = rlctrnn.getOutputs(rlvoltages);
      expect(rlOutputs).toEqual(outputs);
    });

    update();
    it("matches outputs after 2 steps", () => {
      const outputs = ctrnn.getOutputs(voltages);
      const rlOutputs = rlctrnn.getOutputs(rlvoltages);
      expect(rlOutputs).toEqual(outputs);
    });

    for (let i = 2; i < 20; i++) update();
    it("matches outputs after 20 steps", () => {
      const outputs = ctrnn.getOutputs(voltages);
      const rlOutputs = rlctrnn.getOutputs(rlvoltages);
      expect(rlOutputs).toEqual(outputs);
    });

    while (time < duration) update();
    it("matches outputs after 300 seconds", () => {
      const outputs = ctrnn.getOutputs(voltages);
      const rlOutputs = rlctrnn.getOutputs(rlvoltages);
      expect(rlOutputs).toEqual(outputs);
    });
  });

  it("updates correctly when a new node is addded", () => {
    const ctrnn = new RlCtrnn(2);
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

describe("oscillator", () => {
  const TIMESTEP = 0.1;
  const size = 2;
  const rlctrnn = oscillator(new RlCtrnn(2));

  let voltages = rlctrnn.init_voltage();
  function simulate(duration: number, func?: (v: number[]) => void): number[] {
    for (let t = 0; t < duration; t += TIMESTEP) {
      voltages = rlctrnn.update(TIMESTEP, voltages);
      func && func(voltages);
    }
    return rlctrnn.getOutputs(voltages);
  }

  let fitness = 0;
  let last = simulate(250);
  simulate(50, (voltages) => {
    let sum = 0,
      outputs = rlctrnn.getOutputs(voltages);
    for (let i = 0; i < size; i++) sum += Math.abs(outputs[i] - last[i]);
    fitness += sum / size;
    last = outputs;
  });

  it("matches fitness", () => {
    expect(fitness).toBeCloseTo(2.16);
  });
});

describe("three node network", () => {
  const rlctrnn = oscillator(new RlCtrnn(3));

  let voltages = rlctrnn.init_voltage();
  let outputs = rlctrnn.getOutputs(voltages);

  it("has correct initial outputs", () => {
    expect(outputs[0]).toBeCloseTo(0.06);
    expect(outputs[1]).toBeCloseTo(0.148);
    expect(outputs[2]).toBe(0.5);
  });

  describe("from a two node network", () => {
    const rlctrnn = oscillator(new RlCtrnn(2));
    rlctrnn.addNode();
    let voltages = rlctrnn.init_voltage();
    let outputs = rlctrnn.getOutputs(voltages);

    it("has correct initial outputs", () => {
      expect(outputs[0]).toBeCloseTo(0.06);
      expect(outputs[1]).toBeCloseTo(0.148);
      expect(outputs[2]).toBe(0.5);
    });

    describe("works as an oscillator", () => {
      const TIMESTEP = 0.1;

      let voltages = rlctrnn.init_voltage();
      function simulate(
        duration: number,
        func?: (v: number[]) => void
      ): number[] {
        for (let t = 0; t < duration; t += TIMESTEP) {
          voltages = rlctrnn.update(TIMESTEP, voltages);
          func && func(voltages);
        }
        return rlctrnn.getOutputs(voltages);
      }

      let fitness = 0;
      let last = simulate(250);
      simulate(50, (voltages) => {
        let sum = 0,
          outputs = rlctrnn.getOutputs(voltages);
        for (let i = 0; i < rlctrnn.size; i++)
          sum += Math.abs(outputs[i] - last[i]);
        fitness += sum / rlctrnn.size;
        last = outputs;
      });

      it("matches fitness", () => {
        expect((fitness / 2) * 3).toBeCloseTo(2.16);
      });
    });
  });
});

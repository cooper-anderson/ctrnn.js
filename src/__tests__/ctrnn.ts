import { Ctrnn } from "../ctrnn";

describe("ctrnn", () => {
  let ctrnn: Ctrnn = new Ctrnn(4);

  it("is created with default configuration", () => {
    let i = 0;
    expect(ctrnn.size).toBe(4);
    let frame = Ctrnn.newFrame(ctrnn.size);
    const outputs = ctrnn.getOutputs(frame);
    expect(outputs[i++]).toBe(0.5);
    expect(outputs[i++]).toBe(0.5);
    expect(outputs[i++]).toBe(0.5);
    expect(outputs[i++]).toBe(0.5);
  });

  it("allows its weights to be adjusted", () => {
    const dt = 1.0 / 60.0;
    const ctrnn = new Ctrnn(3);

    ctrnn.setWeight(0, 2, 1.9);
    ctrnn.setWeight(1, 2, 1.9);
    ctrnn.setWeight(2, 2, -0.5);

    let frame = Ctrnn.newFrame(ctrnn.size);
    for (let i = 0; i < 1000; i++) frame = ctrnn.tick(frame, [], dt);

    const output = ctrnn.getOutput(frame, 2);
    expect(output).toBeGreaterThan(0.85);
    expect(output).toBeLessThan(0.86);
  });

  it("can oscillate like a sine wave", () => {
    const dt = 1.0 / 100.0;
    const ctrnn = new Ctrnn(2);
    let frame = Ctrnn.newFrame(ctrnn.size);

    ctrnn.setNode(0, { bias: -2.75 });
    ctrnn.setNode(1, { bias: -1.75 });
    ctrnn.setWeight(0, 0, 4.5);
    ctrnn.setWeight(1, 0, 1.0);
    ctrnn.setWeight(0, 1, -1.0);
    ctrnn.setWeight(1, 1, 4.5);

    const mins = [1, 1], maxs = [0, 0];
    for (let i = 0; i < 2000; i++) {
      frame = ctrnn.tick(frame, [], dt);
      ctrnn.getOutputs(frame).forEach((output, index) => {
        if (output < mins[index]) mins[index] = output;
        if (output > maxs[index]) maxs[index] = output;
      });
    }

    expect(mins[0]).toBeLessThan(0.0605);
    expect(mins[1]).toBeLessThan(0.1489);
    expect(maxs[0]).toBeGreaterThan(0.8132);
    expect(maxs[1]).toBeGreaterThan(0.8218);
  });
});

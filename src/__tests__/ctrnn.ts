import { Ctrnn } from "../ctrnn";

describe("ctrnn", () => {
  let ctrnn: Ctrnn = new Ctrnn(4);

  it("is created with default configuration", () => {
    let i = 0;
    expect(ctrnn.outputs.length).toBe(4);
    const outputs = ctrnn.outputs;
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

    for (let i = 0; i < 1000; i++) ctrnn.tick([], dt);

    expect(ctrnn.outputs[2]).toBeGreaterThan(0.85);
    expect(ctrnn.outputs[2]).toBeLessThan(0.86);
  });

  it("can oscillate like a sine wave", () => {
    const dt = 1.0 / 100.0;
    const ctrnn = new Ctrnn(2);

    ctrnn.setNode(0, { bias: -2.75 });
    ctrnn.setNode(1, { bias: -1.75 });
    ctrnn.setWeight(0, 0, 4.5);
    ctrnn.setWeight(1, 0, 1.0);
    ctrnn.setWeight(0, 1, -1.0);
    ctrnn.setWeight(1, 1, 4.5);

    let out = "";
    for (let i = 0; i < 1000; i++) {
      ctrnn.tick([], dt);
      const outputs = ctrnn.outputs;
      out += outputs[0].toFixed(4) + ", " + outputs[1].toFixed(4) + "\n";
    }
    console.log(out);
  });
});

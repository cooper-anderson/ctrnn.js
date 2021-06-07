import { CTRNN } from "../ctrnn";

describe("ctrnn", () => {
  let ctrnn: CTRNN = new CTRNN(4);

  it("is created with default configuration", () => {
    let i = 0;
    expect(ctrnn.states.length).toBe(4);
    const activations = ctrnn.states;
    expect(activations[i++]).toBe(0.5);
    expect(activations[i++]).toBe(0.5);
    expect(activations[i++]).toBe(0.5);
    expect(activations[i++]).toBe(0.5);
  });

  it("allows its weights to be adjusted", () => {
    const dt = 1.0 / 60.0;
    const ctrnn = new CTRNN(3);

    ctrnn.setWeight(0, 2, 1.9);
    ctrnn.setWeight(1, 2, 1.9);
    ctrnn.setWeight(2, 2, -0.5);

    for (let i = 0; i < 1000; i++) ctrnn.tick([], dt);

    expect(ctrnn.states[2]).toBeGreaterThan(0.81);
    expect(ctrnn.states[2]).toBeLessThan(0.82);
  });
});

import { Ctrnn } from "../ctrnn";
import { ICTRNN } from "../ictrnn";
import { RlCtrnn } from "../rlctrnn";

const dt = 0.05, duration = 300.0;

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
});

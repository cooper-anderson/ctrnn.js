import { Fluctuator } from "../fluctuator";
import "../toContainOnly";

type Mystery = (t: number) => number;
const round = (value: number) => Math.round(value * 100) / 100;
const dt = 0.02,
  duration = 40;

function evaluate(flux: Fluctuator, mystery: Mystery) {
  let last = Math.abs(mystery(flux.value));
  for (let t = 0; t < duration; t += dt) {
    const distance = Math.abs(mystery(flux.value));
    flux.update(dt, last - distance);
    last = distance;
  }
}

function gen_fluxs(count = 10, min = 0, max = 4): Fluctuator[] {
  return Array.from(Array(count).keys(), (n) => {
    const percent = n / Math.max(count - 1, 1);
    const center = min + (max - min) * percent;
    return new Fluctuator(center, { min: 4, max: 4 });
  });
}

describe("basic fluctuator", () => {
  it("attains critical points at correct timestamps", () => {
    const flux = new Fluctuator(3, { min: 4, max: 4 });
    expect(flux.value).toBe(3);
    for (let t = 0; t < 1; t += dt) flux.update(dt);
    expect(flux.value).toBe(4);
    for (let t = 1; t < 2; t += dt) flux.update(dt);
    expect(flux.value).toBeCloseTo(3);
    for (let t = 2; t < 3; t += dt) flux.update(dt);
    expect(flux.value).toBe(2);
    for (let t = 3; t < 4; t += dt) flux.update(dt);
    expect(flux.value).toBe(3);
  });

  it("obtains a new period automatically", () => {
    const flux = new Fluctuator(),
      periods = [];
    let time = 0;
    for (let t = 0; t < duration; t += dt) {
      if (flux.time < time) periods.push(flux.period);
      time = flux.time;
      flux.update(dt);
    }

    expect(periods).not.toHaveLength(1);
  });
});

describe("solving `x - 2`", () => {
  const func = (t: number) => t - 2;

  describe("when converging from above", () => {
    const fluxs = gen_fluxs(10, 3, 12);
    for (const flux of fluxs) evaluate(flux, func);

    it("the amplitudes should all converge to 0", () => {
      const amplitudes = fluxs.map((f) => round(f.amplitude));
      expect(amplitudes).toContainOnly([0]);
    });

    it("the centers should all converge to 2", () => {
      const centers = fluxs.map((f) => round(f.center));
      expect(centers).toContainOnly([2]);
    });
  });

  describe("when converging from below", () => {
    const fluxs = gen_fluxs(10, -8, 1);
    for (const flux of fluxs) evaluate(flux, func);

    it("the amplitudes should all converge to 0", () => {
      const amplitudes = fluxs.map((f) => round(f.amplitude));
      expect(amplitudes).toContainOnly([0]);
    });

    it("the centers should all converge to 2", () => {
      const centers = fluxs.map((f) => round(f.center));
      expect(centers).toContainOnly([2]);
    });
  });

  describe("when starting at the intercept", () => {
    // Quick hack to gen 1 flux with same params
    const flux = gen_fluxs(3, 2, 2)[0];
    evaluate(flux, func);

    it("the amplitude should converge to 0", () => {
      expect(flux.amplitude).toBeCloseTo(0);
    });

    it("the center should converge to 2", () => {
      expect(flux.center).toBeCloseTo(2);
    });
  });
});

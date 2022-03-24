import { Fluctuator } from "../fluctuator";

describe("locked period", () => {
  const dt = 0.02;
  let flux = new Fluctuator(3, {min: 4, max: 4});

  it("starts at the initial value", () => {
    expect(flux.value).toBe(3);
  });

  it("reaches a maximum at a quarter of the period", () => {
    for (let t = 0; t < 1; t += dt) flux.update(dt);
    expect(flux.value).toBe(4);
  });

  it("returns to the base value at half the period", () => {
    for (let t = 1; t < 2; t += dt) flux.update(dt);
    expect(flux.value).toBe(3);
  });

  it("reaches a minimum at 3 quarters of the period", () => {
    for (let t = 2; t < 3; t += dt) flux.update(dt);
    expect(flux.value).toBe(2);
  });

  it("returns to the base value at the full period", () => {
    for (let t = 3; t < 4; t += dt) flux.update(dt);
    expect(flux.value).toBe(3);
  });
});

describe("simple linear system", () => {
  const dt = 0.02;
  let flux = new Fluctuator(3, {min: 4, max: 4});

  const A = 1, B = 2;
  const f = (t: number) => A * t + B;
});

describe("simple quadratic system", () => {
  const A = 1, B = 2, C = 3;
  const f = (t: number) => A * t * t + B * t + C;
});

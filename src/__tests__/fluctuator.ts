import { Fluctuator } from "../fluctuator";

describe("locked period", () => {
  const dt = 0.02;
  let flux = new Fluctuator(3, {min: 4, max: 4});

  it("starts at the initial value", () => {
    expect(flux.value).toBe(3);
  });

  it("reaches a maximum at a quarter of the period", () => {
    for (let t = 0; t < 1; t += dt) flux.update(dt);
    expect(flux.value).toBe(13);
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

import { sigmoid, inverseSigmoid } from "../activation";

describe("sigmoid", () => {
  it("is centered at 0.5", () => {
    expect(sigmoid(0)).toBe(0.5);
  });

  it("maxes out at +1.0", () => {
    expect(sigmoid(16)).toBeCloseTo(1.0);
  });

  it("bottoms out at -1.0", () => {
    expect(sigmoid(-16)).toBeCloseTo(0.0);
  });

  it("handles positive infinity", () => {
    expect(sigmoid(Infinity)).toBe(1.0);
  });

  it("handles negative infinity", () => {
    expect(sigmoid(-Infinity)).toBe(0.0);
  });
});

describe("inverseSigmoid", () => {
  it("matches 0.5, 0.25, 0.75", () => {
    expect(inverseSigmoid(0.5)).toBe(0.0);
    expect(inverseSigmoid(0.25)).toBeCloseTo(-1.1);
    expect(inverseSigmoid(0.75)).toBeCloseTo(1.1);
  });

  it("handles upper and lower bounds", () => {
    expect(inverseSigmoid(1.0)).toBe(Infinity);
    expect(inverseSigmoid(0.0)).toBe(-Infinity);
  });

  it("throws error if outside bounds", () => {
    expect(() => inverseSigmoid(1.1)).toThrow(RangeError);
    expect(() => inverseSigmoid(-0.1)).toThrow(RangeError);
  });
});

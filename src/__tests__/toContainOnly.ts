import "../toContainOnly";

describe("toContainOnly", () => {
  it("with exact match", () => {
    expect([1, 2]).toContainOnly([1, 2]);
  });

  it("with superfluous values", () => {
    expect([1, 2, 3, 4]).not.toContainOnly([1, 2]);
  });

  it("with missing values", () => {
    expect([1, 2]).toContainOnly([1, 2, 3, 4]);
  });
})

describe("toContainOnlyT", () => {
  it("with exact match", () => {
    expect([1, 2]).toContainOnlyT([1, 2]);
  });

  it("with superfluous values", () => {
    expect([1, 2, 3, 4]).not.toContainOnlyT([1, 2]);
  });

  it("with missing values", () => {
    expect([1, 2]).toContainOnlyT([1, 2, 3, 4]);
  });
})

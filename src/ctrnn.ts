import { sigmoid } from "./activation";
import { ICTRNN } from "./ictrnn";

export class Ctrnn implements ICTRNN {
  private _size: number;
  private _biases: number[];
  private _timeConstants: number[];
  private _weights: number[][];

  constructor(size: number = 2) {
    this._size = size;
    this._biases = Array(size).fill(0);
    this._timeConstants = Array(size).fill(1);
    this._weights = Array.from({length: size}, () => Array(size).fill(0));
  }

  /**
   * Get the number of nodes in the network
   */
  public get size(): number { return this._size; }

  /**
   * Set an individual node's bias
   */
  public setBias(index: number, bias: number) {
    if (index < 0 || index >= this._size) throw new RangeError();
    this._biases[index] = bias;
  }

  /**
   * Set an individual node's time constant
   */
  public setTimeConstant(index: number, timeConstant: number) {
    if (index < 0 || index >= this._size) throw new RangeError();
    this._timeConstants[index] = timeConstant;
  }

  /**
   * Set the the weight from one node to another
   */
  public setWeight(from: number, to: number, weight: number) {
    if (from < 0 || from >= this._size) throw new RangeError();
    if (to < 0 || to >= this._size) throw new RangeError();
    this._weights[to][from] = weight;
  }

  public update(dt: number, voltages: number[], inputs?: number[]): number[] {
    inputs = inputs !== undefined ? inputs : Array(this._size).fill(0);
    if (inputs.length !== this._size) throw new RangeError();
    const final = voltages.map((v, i) => v + this.getDelta(voltages, i) * dt)
    return final.map((v, i) => v + inputs![i]);
  }

  public getOutputs(voltages: number[]): number[] {
    return voltages.map((v, i) => sigmoid(v + this._biases[i]));
  }

  private getDelta(voltages: number[], index: number): number {
    const weights = this._weights[index];
    let sum = 0;
    for (let j = 0; j < this._size; j++) {
      const activation = sigmoid(voltages[j] + this._biases[j]);
      sum += weights[j] * activation;
    }
    return (sum - voltages[index]) / this._timeConstants[index];
  }

  public init_voltage(): number[] {
    return Array(this._size).fill(0);
  }

  public get biases(): ReadonlyArray<number> {
    return this._biases;
  }

  public get timeConstants(): ReadonlyArray<number> {
    return this._timeConstants;
  }

  public get weights(): ReadonlyArray<ReadonlyArray<number>> {
    return this._weights;
  }
}

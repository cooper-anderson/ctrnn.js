import { sigmoid } from "./activation";
import { ICTRNN } from "./ictrnn";
import { Fluctuator } from "./fluctuator";

export class RlCtrnn implements ICTRNN {
  private _size: number;
  private _biases: Fluctuator[];
  private _timeConstants: Fluctuator[];
  private _weights: Fluctuator[][];
  private _fluctuators: Fluctuator[];

  constructor(size: number) {
    this._size = size;
    const o = { length: size };
    this._biases = Array.from(o, () => new Fluctuator(0));
    this._timeConstants = Array.from(o, () => new Fluctuator(1));
    this._weights = Array.from(o, () => Array.from(o, () => new Fluctuator(0)));
    this._fluctuators = [];
    for (let i = 0; i < this._size; i++) {
      this._fluctuators.push(this._biases[i]);
      this._fluctuators.push(this._timeConstants[i]);
      for (let j = 0; j < this._size; j++) {
        this._fluctuators.push(this._weights[i][j]);
      }
    }
  }

  get size(): number {
    return this._size;
  }

  get biases(): readonly number[] {
    return this._biases.map(b => b.value);
  }

  get timeConstants(): readonly number[] {
    return this._timeConstants.map(tc => tc.value);
  }

  get weights(): readonly (readonly number[])[] {
    return this._weights.map(w => w.map(w => w.value));
  }

  setBias(index: number, bias: number): void {
    this._biases[index].value = bias;
  }

  setTimeConstant(index: number, timeConstant: number): void {
    this._timeConstants[index].value = timeConstant;
  }

  setWeight(from: number, to: number, weight: number): void {
    this._weights[to][from].value = weight;
  }

  update(dt: number, voltages: number[], inputs?: number[]): number[] {
    inputs = inputs !== undefined ? inputs : Array(this._size).fill(0);
    if (inputs.length !== this._size) throw new RangeError();
    this._fluctuators.forEach(f => f.update(dt));
    const final = voltages.map((v, i) => v + this.getDelta(voltages, i) * dt)
    return final.map((v, i) => v + inputs![i]);
  }

  getOutputs(voltages: number[]): number[] {
    return voltages.map((v, i) => sigmoid(v + this._biases[i].value));
  }

  init_voltage(): number[] {
    return Array(this._size).fill(0);
  }

  private getDelta(voltages: number[], index: number): number {
    const weights = this._weights[index];
    let sum = 0;
    for (let j = 0; j < this._size; j++) {
      const activation = sigmoid(voltages[j] + this._biases[j].value);
      sum += weights[j].value * activation;
    }
    return (sum - voltages[index]) / this._timeConstants[index].value;
  }
}

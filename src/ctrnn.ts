import { Node, NodeData } from "./node";
import { sigmoid } from "./sigmoid";

/**
 * Continuous-Time Recurrent Neural Network (`CTRNN`) implementation for JS.
 *
 * # Example
 *
 * ```typescript
 * import Ctrnn from "ctrnn.js";
 * let ctrnn = new Ctrnn();
 * ```
 */
export class Ctrnn {
  /**
   * Number of nodes in the network
   */
  private count: number;
  /**
   * Array of each node's parameters:
   * - `bias`: how stimulated a neuron must be before activating
   * - `time_constant`: the excitatory component of a neuron
   */
  private nodes: Node[];
  /**
   * Array of each node's ***input*** weights
   * e.g. `weights[i][j]` is the weight ***FROM*** node `j` ***TO*** node `i`
   */
  private weights: number[][];
  /**
   * Array of each node's activation
   */
  private states: number[];

  constructor(nodes: number = 4) {
    let opts = { length: nodes };
    this.count = nodes;
    this.nodes = Array.from(opts, () => ({bias: 0, timeConstant: 1.0}));
    this.weights = Array.from(opts, () => Array.from(opts, () => 0));
    this.states = Array.from(opts, () => 0.0);
  }

  public get outputs(): number[] {
    const outputs: number[] = [];
    for (let i = 0; i < this.count; i++) {
      outputs.push(sigmoid(this.states[i] + this.nodes[i].bias));
    }
    return outputs;
  }

  /**
   * Set the `bias` and `timeConstant` parameters of a given node
   */
  public setNode(index: number, node: NodeData) {
    this.nodes[index] = { ...this.nodes[index], ...node };
  }

  /**
   * Set the the given weight from one node to another
   */
  public setWeight(from: number, to: number, weight: number) {
    this.weights[to][from] = weight;
  }

//   public getOutput(frame: Frame, node: number): number {
//     return sigmoid(frame[node] + this.nodes[node].bias);
//   }

//   public getOutputs(frame: Frame): number[] {
//     if (frame.length != this.count) throw new Error();
//     return this.nodes.map((node, index) => sigmoid(frame[index] + node.bias));
//   }

  // TODO: Documentation
  public tick(inputs: number[], dt: number) {
    const states = [];
    for (let i = 0; i < this.count; i++) {
      states.push(inputs[i] || (this.states[i] + this.getDelta(i) * dt));
    }
    this.states = states;
  }

  // TODO: Documentation
  private getDelta(node: number): number {
    const weights = this.weights[node];
    let sum = 0;
    for (let j = 0; j < this.count; j++) {
      const activation = sigmoid(this.states[j] + this.nodes[j].bias);
      sum += weights[j] * activation;
    }

    return (sum - this.states[node]) / this.nodes[node].timeConstant;
  }
}

export type Frame = number[];

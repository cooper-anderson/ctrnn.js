import { Node, NodeData } from "./node";
import { inverseSigmoid, sigmoid } from "./sigmoid";

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

  constructor(nodes: number = 4) {
    let opts = { length: nodes };
    this.nodes = Array.from(opts, () => ({bias: 0, timeConstant: 1.0}));
    this.weights = Array.from(opts, () => Array.from(opts, () => 0));
  }

  /**
   * Get the number of nodes in the network
   */
  public get size(): number { return this.nodes.length; }

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

  /**
   * Get the output activation of a specific node
   */
  public getOutput(frame: Frame, node: number): number {
    return sigmoid(frame[node] + this.nodes[node].bias);
  }

  /**
   * Get the output activations of all nodes
   */
  public getOutputs(frame: Frame): number[] {
    if (frame.length != this.size) throw new Error();
    return this.nodes.map((node, index) => sigmoid(frame[index] + node.bias));
  }

  public frameFromOutput(output: number[]): Frame {
    if (output.length != this.size) throw new Error();
    return output.map((voltage, index) =>
      inverseSigmoid(voltage) - this.nodes[index].bias);
  }

  // TODO: Documentation
  public tick(frame: Frame, inputs: number[], dt: number) {
    const final = [];
    for (let i = 0; i < this.size; i++) {
      final.push(inputs[i] || (frame[i] + this.getDelta(frame, i) * dt));
    }
    return final;
  }

  // TODO: Documentation
  private getDelta(frame: Frame, node: number): number {
    const weights = this.weights[node];
    let sum = 0;
    for (let j = 0; j < this.size; j++) {
      const activation = sigmoid(frame[j] + this.nodes[j].bias);
      sum += weights[j] * activation;
    }

    return (sum - frame[node]) / this.nodes[node].timeConstant;
  }

  public static newFrame(size: number): Frame {
    return Array.from({length: size}, () => 0.0);
  }
}

export type Frame = number[];

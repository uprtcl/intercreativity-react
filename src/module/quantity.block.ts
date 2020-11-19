import { LitElement, html, css, property } from "lit-element";
import { Logger } from "@uprtcl/micro-orchestrator";
import { Quantity } from "./types";

export class QuantityBlock extends LitElement {
  logger = new Logger("QUANTITY-LENSE");

  @property()
  data: Quantity;

  render() {
    return html`<div>${JSON.stringify(this.data)}</div>`;
  }

  static get styles() {
    return css``;
  }
}

import { PatternsModule } from "@uprtcl/cortex";
import { MicroModule } from "@uprtcl/micro-orchestrator";
import { interfaces } from "inversify";
import { QuantityBlock } from "./quantity.block";
import { QuantityBehaviors, QuantityPattern } from "./quantity.pattern";

export class QuantityModule implements MicroModule {
  id: "quantity-module";

  dependencies: interfaces.ServiceIdentifier<any>[] = [];

  constructor() {}

  async onLoad(container: interfaces.Container) {
    customElements.define("quantity-block", QuantityBlock);
  }
  async onUnload() {}
  get submodules(): MicroModule[] {
    return [new PatternsModule([new QuantityPattern([QuantityBehaviors])])];
  }
}

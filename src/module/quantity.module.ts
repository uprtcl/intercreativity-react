import { PatternsModule } from '@uprtcl/cortex';
import { GraphQlSchemaModule } from '@uprtcl/graphql';
import { MicroModule } from '@uprtcl/micro-orchestrator';
import { interfaces } from 'inversify';
import { QuantityBlock } from './quantity.block';
import { QuantityBehaviors, QuantityPattern } from './quantity.pattern';
import { quantityTypeDefs } from './schema';

export class QuantityModule implements MicroModule {
  id: 'quantity-module';

  dependencies: interfaces.ServiceIdentifier<any>[] = [];

  constructor() {}

  async onLoad(container: interfaces.Container) {
    customElements.define('quantity-block', QuantityBlock);
  }
  async onUnload() {}
  get submodules(): MicroModule[] {
    return [
      new GraphQlSchemaModule(quantityTypeDefs, {}),
      new PatternsModule([new QuantityPattern([QuantityBehaviors])]),
    ];
  }
}

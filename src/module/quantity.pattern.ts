import { html } from 'lit-element';
import { injectable } from 'inversify';

import { Pattern, recognizeEntity, HasChildren, Entity } from '@uprtcl/cortex';
import { Merge, MergeStrategy, EveesWorkspace } from '@uprtcl/evees';
import { Lens, HasLenses } from '@uprtcl/lenses';
import { DocNodeLens, DocNodeEventsHandlers, DocNode } from '@uprtcl/documents';

import { Quantity } from './types';
import { QuantityBindings } from './bindings';

const properties = ['value'];

export class QuantityPattern extends Pattern<Entity<Quantity>> {
  recognize(entity: object): boolean {
    return (
      recognizeEntity(entity) &&
      properties.every((p) => entity.object.hasOwnProperty(p))
    );
  }

  type = QuantityBindings.QuantityType;
}

@injectable()
export class QuantityBehaviors
  implements
    HasLenses<Entity<Quantity>>,
    HasChildren<Entity<Quantity>>,
    Merge<Entity<Quantity>> {
  replaceChildrenLinks = (node: Entity<Quantity>) => (
    childrenHashes: string[]
  ): Entity<Quantity> => ({
    id: '',
    object: {
      ...node.object,
      description: childrenHashes[0],
    },
  });

  getChildrenLinks = (node: Entity<Quantity>): string[] => [
    node.object.description,
  ];

  links = async (node: Entity<Quantity>) => this.getChildrenLinks(node);

  lenses = (node: Entity<Quantity>): Lens[] => {
    return [
      {
        name: 'quantity:quantity',
        type: 'content',
        render: (entity: Entity<any>, context: any) => {
          return html` <quantity-block uref=${entity.id}></quantity-block> `;
        },
      },
    ];
  };

  /** lenses top is a lense that dont render the node children, leaving the job to an upper node tree controller */
  docNodeLenses = (): DocNodeLens[] => {
    return [
      {
        name: 'quantity:quantity',
        type: 'content',
        render: (node: DocNode, events: DocNodeEventsHandlers) => {
          // logger.log('lenses: documents:document - render()', { node });
          return html`
            <quantity-block
              uref=${node.uref}
              .data=${node.draft}
              ?editable=${node.editable}
              @content-changed=${(e) =>
                events.contentChanged(e.detail.content, false)}
            >
            </quantity-block>
          `;
        },
      },
    ];
  };

  merge = (originalNode: Entity<Quantity>) => async (
    modifications: Entity<Quantity>[],
    mergeStrategy: MergeStrategy,
    workspace: EveesWorkspace,
    config: any
  ): Promise<Quantity> => {
    const quantity = modifications[1].object;
    const description = await mergeStrategy.mergeLinks(
      [originalNode.object.description],
      modifications.map((data) => [data.object.description]),
      workspace,
      config
    );

    return {
      ...quantity,
      description: description[0],
    };
  };
}

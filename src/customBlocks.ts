import { CustomBlocks, DocNode, TextType } from '@uprtcl/documents';
import { EveesHelpers } from '@uprtcl/evees';
import { ApolloClient } from 'apollo-boost';

export const customBlocks: CustomBlocks = {
  TextNode: {
    default: {
      text: '',
      type: TextType.Paragraph,
      links: [],
    },
    canConvertTo: {
      Quantity: async (
        node: DocNode,
        client: ApolloClient<any>
      ): Promise<any> => {
        const data = !node.isPlaceholder ? await EveesHelpers.getPerspectiveData(client, node.uref) : undefined;
        return {
          value: data && data.object.value ? data.object.value : 0,
          description: node.uref,
        };
      },
    },
  },
  Quantity: {
    default: {
      value: 0,
    },
    canConvertTo: {
      TextNode: async (
        node: DocNode,
        client: ApolloClient<any>
      ): Promise<any> => {
        const data = !node.isPlaceholder ? await EveesHelpers.getPerspectiveData(client, node.uref) : undefined;
        /** quanity is part of the text node even if it's not used when rendering it */
        return {
          value: data ? data.object.value : 0,
          text: data ? data.object.description : '',
        };
      },
    },
  },
};

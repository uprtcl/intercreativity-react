import { CustomBlocks, TextType } from '@uprtcl/documents';
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
        uref: string,
        client: ApolloClient<any>
      ): Promise<any> => {
        const data = await EveesHelpers.getPerspectiveData(client, uref);
        return {
          quantity: data.object.quantity ? data.object.quantity : 0,
          description: uref,
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
        uref: string,
        client: ApolloClient<any>
      ): Promise<any> => {
        const data = await EveesHelpers.getPerspectiveData(client, uref);
        /** quanity is part of the text node even if it's not used when rendering it */
        return {
          quantity: data.object.quantity,
          text: data.object.description,
        };
      },
    },
  },
};

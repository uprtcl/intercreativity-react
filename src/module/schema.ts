import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const quantityTypeDefs: DocumentNode = gql`
  type Quantity implements Entity {
    id: ID!

    value: String!
    units: String
    description: Entity! @discover

    _context: EntityContext!
  }
`;

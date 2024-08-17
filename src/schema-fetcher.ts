import { createClient } from 'graphqurl';
import { gql } from 'graphql-request';
const { HASURA_END_POINT, HASURA_ADMIN_KEY } = process.env;

const GetSchema = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
      types {
        ...FullType
      }
      directives {
        name
        description
        args {
          ...InputValue
        }
        onOperation #Often needs to be deleted to run query
        onFragment #Often needs to be deleted to run query
        onField #Often needs to be deleted to run query
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type {
      ...TypeRef
    }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
        }
      }
    }
  }
`;

const client = createClient({
  endpoint: HASURA_END_POINT!,
  headers: {
    'X-Hasura-Admin-Secret': HASURA_ADMIN_KEY!,
  },
});
export const fetchSchema = async () => {
  const result = await client.query({query:GetSchema});
  console.log(result);
};

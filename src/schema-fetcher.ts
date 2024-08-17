import { createClient } from 'graphqurl';
import { getIntrospectionQuery } from 'graphql';
const { HASURA_END_POINT, HASURA_ADMIN_KEY } = process.env;

const client = createClient({
  endpoint: HASURA_END_POINT!,
  headers: {
    'X-Hasura-Admin-Secret': HASURA_ADMIN_KEY!,
  },
});
export const fetchSchema = async () => {
  const result = await client.query({query:getIntrospectionQuery()});
  console.log(result);
};

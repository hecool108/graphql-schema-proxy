import { createClient } from 'graphqurl';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';
import path from 'path';
import fs from 'fs';
const { HASURA_END_POINT, HASURA_ADMIN_KEY } = process.env;

const client = createClient({
  endpoint: HASURA_END_POINT!,
  headers: {
    'X-Hasura-Admin-Secret': HASURA_ADMIN_KEY!,
  },
});
export const fetchSchema = async () => {
  try {
    const result = await client.query({ query: getIntrospectionQuery() });
    // Convert the introspection result to a GraphQL schema
    const schema = buildClientSchema(result.data);

    // Convert the schema to SDL (Schema Definition Language)
    const sdl = printSchema(schema);

    // Define the path to save the schema file
    const filePath = path.join(__dirname, 'schema.graphql');

    // Save the schema to a file
    fs.writeFileSync(filePath, sdl, 'utf8');

    console.log(`Schema saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching and saving schema:', error);
  }
};

import { createClient } from 'graphqurl';
import {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
  GraphQLSchema,
} from 'graphql';
import path from 'path';
import fs from 'fs';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';
const { HASURA_END_POINT, HASURA_ADMIN_KEY } = process.env;

const client = createClient({
  endpoint: HASURA_END_POINT!,
  headers: {
    'X-Hasura-Admin-Secret': HASURA_ADMIN_KEY!,
  },
});
const filterDatabaseSchema = (
  schema: GraphQLSchema,
  databaseNames: string[]
): GraphQLSchema => {
  if(databaseNames.length === 0){
    return schema
  }
  return filterSchema({
    schema,
    typeFilter: (typeName) =>  {
      for (let index = 0; index < databaseNames.length; index++) {
        const selected = databaseNames[index];
        if(typeName.includes(selected)){
          return true
        }
      }
      return false
    },
    rootFieldFilter: (_operation, fieldName) =>{ 
      for (let index = 0; index < databaseNames.length; index++) {
        const selected = databaseNames[index];
        if(fieldName.includes(selected)){
          return true
        }
      }
      return false
    }
  });
};

export const fetchSchema = async (selectedDatabases: string[]) => {
  console.log('selectedDatabases', selectedDatabases);
  try {
    const result = await client.query({ query: getIntrospectionQuery() });
    // Convert the introspection result to a GraphQL schema
    const schema = buildClientSchema(result.data);
    // const filteredSchema = pruneSchema(
    //   filterDatabaseSchema(schema, selectedDatabases)
    // );
    
    
    // Convert the schema to SDL (Schema Definition Language)
    const sdl = printSchema(schema);
    console.log(sdl);
    // Define the path to save the schema file
    const filePath = path.join(__dirname, 'schema.graphql');

    // Save the schema to a file
    fs.writeFileSync(filePath, sdl, 'utf8');

    console.log(`Schema saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching and saving schema:', error);
  }
};

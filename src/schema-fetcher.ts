

import { exec } from 'child_process';
import { promisify } from 'util';
const {HASURA_END_POINT,HASURA_ADMIN_KEY} = process.env 
const execAsync = promisify(exec);
export const fetchSchema = async ()=>{
  await execAsync(`gq ${HASURA_END_POINT} -H 'X-Hasura-Admin-Secret: ${HASURA_ADMIN_KEY}' --introspect > src/schema.graphql`);
}
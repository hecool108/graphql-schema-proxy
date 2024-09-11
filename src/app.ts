import cors from '@elysiajs/cors';
import { fetchSchema } from './schema-fetcher';
import Elysia from 'elysia';
import { join } from 'path';
import bearer from '@elysiajs/bearer';
const main = async () => {
  await fetchSchema([]);
};

main().then(() => {
  console.log('Done');
});

const PORT = 3000;

// Define the path to the file you want to serve
const filePath = join(__dirname, 'schema.graphql');
console.log('filePath', filePath);

const handleBearer = ({ bearer, set }: any) => {
  if (!bearer || bearer !== process.env.AUTH_BEARER) {
    set.status = 400;
    set.headers[
      'WWW-Authenticate'
    ] = `Bearer realm='fb', error="invalid_request"`;
    return 'Unauthorized';
  }
};

new Elysia()
  .use(cors({ origin: '*' }))
  .use(bearer())
  .get('/graphql', Bun.file(filePath))
  .post(
    '/update',
    async ({body}) => {
      console.log('body', body);
      
      const dbs = (body as any).dbs || '';
      if (dbs === '') {
        await fetchSchema([]);
      }
      await fetchSchema(dbs.split(','));
      return 'Schema updated successfully!';
    },
    {
      beforeHandle: handleBearer,
    }
  )
  .listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);

import { fetchSchema } from './schema-fetcher';
import { serve } from 'bun';
import { readFileSync } from 'fs';
import { join } from 'path';

const main = async () => {
  await fetchSchema();
};

main().then(() => {
  console.log('Done');
});

const PORT = 3000;

// Define the path to the file you want to serve
const filePath = join(__dirname, 'schema.graphql');
console.log('filePath', filePath);

// Read the file content


// Set up the server
serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (req.method === 'GET' && pathname === '/graphql') {
      const fileContent = readFileSync(filePath, 'utf-8');
      return new Response(fileContent, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    if (req.method === 'POST' && pathname === '/update') {
      await fetchSchema();
      return new Response('Schema updated successfully!', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running at http://localhost:${PORT}`);

For the weird unreachble graphql-codegen execution, I created a tiny proxy to fetch schema from a micro service on railway.app as a proxy, let it get the schema for you:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ZTf2oC?referralCode=Gemoto)

### Two EnvVars to fill

1 HASURA_ADMIN_KEY : the hasura admin secret key.

2 HASURA_END_POINT : the hasura endpoint.

### Setup public network

![Setup public network](https://archive.writeitdown.site/setup-public-network.png)

After deployment, set the public network in the instance setting panel, set the port to 3000, because we serve it on 3000 with bun.

### Create a watcher

Now you have a endpoint url like :

https://something.up.railway.app/

I use @parcel/watcher to create a simple watcher, here are the must have packages:
```bash
bun add @graphql-codegen/cli @parcel/watcher
```
watcher.ts
```typescript
import { subscribe } from '@parcel/watcher';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

async function runCommands() {
  try {
    const updateResult = await fetch(
      'https://something.up.railway.app/update',
      { method: 'POST' }
    );
    const updateData = await updateResult.text();
    console.log(updateData);
    const result = await fetch('https://something.up.railway.app/graphql');
    const data = await result.text();
    const filePath = path.join(__dirname, 'schema.graphql');

    fs.writeFileSync(filePath, data, 'utf8');
    console.log('Schema reloaded');

    await execAsync('bun graphql-codegen --config codegen.ts');
    console.log('Code generated');
  } catch (error) {
    console.error('Error executing commands:', error);
  }
}

// Watch for changes in *.tsx files
subscribe('./src', async (err, events) => {
  if (err) {
    console.error('Error watching files:', err);
    return;
  }

  for (const event of events) {
    if (event.path.endsWith('.tsx')) {
      console.log(`Detected change in ${event.path}`);
      await runCommands();
    }
  }
})
  .then(() => {
    console.log('Watching for .tsx file changes...');
  })
  .catch((err) => {
    console.error('Error setting up watcher:', err);
  });
```

### Start the watcher

```bash
bun run watcher.ts
```
Modify any of your .tsx file and save:

```bash
Detected change in App.tsx
Schema updated successfully!
Schema reloaded
Code generated
```

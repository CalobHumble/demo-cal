import { edenTreaty } from "@elysiajs/eden";
import type { Server } from '../server/src/index';
// import { headers } from 'next/headers';

// export function getEden() {
//   const headerInstance = headers();
//   const authorization = headerInstance.get('authorization');
//   console.log(authorization);
// }
export const Eden = edenTreaty<Server>(`http://localhost:8080`, {
  $fetch: {
    headers: {

    }
  }
});
import { appendFileSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
    mkdirSync(path.dirname(logPath), { recursive: true });
    appendFileSync(logPath, JSON.stringify(body) + '\n');
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 500 });
  }
}

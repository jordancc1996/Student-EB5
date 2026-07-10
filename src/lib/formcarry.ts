export const FORMCARRY_ENDPOINT = 'https://formcarry.com/s/PGtefNg4eIv';

export async function submitToFormcarry(data: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(FORMCARRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch {
    return false;
  }
}

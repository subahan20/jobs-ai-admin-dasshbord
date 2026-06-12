import { mapAiSearchResponse } from './mapAiSearchJob';

const POLL_INTERVAL_MS = 5000;
const MAX_ATTEMPTS = 60;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function pollAiSearchStatus({ searchId, headers, aiSearchUrl, onProgress }) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    await sleep(POLL_INTERVAL_MS);

    const statusRes = await fetch(`${aiSearchUrl}/status/${searchId}`, { headers });
    const statusData = await statusRes.json();

    if (!statusRes.ok || !statusData?.success) {
      throw new Error(statusData?.message || statusData?.error || 'AI search status failed');
    }

    if (statusData.status === 'completed') {
      const mapped = mapAiSearchResponse(statusData);
      return {
        ...mapped,
        logs: statusData.logs || [],
      };
    }

    if (statusData.status === 'failed') {
      throw new Error(statusData.error || 'AI search failed on the server');
    }

    onProgress?.({
      logs: statusData.logs || [],
      progress: Math.min(95, 10 + (statusData.logs?.length || 0) * 10),
    });
  }

  throw new Error('AI search timed out. Please try again.');
}

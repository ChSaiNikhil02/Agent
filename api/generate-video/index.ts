import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEAPI_TOKEN = process.env.REPLICATE_API_TOKEN; // Using the same env var name for user convenience
const DEAPI_MODEL = 'Ltxv_13B_0_9_8_Distilled_FP8';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (!DEAPI_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set in environment variables.');
    }

    const { imageBase64, prompt } = req.body;

    // Step 1: Create the video generation job
    const createJobResponse = await fetch('https://api.deapi.ai/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEAPI_MODEL,
        prompt: prompt,
        image: imageBase64,
        // Assuming some default parameters based on common practice
        height: 576,
        width: 1024,
        num_frames: 25,
      }),
    });

    if (!createJobResponse.ok) {
        const errorBody = await createJobResponse.json();
        console.error('deAPI Job Creation Error:', errorBody);
        return res.status(500).json({ error: `deAPI Error: ${errorBody.detail || 'Failed to start job.'}` });
    }

    const job = await createJobResponse.json();
    const jobId = job.id;

    // Step 2: Poll for the job status
    let finalJobStatus;
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
      const pollResponse = await fetch(`https://api.deapi.ai/v2/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${DEAPI_TOKEN}`,
        },
      });

      const currentJobStatus = await pollResponse.json();

      if (currentJobStatus.status === 'succeeded' || currentJobStatus.status === 'failed') {
        finalJobStatus = currentJobStatus;
        break;
      }
    }

    if (finalJobStatus.status === 'failed') {
      return res.status(500).json({ error: `Video generation failed: ${finalJobStatus.error_message || 'Unknown error'}` });
    }
    
    // The API might store the result in an 'outputs' array
    const videoUrl = finalJobStatus.outputs?.[0]?.url || null;

    if (!videoUrl) {
      return res.status(500).json({ error: 'No video URL found in the final job status.' });
    }

    return res.status(200).json({ videoUrl });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

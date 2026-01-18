import type { VercelRequest, VercelResponse } from '@vercel/node';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_VERSION = '9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (!REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set in environment variables.');
    }

    const { imageBase64, prompt, duration, cameraFixed } = req.body;

    const predictionResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          prompt: prompt,
          image: imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
          num_frames: duration === 5 ? 24 : 48,
          motion_strength: cameraFixed ? 0.1 : 1.0, // Adjust motion strength based on cameraFixed
        },
      }),
    });

    if (!predictionResponse.ok) {
        const errorBody = await predictionResponse.json();
        console.error('Replicate API error:', errorBody);
        return res.status(500).json({ error: `Replicate API error: ${errorBody.detail || 'Failed to start prediction.'}` });
    }

    let prediction = await predictionResponse.json();

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const pollResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      prediction = await pollResponse.json();
    }

    if (prediction.status === 'failed') {
      return res.status(500).json({ error: `Video generation failed: ${prediction.error}` });
    }

    const videoUrl = prediction.output;

    return res.status(200).json({ videoUrl });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

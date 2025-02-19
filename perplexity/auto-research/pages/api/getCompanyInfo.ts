import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { companyName } = req.body;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer `,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          { role: "system", content: "次に与える日本の会社において業種がわかるような付与すべき特徴的なカテゴリーを4,5個教えてください。しかし、必ず以下のフォーマットを守ってください。" },
          { role: "user", content: companyName }
        ],
        max_tokens: 350,
        temperature: 0,
//        top_p: 0.9,
        top_p: 1,
        search_domain_filter: null,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
        response_format: null
      }),
    });

    const data = await response.json();
    res.status(200).json({ result: data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

# Readme.md

```bash
gcloud run deploy auto-research --source . --region asia-northeast1 --allow-unauthenticated
```

```bash
PPLX_API_KEY=~
curl --request POST \
  --url https://api.perplexity.ai/chat/completions \
  --header "Authorization: Bearer ${PPLX_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
  "model": "sonar",
  "messages": [
    {
      "role": "system",
      "content": "次に与える日本の会社において業種が分かるように簡潔に企業概要を教えてください"
    },
    {
      "role": "system",
      "content": "その会社に付与すべき特徴的なカテゴリーを4,5個教えてください。しかし、必ず以下のフォーマットを守ってください。"
    },
    {
      "role": "system",
      "content": "必ず以下のフォーマットを守ってください。「概要: 概要を記述, カテゴリー: 「Category1」, 「Category2」, ...(必ず括弧でくくってください。)」"
    },
    {
      "role": "user",
      "content": "ナウア株式会社"
    }
  ],
  "max_tokens": 200,
  "temperature": 0,
  "top_p": 0.9,
  "search_domain_filter": null,
  "return_images": false,
  "return_related_questions": false,
  "search_recency_filter": "month",
  "top_k": 0,
  "stream": false,
  "presence_penalty": 0,
  "frequency_penalty": 1,
  "response_format": null
}'
```

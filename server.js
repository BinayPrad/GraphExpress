const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Multilingual GraphQL Proxy is live!');
});

app.post('/graphql-proxy', async (req, res) => {
  const graphqlEndpoint = 'https://author-p151367-e1559221.adobeaemcloud.com/graphql/execute.json/your-project/By%20Title';
  const token = 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3NTIzOTIzNzk4NTlfMmI2ZDA4OWQtYjA4YS00MTgzLWJjMGUtZmExYjU3NjU5YWQ5X3ZhNmMyIiwidHlwZSI6ImFjY2Vzc190b2tlbiIsImNsaWVudF9pZCI6ImRldi1jb25zb2xlLXByb2QiLCJ1c2VyX2lkIjoiMEI5QzIxRkU2ODQwMjE1MjBBNDk1QzRFQGMyY2IyNzdkNjQ2NDgwNjc0OTVlNWEuZSIsInN0YXRlIjoibWdITGpXR2FDVGRYOEFBTVVHbThsb2s5IiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiI3Q0JDNDA3NzYwMkM2QjQzMEE0OTVGQjdAYWRvYmUuY29tIiwiY3RwIjowLCJmZyI6IlpUVE9XSlFZWFBQN01IV0tIT1FWMlhBQVZFIiwic2lkIjoiMTc1MjM5MjM1MTYxMV9jYTM0M2ZlMS05MmY2LTQ1YmMtOTM2MS1lMDBmNTgxYjAyZTlfdXcyIiwicnRpZCI6IjE3NTIzOTIzNzk4NjBfZmE2YzEwMzQtZjBlMS00OTkwLThlNmUtYjA2YzY5YTBlNzNhX3ZhNmMyIiwibW9pIjoiZTkzNDYxZTkiLCJwYmEiOiJNZWRTZWNOb0VWLExvd1NlYyIsInJ0ZWEiOiIxNzUzNjAxOTc5ODYwIiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwic2NvcGUiOiJBZG9iZUlELG9wZW5pZCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0LGFkZGl0aW9uYWxfaW5mby5yb2xlcyIsImNyZWF0ZWRfYXQiOiIxNzUyMzkyMzc5ODU5In0.QOTvwhntPDZvi-5L4-j_cQ69D3GxRuKN1tWnJ0l02ijVblBtikb1vTBlHScaJHYakX32v-cDAUHHSb2Ep5TA13nGd7CqapA2sqqtL-XhagWxyLOV1gS7ZyEjFX5zgihbCO2mKDy8eiAbfz0yQhHIN4MPY90xuct278YlUQuo9XrSTKf7ciQrzMZLIEP9x2OqD6S2GRNoIHOPeX4RwETbKtfIWg-7Y-P_1i2lcjJGw8eiwqUzeRdxVbK5UVaxgR68vAJSt17LqVKUHWy5WaUZ9w8aIXdpaa6jrAZFEvzcSV7yslmt30zEsphaboMvL3S5I40_1UlwnUJANvb1yFaG1g'; // Replace this securely

  try {
    const gqlResponse = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await gqlResponse.json();

    const rawItems = data?.data?.emiratesEmailTeaserList?.items || [];

    // Helper to extract language from _path
    const extractLanguage = (path) => {
      const match = path.match(/\/fragments\/(en|ar|fr|de)\//);
      return match ? match[1] : 'en';
    };

    // Helper to identify key prefix
    const detectTeaserKey = (path) => {
      if (path.includes('breeze-through-the-airport')) return 'breezeThrough';
      if (path.includes('order-before-you-fly')) return 'orderBefore';
      if (path.includes('take-more-with-you')) return 'takeMore';
      if (path.includes('fly-in-your-favourite-seat')) return 'favSeat';
      return null;
    };

    // Flatten for AJO Custom Action Response
    const flattenedResponse = {};
    rawItems.forEach(item => {
      const lang = extractLanguage(item._path);
      const keyPrefix = detectTeaserKey(item._path);

      if (keyPrefix && lang) {
        flattenedResponse[`${keyPrefix}Title_${lang}`] = item.title || '';
        flattenedResponse[`${keyPrefix}PreTitle_${lang}`] = item.preTitle || '';
        flattenedResponse[`${keyPrefix}Description_${lang}`] = item.description?.plaintext || '';
        flattenedResponse[`${keyPrefix}Path_${lang}`] = item._path || '';
      }
    });

    res.json(flattenedResponse);

  } catch (err) {
    console.error('GraphQL proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch or flatten GraphQL data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Multilingual proxy server running on port ${PORT}`);
});

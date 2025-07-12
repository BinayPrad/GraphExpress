const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Install this with `npm install node-fetch`
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/graphql-proxy', async (req, res) => {
  const graphqlEndpoint = 'https://author-p97303-e890303.adobeaemcloud.com/graphql/execute.json/your-project/emailByPath';
  const token = 'Bearer YOUR_STATIC_JWT_TOKEN_HERE'; // Replace with your actual token

  try {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data); // Respond back to AJO with the GraphQL result
  } catch (error) {
    console.error('GraphQL error:', error);
    res.status(500).json({ error: 'Failed to fetch GraphQL' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

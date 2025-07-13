const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('AJO GraphQL Proxy is live!');
});

app.post('/graphql-proxy', async (req, res) => {
  const graphqlEndpoint = 'https://author-p97303-e890303.adobeaemcloud.com/graphql/execute.json/your-project/emailByPath';
  const token = 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3NTIzODY1NzUyOTFfZmQxMzcwYTktZDgzMC00NmM2LWEwZmItYzYyN2I2NDdlNTViX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJkZXYtY29uc29sZS1wcm9kIiwidXNlcl9pZCI6IjkzMzIxRjVENjMxQ0E5RDUwQTQ5NUU1RkA4MWY4MWY3NzYzMWMwNDgyNDk1YzUwLmUiLCJzdGF0ZSI6IkMxRUxCSzFQQTRBRG14d3BSNld4a3p5ZyIsImFzIjoiaW1zLW5hMSIsImFhX2lkIjoiMkQwQzE3M0U2MEMwQzI5QTBBNDk1QzBBQEFkb2JlSUQiLCJjdHAiOjAsImZnIjoiWlRUSVRRWTZYUFA3TUhXS0hPUVYyWEFBVkUiLCJzaWQiOiIxNzUyMDg2ODUxMTEyXzdmYThmZjdjLTFlYTctNDMxMC04NTRmLTA1MjVjMTk1MzE3M191dzIiLCJydGlkIjoiMTc1MjM4NjU3NTI5MV8zZWRjMTMyZS0wMTIxLTQzODgtOWI1Mi04Y2EyMTIwMzdlMmNfdWUxIiwibW9pIjoiYTcxMGRkODkiLCJwYmEiOiJNZWRTZWNOb0VWLExvd1NlYyIsInJ0ZWEiOiIxNzUzNTk2MTc1MjkxIiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwiY3JlYXRlZF9hdCI6IjE3NTIzODY1NzUyOTEiLCJzY29wZSI6IkFkb2JlSUQsb3BlbmlkLHJlYWRfb3JnYW5pemF0aW9ucyxhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQsYWRkaXRpb25hbF9pbmZvLnJvbGVzIn0.BDF4xPe1upW7CHDd-OsMk4NAdVTUzkQd6PdpeDO6u58WsqRq_D5fyzgZYfGITqX7JMZC-WslojmgpxECcBbBFljbeAAAtBYYvjufLk9hzWN1CO5M_Mc01ySsFHSKNcVdfmm0c-Yd-m2bFTTTU8tOXBE-UtPW-E2d90LKKY95qzsx6L406LHZXOxqKQQuXQicPB6JuaYaJM0XjX_w8dSPgYgpygYnAKbPsKHbf6NM6WpZMNNZ9aTKWdMsfW8ispUTqMKcy24mlpkZh2sZEFUu-0546PRPN6qTCBx85PkTaBdZrWwdz3P1p2oJgnFAu0Fg-Nv9OZ4AnnMzILECAEbQZg'; // Replace this

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
       // ✅ Flatten the GraphQL response for AJO
    const gqlData = data?.data?.emailModelByPath?.item || {};

    const finalResponse = {
      footerTextHtml: gqlData.footerText?.html || '',
      bodyTextHtml: gqlData.bodyText?.html || '',
      bodyImageUrl: gqlData.bodyImage?._path || '',
      bodyImage2Url: gqlData.bodyImage2?._path || '',
      footerImageUrl: gqlData.footerImage?._path || '',
      headerLogoUrl: gqlData.headerLogo?._path || '' // Optional
    };

    console.log('Flattened AJO Response:', finalResponse);
    res.json(finalResponse);
  } catch (err) {
    console.error('GraphQL error:', err);
    res.status(500).json({ error: 'Failed to fetch GraphQL' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

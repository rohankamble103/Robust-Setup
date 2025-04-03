const express = require('express');
const axios = require('axios');
const os = require('os');
const app = express();
const port = 3000;

// Serve static files (index.html and assets) from the 'public' folder
app.use(express.static('public'));

// API endpoint to fetch the EC2 instance's public IP and hostname
app.get('/api/instance-info', async (req, res) => {
    try {
        // Fetching the metadata token for IMDSv2
        const tokenResponse = await axios.put('http://169.254.169.254/latest/api/token', null, {
            headers: { 'X-aws-ec2-metadata-token-ttl-seconds': '21600' }
        });
        const token = tokenResponse.data;

        // Fetching the public IP using the metadata token
        const ipResponse = await axios.get('http://169.254.169.254/latest/meta-data/public-ipv4', {
            headers: { 'X-aws-ec2-metadata-token': token }
        });

        // Fetching the hostname of the EC2 instance
        const hostname = os.hostname();

        // Sending the IP and hostname back to the client
        res.json({ publicIp: ipResponse.data, hostname });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching instance information. Ensure IMDSv2 is enabled.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

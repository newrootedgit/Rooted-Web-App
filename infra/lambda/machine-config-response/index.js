const https = require('https'); 

const API_ENDPOINT = process.env.API_ENDPOINT; 
const SECRET_TOKEN = process.env.SECRET_TOKEN;

exports.handler = async (event) => {
    console.log('Received config response: ', JSON.stringify(event, null, 2));

    try {
        const { requestId, action, config, success, error } = event;
    
        if (!requestId || !action) { 
            console.error('Missing required fields in config response: ', { requestId, action });
            return { statusCode: 400, body: 'Missing required fields' };
        }

        const payload = { requestId, action, config, success, error };

        await callAPI(payload);
        console.log('Config response processed successfully');
        return { statusCode: 200, body: 'Success' };
    } catch (error) {
        console.error('Error processing config response: ', error);
        return { statusCode: 500, body: 'Internal server error' };
    }
};

function callAPI(payload) { 
    return new Promise((resolve, reject) => { 
        const url = new URL('/internal/machines/config-response', API_ENDPOINT);
        
        const options = { 
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET_TOKEN}`,
            },
        };

        const req = https.request(options, (res) => { 
            let data = '';
            res.on('data', (chunk) => { 
                data += chunk;
            });
            res.on('end', () => { 
                if (res.statusCode >= 200 && res.statusCode < 300) { 
                    resolve(data);
                } else { 
                    reject(new Error(`API call failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => { 
            reject(error);
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
}
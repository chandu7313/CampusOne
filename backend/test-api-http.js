import http from 'http';

const loginReq = http.request('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}, (res) => {
    let rawData = '';
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => {
        const data = JSON.parse(rawData);
        const token = data.accessToken;

        if (!token) {
            console.log('Login failed', data);
            return;
        }

        const hReq = http.request('http://localhost:4000/api/v1/academic/hierarchy', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        }, (res2) => {
            let rawData2 = '';
            res2.on('data', chunk => rawData2 += chunk);
            res2.on('end', () => {
                const data2 = JSON.parse(rawData2);
                console.log('Hierarchy payload length:', data2.data ? data2.data.length : 'none');
                if (!data2.data || data2.data.length === 0) {
                    console.dir(data2, { depth: null });
                }
            });
        });
        hReq.on('error', console.error);
        hReq.end();
    });
});

loginReq.on('error', console.error);
loginReq.write(JSON.stringify({ email: 'admin@campusone.edu', password: 'password123' }));
loginReq.end();

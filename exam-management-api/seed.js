const http = require('http');

const items = [
    { url: '/students', method: 'POST', body: { name: 'Ahmed Ali', email: 'ahmed@email.com' } },
    { url: '/students', method: 'POST', body: { name: 'Sara Khan', email: 'sara@email.com' } },
    { url: '/students', method: 'POST', body: { name: 'Bilal Hasan', email: 'bilal@email.com' } },
    { url: '/exams', method: 'POST', body: { title: 'Final Year Math', totalMarks: 100 } },
    { url: '/exams', method: 'POST', body: { title: 'Physics Midterm', totalMarks: 50 } },
    { url: '/results', method: 'POST', body: { studentName: 'Ahmed Ali', examName: 'Final Year Math', obtainedMarks: 85 } },
    { url: '/results', method: 'POST', body: { studentName: 'Sara Khan', examName: 'Physics Midterm', obtainedMarks: 45 } }
];

const reqLoop = (index) => {
    if (index >= items.length) return;
    const item = items[index];

    const data = JSON.stringify(item.body);
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: item.url,
        method: item.method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, res => {
        res.on('data', d => {
            process.stdout.write(d);
        });
        res.on('end', () => {
            console.log('\n');
            reqLoop(index + 1);
        });
    });

    req.write(data);
    req.end();
};

reqLoop(0);

import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running successfully!' });
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  res.status(201).json({ status: 'success', user: { id: 1, name } });
});

export default app;

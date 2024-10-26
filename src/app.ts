import express from 'express';
import { propertyRoutes } from './routes';

const app = express();

// Properties route
app.use('/properties', propertyRoutes);

// Index route
app.use('/', (req, res) => {
  res.send('Visit "/properties" to load properties')
});

export default app;

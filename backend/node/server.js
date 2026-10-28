import app from './app.js';
import { connectDB } from './src/config/db.js';
import { PORT } from './src/config/env.js';

connectDB();

app.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});

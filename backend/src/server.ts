import 'dotenv/config';
import app from './app.js';
import { initSyncScheduler } from './features/sync/scheduler.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initSyncScheduler();
});


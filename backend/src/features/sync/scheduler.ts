import cron from 'node-cron';
import { syncService } from './sync.routes.js';

export function initSyncScheduler(): void {
  const cronSchedule = process.env.SYNC_CRON_SCHEDULE || '0 * * * *';

  console.log(`Initializing OJS Sync Cron Scheduler with expression: "${cronSchedule}"`);

  cron.schedule(cronSchedule, () => {
    console.log('Automated OJS Sync trigger fired by cron scheduler.');
    
    const jobId = syncService.triggerSync();
    console.log(`Automated OJS Sync Job started with ID: ${jobId}`);
  });
}

import { inngest, processInvoiceJob, weeklyReportJob } from '@/lib/jobs/inngest';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processInvoiceJob,
    weeklyReportJob,
  ],
});

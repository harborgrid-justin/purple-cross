import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import {
  emailQueue,
  reportsQueue,
  remindersQueue,
  notificationsQueue,
} from './queue';

// Create the Bull Board UI adapter for Express
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Create the Bull Board with all queues
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(reportsQueue),
    new BullMQAdapter(remindersQueue),
    new BullMQAdapter(notificationsQueue),
  ],
  serverAdapter,
});

export { serverAdapter, addQueue, removeQueue, setQueues, replaceQueues };

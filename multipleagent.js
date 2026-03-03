import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import { z } from 'zod';
import fs from 'node:fs/promises';

const fetchAvailablePlans = tool({
  name: 'fetch_available_plans',
  description: 'Fetches the available Netflix subscription plans',
  parameters: z.object({}),
  execute: async function () {
    return [
      { plan_id: 'basic', price_inr: 199, quality: 'SD', screens: 1 },
      { plan_id: 'standard', price_inr: 499, quality: 'HD', screens: 2 },
      { plan_id: 'premium', price_inr: 649, quality: '4K', screens: 4 },
    ];
  },
});

const processRefund = tool({
  name: 'process_refund',
  description: 'Processes a refund for a Netflix subscription',
  parameters: z.object({
    customerId: z.string().describe('ID of the customer'),
    reason: z.string().describe('Reason for refund'),
  }),
  execute: async function ({ customerId, reason }) {
    await fs.appendFile(
      './refunds.txt',
      `Refund issued for Customer ID ${customerId} | Reason: ${reason}\n`,
      'utf-8'
    );
    return { refundIssued: true };
  },
});

const refundAgent = new Agent({
  name: 'Refund Agent',
  instructions: `You are an expert in handling Netflix subscription refunds.`,
  tools: [processRefund],
});

const subscriptionAgent = new Agent({
  name: 'Netflix Subscription Agent',
  instructions: `
    You are a helpful subscription agent for a Netflix-like streaming service.
    Help users choose plans or handle refund requests.
  `,
  tools: [
    fetchAvailablePlans,
    refundAgent.asTool({
      toolName: 'refund_expert',
      toolDescription: 'Handles Netflix refund requests.',
    }),
  ],
});

async function runAgent(query = '') {
  const result = await run(subscriptionAgent, query);
  console.log(result.finalOutput);
}

runAgent(
  `I want a refund for my premium plan. My customer ID is cus1234 because I no longer need the subscription.`
);
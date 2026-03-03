import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';
import { z } from 'zod';
import fs from 'node:fs/promises';

/* =========================
   REFUND AGENT
========================= */

const processRefund = tool({
  name: 'process_refund',
  description: `Processes a refund for a Netflix subscription`,
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
  instructions: `You are an expert in handling Netflix subscription refunds for existing users.`,
  tools: [processRefund],
});

/* =========================
   SUBSCRIPTION AGENT
========================= */

const fetchAvailablePlans = tool({
  name: 'fetch_available_plans',
  description: 'Fetches available Netflix subscription plans',
  parameters: z.object({}),
  execute: async function () {
    return [
      { plan_id: 'basic', price_inr: 199, quality: 'SD', screens: 1 },
      { plan_id: 'standard', price_inr: 499, quality: 'HD', screens: 2 },
      { plan_id: 'premium', price_inr: 649, quality: '4K', screens: 4 },
    ];
  },
});

const subscriptionAgent = new Agent({
  name: 'Subscription Agent',
  instructions: `
      You are an expert subscription advisor for a Netflix-like streaming service.
      Help new users understand plans, pricing, and features.
  `,
  tools: [fetchAvailablePlans],
});

/* =========================
   RECEPTION AGENT (ROUTER)
========================= */

const receptionAgent = new Agent({
  name: 'Reception Agent',
  instructions: `
  ${RECOMMENDED_PROMPT_PREFIX}
  You are the customer-facing assistant.
  Understand the user’s request and route them to the correct specialist agent.
  `,
  handoffDescription: `
    You have two agents available:
    - subscriptionAgent: Handles new subscription queries and plan comparisons.
    - refundAgent: Handles refund requests and issues for existing customers.
  `,
  handoffs: [subscriptionAgent, refundAgent],
});

/* =========================
   RUN
========================= */

async function main(query = '') {
  const result = await run(receptionAgent, query);
  console.log('Final Output:\n', result.finalOutput);
  console.log('\nConversation History:\n', result.history);
}

main(
  `Hi, my customer ID is cust_234. I want a refund for my premium subscription because I no longer use the service.`
);
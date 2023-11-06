import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'
import { Twilio } from "twilio";
import { Lotus } from 'lotus-typescript';
import { DateTime } from 'luxon';

const lotusDateformat = '';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM;

const twilio = new Twilio(accountSid, authToken);

const apiKey = process.env.LOTUS_API_KEY;

export const lotus = new Lotus(apiKey || '', {
  host: 'http://localhost'
});

const app = new Elysia()
  .use(cors())
  .post('/sendsms', async ({ body }) => {
    const resp = await twilio.messages.create({
      body: 'This is a text message from Calob.',
      to: body.phoneNumber,
      from: fromNumber,
    });
    if (resp.errorMessage) {
      return {
        error: resp.errorMessage
      }
    } else {
      return {
        success: fromNumber
      }
    }
  }, {
    body: t.Object({
      phoneNumber: t.String()
    })
  })
  .get('/plans', async ({ headers }) => {
    const plans = (await lotus.listPlans()).data;
    return plans;
  })
  .post('/upgrade', async ({ body }) => {
    const existingPlans = (await lotus.listSubscriptions({
      customer_id: body.customerId
    })).data;
    console.log(existingPlans);
    for (const sub of existingPlans) {
      await lotus.cancelSubscription({
        subscription_id: sub.subscription_id,
      });
    }
    console.log('old plans canceled');
    return (await lotus.createSubscription({
      customer_id: body.customerId,
      plan_id: body.planId,
      start_date: DateTime.now().toFormat(lotusDateformat)
    })).data
  }, {
    body: t.Object({
      customerId: t.String(),
      planId: t.String(),
    })
  })
  .post('/createUser', async ({ body }) => {
    const customer = (await lotus.createCustomer({
      customer_id: body.id,
      email: body.email,
      customer_name: body.name,
    })).data;
    await lotus.createSubscription({
      customer_id: customer.customer_id,
      plan_id: process.env.LOTUS_STARTER_PLAN_ID || 'plan_0559cff81e884d4c9b1a77195e3b615a',
      start_date: DateTime.now().toFormat(lotusDateformat),
    })
  }, {
    body: t.Object({
      id: t.String(),
      email: t.String(),
      name: t.String()
    })
  })
  .post('/me', async ({ body }) => {
    return (await lotus.getCustomer({
      customer_id: body.id
    })).data;
  }, {
    body: t.Object({
      id: t.String(),
    }),
  })
  .listen(8080);

export type Server = typeof app;
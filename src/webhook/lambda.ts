// Allow CloudWatch to read source maps
import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { EventBridgeRepository } from '../common/event-bridge-repository'
import { sendWebhookEvent } from './lib/main'

export async function handler(event: APIGatewayProxyEvent) {
  console.log('event: ', JSON.stringify(event))

  // FIXME aws-lambda is for 1.0 ver of APIGatewayProxyEvent
  // TODO add tests
  // @ts-ignore
  const path: string | null = event.rawPath?.split('/')?.[1] || null

  const eventBusName = process.env.EVENT_BUS_NAME
  const eventSource = path ?? process.env.EVENT_SOURCE

  if (!eventBusName) {
    throw new Error('Webhook URL is required as "process.env.EVENT_BUS_NAME"')
  }

  if (!eventSource) {
    throw new Error('Event source is required as "process.env.EVENT_SOURCE"')
  }

  const notification = new EventBridgeRepository(eventBusName, eventSource)
  await sendWebhookEvent(event, notification)

  return {
    statusCode: 200,
    body: null,
  }
}

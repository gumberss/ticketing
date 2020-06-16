import { Listener, OrderCreatedEvent, Subjects } from '@gtickets/nats-common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	queueGroupName: string = queueGroupName

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id)

		if (!ticket) {
			throw new Error('Ticket not found')
		}

		ticket.set({ orderId: data.id })

		await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId,
			price: ticket.price,
			title: ticket.title
    })

		msg.ack()
	}
}

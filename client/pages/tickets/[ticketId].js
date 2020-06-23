import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const TicketShow = ({ ticket }) => {
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
    onSuccess: order => Router.push('/orders/[orderId]', `/orders/${order.id}`)
	})

	const onPurchase = () => {
		doRequest({
			ticketId: ticket.id,
		})
	}

	return (
		<div>
			<h1>{ticket.title}</h1>
			<h4>Price: {ticket.price}</h4>
			<button onClick={onPurchase} className="btn btn-primary">
				Purchase
			</button>
			{errors}
		</div>
	)
}
TicketShow.getInitialProps = async (context, client) => {
	const { ticketId } = context.query

	const { data } = await client.get(`/api/tickets/${ticketId}`)

	return { ticket: data }
}

export default TicketShow

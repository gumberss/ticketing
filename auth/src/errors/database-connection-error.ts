export class DatabaseConnectionError extends Error {
	statusCode = 500
	reason = 'Error connection to database'
	constructor() {
		super()

		// Only because we are extending a built in class
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
	}

	serializeError() {
		return [
			{
				message: this.reason,
			}
		]
	}
}

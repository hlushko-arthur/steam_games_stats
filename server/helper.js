export function helper(req, res, next) {
	res.sendResponse = (statusCode, data) => {
		res.status(statusCode).json({
			status: true,
			data: data
		});
	};

	res.sendError = (statusCode, message) => {
		res.status(statusCode).json({
			status: false,
			message: message
		});
	};

	next();
}
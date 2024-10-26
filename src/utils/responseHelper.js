class ResponseHelper {
    static success(statusCode, message, data = null) {
        return {
            statusCode,
            success: true,
            message,
            data
        };
    }

    static error(statusCode, message, error = null) {
        return {
            statusCode,
            success: false,
            message,
            error: error?.message || error
        };
    }

    static notFound(message = 'Resource not found') {
        return this.error(404, message);
    }

    static badRequest(message = 'Bad request', error = null) {
        return this.error(400, message, error);
    }

    static unauthorized(message = 'Unauthorized access') {
        return this.error(401, message);
    }

    static forbidden(message = 'Forbidden access') {
        return this.error(403, message);
    }

    static serverError(message = 'Internal server error', error = null) {
        return this.error(500, message, error);
    }
}

module.exports = ResponseHelper;
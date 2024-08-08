class ApiResponse {
    constructor(status, message = null, data = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiResponse;
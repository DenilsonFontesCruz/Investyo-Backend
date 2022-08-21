class BasicError { 
    constructor(message, status, location){
        this.message = message;
        this.status = status;
        this.location = location;
    }
    sendResponse(res){
        res.status(this.status).send(this.message);
        console.error(`The error ocurred in ${this.location}`);
    }
}

module.exports = BasicError;
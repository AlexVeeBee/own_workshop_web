// custom express error handler

class FetchNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FetchNotFoundError";
    }
}
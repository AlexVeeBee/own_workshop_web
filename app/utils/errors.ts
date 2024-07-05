// custom express error handler

export class FetchNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FetchNotFoundError";
    }
}

export class FetchNotOkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FetchNotOkError";
    }
}

export class FetchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FetchError";
    }
}

export type ErrorOrVoid = Error | void;

export class Either<T = unknown>{
    private isError: boolean;
    private value: ErrorOrVoid | T;

    constructor(errorOrResponse: ErrorOrVoid | T){
        if(errorOrResponse instanceof(Error)){
            this.isError = true;
        } else {
            this.isError = false;
        }

        this.value = errorOrResponse;
    }

    static right<T = unknown>(response: T){
        return new Either<T>(response);
    }

    static left<E extends ErrorOrVoid>(error: E){
        return new Either<E>(error);
    }

    isLeft(){
        return this.isError;
    }

    isRight(){
        return !this.isRight();
    }
}
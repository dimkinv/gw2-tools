export type ErrorOrVoid = Error | void;
export type ValidResponses<T = unknown> = T | ErrorOrVoid;

// export class Either<T = unknown | ErrorOrVoid>{
//     private isError: boolean;
//     private value: T;

//     constructor(errorOrResponse: T){
//         if(errorOrResponse instanceof(Error)){
//             this.isError = true;
//         } else {
//             this.isError = false;
//         }

//         this.value = errorOrResponse;
//     }

//     static right<T = unknown>(response: T){
//         return new Either<T>(response);
//     }

//     static left<E extends ErrorOrVoid>(error: E){
//         return new Either<E>(error);
//     }

//     isLeft(){
//         return this.isError;
//     }

//     isRight(){
//         return !this.isRight();
//     }

//     getValue() {
//        return this.value;
//     }
// }
export interface Response<T>{
    isError: false;
    response: T;
}

export interface ResponseError<T>{
    isError: true;
    error: T
}

export type ErrorOrResponse<T = unknown> = Response<T> | ResponseError<Error>;

export function createErrorOrResponse<T = unknown>(errorOrResponse: T | Error): ErrorOrResponse<T>{
    if(errorOrResponse instanceof Error){
        return {
            isError: true,
            error: errorOrResponse
        }
    }

    return {
        isError: false,
        response: errorOrResponse
    }
}
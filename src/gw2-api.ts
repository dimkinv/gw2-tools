import axios, { AxiosError } from "axios";
import { Either } from "./either";

export async function getResourceByEndpoint<T>(apiEndpoint: string): Promise<Either<T>> {
    getIdsForEndpoint
}

async function getIdsForEndpoint(endpoint: string): Promise<Either<number[]>> {
    try {
        const response = await axios.get<number[]>(endpoint);
        return Either.right(response.data);
    } catch (error) {
        const e = error as AxiosError;
        return Either.left(new Error());
    }
}
export type CustomFetchOptions = RequestInit & { responseType?: "json" | "text" | "blob" | "auto" };
export type ErrorType<T = unknown> = Error;
export type BodyType<T> = T;
export declare function customFetch<T = unknown>(input: RequestInfo | URL, options?: CustomFetchOptions): Promise<T>;

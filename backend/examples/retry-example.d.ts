/**
 * Retry Pattern Usage Examples
 * Demonstrates how to use retry logic with exponential backoff
 */
declare function fetchWithRetry(url: string): Promise<any>;
declare function retryableOperation(): Promise<{
    success: boolean;
}>;
declare function distributedSystemCall(): Promise<never>;
interface DatabaseRecord {
    id: string;
    data: any;
}
declare function saveToDatabase(record: DatabaseRecord): Promise<DatabaseRecord>;
declare function uploadFile(filePath: string, destination: string): Promise<{
    url: string;
}>;
declare function resilientApiCall(endpoint: string): Promise<any>;
declare function exampleWithCallback(): Promise<void>;
export { fetchWithRetry, retryableOperation, distributedSystemCall, saveToDatabase, uploadFile, resilientApiCall, exampleWithCallback, };
//# sourceMappingURL=retry-example.d.ts.map
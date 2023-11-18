export function requestR(result?: any, error?: boolean) {
    const r = { message: result.message, error, data: result }
    return r;
}
import dns from 'dns/promises';

export default async function resolve(host: string): Promise<string[] | ResolutionError> {
    try {
        return await dns.resolve(host);
    } catch (error) {
        return error;
    }
}

interface ResolutionError extends Error {
    code: 'ENODATA' | 'ENOTFOUND' | 'EREFUSED' | 'ERR_INVALID_ARG_VALUE';
    syscall: 'queryA';
    hostname: string;
}

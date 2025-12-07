// src/tests/utils/expressMocks.ts
export const mockRequest = (opts?: any) => {
return {
body: opts?.body || {},
params: opts?.params || {},
query: opts?.query || {},
file: opts?.file,
} as any;
};


export const mockResponse = () => {
const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.send = jest.fn().mockReturnValue(res);
return res;
};
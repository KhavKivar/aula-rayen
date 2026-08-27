type ProxyAuthRequestOptions = {
  request: Request;
  path: string;
  backendOrigin: string;
  fetch?: typeof globalThis.fetch;
};

export async function proxyAuthRequest({
  request,
  path,
  backendOrigin,
  fetch: fetchRequest = globalThis.fetch,
}: ProxyAuthRequestOptions): Promise<Response> {
  const requestUrl = new URL(request.url);
  const target = new URL(`/api/auth/${path}`, backendOrigin);
  target.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const init: RequestInit & { duplex: "half" } = {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    redirect: "manual",
    duplex: "half",
  };

  return fetchRequest(target, init);
}

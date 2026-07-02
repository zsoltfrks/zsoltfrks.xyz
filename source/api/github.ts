type RequestLike = {
  query: {
    path?: string | string[];
  };
};

type ResponseLike = {
  status(code: number): ResponseLike;
  setHeader(name: string, value: string): void;
  json(payload: unknown): void;
};

const GITHUB_API_ORIGIN = "https://api.github.com";
const ALLOWED_USER = "zsoltfrks";

// Only the endpoints the site actually uses may pass through the proxy,
// otherwise the token could be abused for arbitrary GitHub API calls.
const REPO_COMMITS_PATTERN = new RegExp(
  `^/repos/${ALLOWED_USER}/[A-Za-z0-9._-]+/commits(/[0-9a-f]{7,40})?$`,
);

function isAllowedRequest(url: URL): boolean {
  if (url.origin !== GITHUB_API_ORIGIN) return false;

  if (REPO_COMMITS_PATTERN.test(url.pathname)) return true;

  if (url.pathname === "/search/commits") {
    const query = url.searchParams.get("q") ?? "";
    return query.includes(`author:${ALLOWED_USER}`);
  }

  return false;
}

export default async function handler(
  req: RequestLike,
  res: ResponseLike,
): Promise<void> {
  const rawPath = req.query.path;
  const path = Array.isArray(rawPath) ? rawPath[0] : rawPath;

  if (!path || !path.startsWith("/")) {
    res.status(400).json({ error: "missing or invalid path param" });
    return;
  }

  let url: URL;
  try {
    url = new URL(path, GITHUB_API_ORIGIN);
  } catch {
    res.status(400).json({ error: "invalid path param" });
    return;
  }

  if (!isAllowedRequest(url)) {
    res.status(403).json({ error: "path not allowed" });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const data: unknown = await response.json();

    if (response.ok) {
      res.setHeader(
        "Cache-Control",
        "s-maxage=300, stale-while-revalidate=600",
      );
    }

    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: "upstream request failed" });
  }
}

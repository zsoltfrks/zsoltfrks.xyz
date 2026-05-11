type RequestLike = {
  query: {
    path?: string | string[];
  };
};

type ResponseLike = {
  status(code: number): ResponseLike;
  json(payload: unknown): void;
};

export default async function handler(
  req: RequestLike,
  res: ResponseLike,
): Promise<void> {
  const rawPath = req.query.path;
  const path = Array.isArray(rawPath) ? rawPath[0] : rawPath;

  if (!path) {
    res.status(400).json({ error: "missing path param" });
    return;
  }

  const url = `https://api.github.com${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const data: unknown = await response.json();
  res.status(response.status).json(data);
}

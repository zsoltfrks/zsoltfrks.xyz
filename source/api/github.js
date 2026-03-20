export default async function handler(req, res) {
  const { path } = req.query
  if (!path) return res.status(400).json({ error: 'missing path param' })

  const url = `https://api.github.com${path}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  const data = await response.json()
  res.status(response.status).json(data)
}

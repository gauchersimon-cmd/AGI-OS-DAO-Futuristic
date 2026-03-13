/**
 * /api/github
 * Bridge GitHub MCP — permet au frontend de déclencher des actions GitHub
 * depuis le dashboard (commits, issues, PRs, status)
 * Inspiré BrowserOS — communication VS Code → GitHub → Vercel en boucle
 */
export const maxDuration = 30

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT
const REPO_OWNER   = process.env.GITHUB_REPO_OWNER || "gauchersimon-cmd"
const REPO_NAME    = process.env.GITHUB_REPO_NAME  || "AGI-OS-DAO-Futuristic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action") || "status"

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  }
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`

  try {
    if (action === "status") {
      // Dernier commit + infos repo
      const [repoRes, commitsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { headers }),
        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=5`, { headers }),
      ])
      const repo    = await repoRes.json()
      const commits = await commitsRes.json()
      return Response.json({
        ok: true,
        repo: {
          name:        repo.name,
          description: repo.description,
          stars:       repo.stargazers_count,
          forks:       repo.forks_count,
          language:    repo.language,
          updatedAt:   repo.updated_at,
          url:         repo.html_url,
        },
        commits: Array.isArray(commits)
          ? commits.map((c: any) => ({
              sha:     c.sha?.slice(0, 7),
              message: c.commit?.message?.split("\n")[0],
              author:  c.commit?.author?.name,
              date:    c.commit?.author?.date,
              url:     c.html_url,
            }))
          : [],
      })
    }

    if (action === "issues") {
      const res  = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=10`,
        { headers }
      )
      const data = await res.json()
      return Response.json({ ok: true, issues: data })
    }

    if (action === "branches") {
      const res  = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/branches`,
        { headers }
      )
      const data = await res.json()
      return Response.json({ ok: true, branches: data })
    }

    return Response.json({ ok: false, error: "Unknown action" }, { status: 400 })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

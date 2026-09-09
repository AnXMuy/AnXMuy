# Profile maintenance

- `README.md` is a compact, English-first visual calling card with a short bilingual research line. Detailed biography, experience, publications and projects live on the homepage, not in this profile. Repository activity and the contribution snake are collapsible.
- `assets/header.svg` and `assets/siam-logo.webp` are local branding assets. The original photograph remains in `assets/半身照.jpg`.
- `node scripts/update-profile.mjs` reads real commits from the three listed public repositories. Node 22 is used in CI; `GITHUB_TOKEN` is optional locally and avoids unauthenticated rate limits. API failures retain the previous README and fail the run rather than inventing activity.
- The activity feed is repository history, not personal contribution counts. It excludes this workflow's own `chore(profile):` refresh commits. It intentionally does not embed volatile public stats-card services or claim coding streaks.
- `.github/workflows/profile.yml` runs daily at 02:23 UTC (10:23 China time), or manually via Actions → Refresh profile activity → Run workflow. It uses the repository's built-in token with contents-write permission; no personal access token is required. Repository rules or branch protection can prevent writes.
- After publishing, the first successful workflow run creates the pale-blue contribution snake and adds its local image to the README. Before that, the README shows a working contribution-history link, not a broken image. The snake is in a collapsible section to keep animation optional. Platane/snk is pinned to the verified v3 commit; review upstream before updating it.
- Shields.io supplies lightweight badges and may be cached or temporarily unavailable. The local artwork, plain homepage/contact links and saved activity feed do not depend on it.
- Publishing the files enables the workflow; no remote workflow is triggered by the local editing process. Do not put secrets, private repository activity, or unverifiable numbers in this profile.

Terminology: 多模态大模型与人机交互 / multimodal large language models and human-computer interaction; 西安交通大学少年班 / XJTU's Young Gifted Program; 计算机学院 / School of Computer Science; TCS = 理论计算机科学 / Theoretical Computer Science; Robotic Navigation = course project.

# Link library for guides (verified 2026-10-22)

Every repo below was checked live: it exists (HTTP 200 on github.com / api.github.com, renames resolved),
and the install line was taken from the repo's own README on that date. Stars are rounded, as of 2026-10-22.

**Rules**
- Only use repos from this list, or repos you verified the same way in this run: `curl -sI https://github.com/<owner>/<repo>` returns 200 (a 301 means renamed, so use the new name), and you fetched the README with `curl -sL https://raw.githubusercontent.com/<owner>/<repo>/HEAD/README.md`.
- Install commands go word for word from the README. Never build one from memory. If the README has no line for Claude, give the hosted URL and the click path (Claude → Settings → Connectors → Add custom connector) instead.
- Add new verified repos here with the date, so the next guide can reuse them.
- An API key in a command is always a placeholder (`fc-YOUR_API_KEY`), never a real one.
- Each guide gets 6-12 repos, picked for the topic. Never dump the whole list.

## Anthropic (official)

| Repo | Kind | Stars | Gives the reader | Install / use (from README) |
|---|---|---|---|---|
| anthropics/skills | SKILL | 183k | Official Agent Skills: PDF, Excel, Word, PowerPoint, skill-creator and more | `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills` (in Claude Code) |
| anthropics/claude-plugins-official | PLUGIN | 44k | Official directory of Claude Code plugins | browse; plugins are installed via `/plugin` |
| anthropics/claude-code | REPO | 153k | Claude Code itself (agent in the terminal) | see README |
| anthropics/claude-cookbooks | PROMPTS | 54k | Recipes and notebooks: tool use, RAG, extraction, agents | read / copy |
| anthropics/prompt-eng-interactive-tutorial | PROMPTS | 39k | Anthropic's interactive prompting course | read |
| anthropics/claude-quickstarts | REPO | 19k | Ready-made starter apps on Claude | see README |

(`anthropics/courses` is archived, so don't use it.)

## MCP servers (connect Claude to tools)

| Repo | Kind | Stars | Gives the reader | Install / use (from README) |
|---|---|---|---|---|
| modelcontextprotocol/servers | MCP | 91k | Official reference servers (Filesystem, Fetch, Git, Memory …) | see README per server |
| modelcontextprotocol/registry | MCP | 7k | Official registry of MCP servers | browse |
| punkpeye/awesome-mcp-servers | MCP | 97k | Largest list of MCP servers, sorted by topic | browse |
| github/github-mcp-server | MCP | 34k | GitHub's official MCP: repos, issues, PRs | remote URL `https://api.githubcopilot.com/mcp/` |
| microsoft/playwright-mcp | MCP | 39k | Claude drives a real browser (click, fill forms, read pages) | `claude mcp add playwright npx @playwright/mcp@latest` |
| microsoft/mcp | MCP | 4k | Catalog of official Microsoft MCP servers | browse |
| Softeria/ms-365-mcp-server | MCP | – | Outlook, calendar, OneDrive, Teams via Microsoft Graph | `claude mcp add ms365 -- npx -y @softeria/ms-365-mcp-server` (`--org-mode` for work accounts) |
| korotovsky/slack-mcp-server | MCP | – | Slack: channels, DMs, history, no admin permissions needed | see README |
| taylorwilsdon/google_workspace_mcp | MCP | – | Gmail, Calendar, Docs, Sheets, Drive | `uvx workspace-mcp --tool-tier core` |
| hubspot/mcp-server | MCP | – | HubSpot CRM: contacts, companies, deals | see README |
| makenotion/notion-mcp-server | MCP | 5k | Notion (README recommends the remote Notion MCP) | remote MCP via developers.notion.com/docs/mcp |
| firecrawl/firecrawl-mcp-server | MCP | 8k | Search, scrape and crawl websites | `env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp` |
| exa-labs/exa-mcp-server | MCP | 5k | Web search and crawling built for AI | remote URL `https://mcp.exa.ai/mcp` |
| apify/apify-mcp-server | MCP | 13k | Thousands of ready-made scrapers (LinkedIn, Google Maps, Instagram …) | remote URL `https://mcp.apify.com` (OAuth, works in claude.ai) |
| brave/brave-search-mcp-server | MCP | – | Brave web search (needs `BRAVE_API_KEY`) | see README |
| zapier/zapier-mcp | MCP | – | Hosted Zapier MCP, thousands of apps | Claude Code: marketplace `zapier/marketplace`; URL `https://mcp.zapier.com/api/v1/connect` |
| czlonkowski/n8n-mcp | MCP | – | Claude builds n8n workflows for you | see docs/CLAUDE_CODE_SETUP.md |
| supabase/mcp | MCP | – | Connect Supabase databases (was supabase-community/supabase-mcp) | see README |
| stripe/ai | MCP | – | Stripe agent toolkit + MCP (was stripe/agent-toolkit) | see README |

## Skills, plugins and prompt collections

| Repo | Kind | Stars | Gives the reader |
|---|---|---|---|
| ComposioHQ/awesome-claude-skills | SKILL | 78k | Curated list of Claude Skills |
| travisvn/awesome-claude-skills | SKILL | 16k | Second curated skills list |
| hesreallyhim/awesome-claude-code | PLUGIN | 56k | Best resources for Claude Code: commands, hooks, workflows |
| obra/superpowers | SKILL | – | Skills framework / way of working for agents |
| wshobson/agents | PLUGIN | – | Plugin marketplace with many ready-made agents |
| f/prompts.chat | PROMPTS | 174k | The big prompt collection (formerly awesome-chatgpt-prompts) |
| langgptai/awesome-claude-prompts | PROMPTS | – | Claude prompt collection |
| dair-ai/Prompt-Engineering-Guide | PROMPTS | – | Prompt engineering, context engineering, agents |

## Standard Claude Code commands (safe to use)

```
claude mcp add <name> -- <command>                   # local MCP server
claude mcp add --transport http <name> <url>         # remote MCP server
claude mcp list                                      # what's connected
mkdir -p ~/.claude/skills/<skill-name>                # own skill: SKILL.md goes in here
```
claude.ai (no terminal): Settings → Connectors → "Add custom connector" → paste the remote URL; Settings → Capabilities → Skills → upload the ZIP.

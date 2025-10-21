// app/lib/github.ts
const toBase64 = (s: string) =>
  Buffer.from(s, "utf8").toString("base64");

type PutFileArgs = {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
  path: string;
  content: string;
  message: string;
};

async function getShaIfExists(args: Omit<PutFileArgs,"message"|"content">) {
  const branch = args.branch || "main";
  const url = `https://api.github.com/repos/${args.owner}/${args.repo}/contents/${encodeURIComponent(args.path)}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      // Both "Bearer" and "token" work; "Bearer" is more modern.
      Authorization: `Bearer ${args.token}`,
      "User-Agent": "cwa-assignment",
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (res.status === 200) {
    const j = await res.json();
    return j.sha as string;
  }
  return undefined;
}

export async function putFileToGithub({
  token, owner, repo, branch = "main", path, content, message,
}: PutFileArgs) {
  const sha = await getShaIfExists({ token, owner, repo, branch, path });
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    content: toBase64(content),
    branch,
    ...(sha ? { sha } : {}),
  };
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "cwa-assignment",
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed (${res.status}): ${text}`);
  }
  return res.json();
}

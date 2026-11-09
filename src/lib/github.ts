export interface StudentProject {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string; // Cloudflare Pagesなどのデプロイ先URL
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
}

export async function getStudentProjects(): Promise<StudentProject[]> {
  const TOPIC = 'class-2026';
  // 特定のOrganizationに絞る場合は org:your-org-name を追加
  const query = `topic:${TOPIC}`; 
  
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc`,
    {
      headers: {
        Accept: 'application/vnd.github.+json',
        Authorization: import.meta.env.GITHUB_TOKEN ? `Bearer ${import.meta.env.GITHUB_TOKEN}` : '',
        'User-Agent': 'Student-Portal-App',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API Error: ${res.statusText}`);
  }

  const data = await res.json();
  
  // URL(homepage)が未設定のリポジトリを除外して返却
  return data.items.filter((repo: StudentProject) => Boolean(repo.homepage));
}
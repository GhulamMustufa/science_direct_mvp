import dotenv from 'dotenv';

dotenv.config();

const OJS_BASE_URL = process.env.OJS_BASE_URL || 'https://ojs.example.com';
const OJS_API_KEY = process.env.OJS_API_KEY || '';

export interface OjsJournal {
  ojsJournalId: string;
  title: string;
  description: string | null;
  issn: string | null;
}

export interface OjsVolume {
  volumeNumber: string;
  year: string;
}

export interface OjsIssue {
  issueNumber: string;
  title: string | null;
  year: string;
}

export interface OjsArticle {
  ojsArticleId: string;
  title: string;
  abstract: string;
  pdfUrl: string | null;
  doi: string | null;
  publishedAt: string;
}

export interface OjsAuthor {
  firstName: string;
  lastName: string;
  email: string | null;
  institution: string | null;
  orcid: string | null;
}

export interface OjsSubmission {
  ojsSubmissionId: string;
  title: string;
  journalTitle: string;
  status: 'submitted' | 'under_review' | 'revisions_required' | 'accepted' | 'rejected' | 'published';
  submittedAt: string; // ISO date
  lastStatusUpdate: string; // ISO date
  ojsUrl: string;
  authorEmail: string; // used to link submission to an author
}


const MOCK_JOURNALS: OjsJournal[] = [
  {
    ojsJournalId: '00000000-0000-0000-0000-000000000001',
    title: 'Journal of Artificial Intelligence Research',
    description: 'An international peer-reviewed journal on all aspects of AI.',
    issn: '1076-9757',
  },
  {
    ojsJournalId: '00000000-0000-0000-0000-000000000002',
    title: 'International Journal of Bioinformatics',
    description: 'Focusing on research in genomics, proteomics, and computational biology.',
    issn: '1467-5463',
  },
];

const MOCK_VOLUMES: Record<string, OjsVolume[]> = {
  '00000000-0000-0000-0000-000000000001': [
    { volumeNumber: '10', year: '2025' },
    { volumeNumber: '11', year: '2026' },
  ],
  '00000000-0000-0000-0000-000000000002': [
    { volumeNumber: '5', year: '2024' },
  ],
};

const MOCK_ISSUES: Record<string, OjsIssue[]> = {
  '00000000-0000-0000-0000-000000000001_10': [
    { issueNumber: '1', title: 'Special Issue on LLMs', year: '2025' },
  ],
  '00000000-0000-0000-0000-000000000001_11': [
    { issueNumber: '2', title: 'Agentic Workflows', year: '2026' },
  ],
  '00000000-0000-0000-0000-000000000002_5': [
    { issueNumber: '1', title: 'Genomics in Medicine', year: '2024' },
  ],
};

const MOCK_ARTICLES: Record<string, OjsArticle[]> = {
  '00000000-0000-0000-0000-000000000001_10_1': [
    {
      ojsArticleId: '11111111-1111-1111-1111-111111111111',
      title: 'Deep Learning for Natural Language Processing',
      abstract: 'This paper discusses the advancements in NLP using deep neural networks...',
      pdfUrl: 'https://ojs.example.com/index.php/jair/article/view/11111111-1111-1111-1111-111111111111/1',
      doi: '10.1016/j.jair.2025.01.001',
      publishedAt: '2025-01-15T09:00:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000001_11_2': [
    {
      ojsArticleId: '11111111-1111-1111-1111-111111111112',
      title: 'Reinforcement Learning in Robotics',
      abstract: 'A comprehensive study on model-free RL algorithms for robot manipulation tasks.',
      pdfUrl: 'https://ojs.example.com/index.php/jair/article/view/11111111-1111-1111-1111-111111111112/2',
      doi: '10.1016/j.jair.2026.02.005',
      publishedAt: '2026-02-20T10:00:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000002_5_1': [
    {
      ojsArticleId: '22222222-2222-2222-2222-222222222221',
      title: 'Genome-wide Association Studies of Disease',
      abstract: 'We identify key genetic variants associated with type-2 diabetes in a cohort of 50,000...',
      pdfUrl: 'https://ojs.example.com/index.php/ijb/article/view/22222222-2222-2222-2222-222222222221/1',
      doi: '10.1016/j.ijb.2024.03.012',
      publishedAt: '2024-03-10T08:00:00Z',
    },
  ],
};

const MOCK_AUTHORS: Record<string, OjsAuthor[]> = {
  '11111111-1111-1111-1111-111111111111': [
    {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      institution: 'MIT',
      orcid: '0000-0001-1111-1111',
    },
    {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      institution: 'Stanford University',
      orcid: '0000-0002-2222-2222',
    },
  ],
  '11111111-1111-1111-1111-111111111112': [
    {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      institution: 'UC Berkeley',
      orcid: '0000-0003-3333-3333',
    },
  ],
  '22222222-2222-2222-2222-222222222221': [
    {
      firstName: 'Diana',
      lastName: 'Prince',
      email: 'diana@example.com',
      institution: 'Harvard University',
      orcid: '0000-0004-4444-4444',
    },
    {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      institution: 'Stanford University',
      orcid: '0000-0002-2222-2222',
    },
  ],
};

const MOCK_SUBMISSIONS: OjsSubmission[] = [
  {
    ojsSubmissionId: 'sub-001',
    title: 'A Novel Approach to AI Ethics',
    journalTitle: 'Journal of Artificial Intelligence Research',
    status: 'under_review',
    submittedAt: '2026-06-20T10:00:00Z',
    lastStatusUpdate: '2026-06-25T14:30:00Z',
    ojsUrl: 'https://ojs.example.com/submissions/sub-001',
    authorEmail: 'alice@example.com',
  },
  {
    ojsSubmissionId: 'sub-002',
    title: 'Predictive Modeling for Climate Change',
    journalTitle: 'International Journal of Bioinformatics',
    status: 'revisions_required',
    submittedAt: '2026-05-15T09:00:00Z',
    lastStatusUpdate: '2026-06-10T11:00:00Z',
    ojsUrl: 'https://ojs.example.com/submissions/sub-002',
    authorEmail: 'bob@example.com',
  },
  {
    ojsSubmissionId: 'sub-003',
    title: 'The Future of Quantum Computing',
    journalTitle: 'Journal of Artificial Intelligence Research',
    status: 'submitted',
    submittedAt: '2026-07-01T08:00:00Z',
    lastStatusUpdate: '2026-07-01T08:00:00Z',
    ojsUrl: 'https://ojs.example.com/submissions/sub-003',
    authorEmail: 'charlie@example.com',
  },
  {
    ojsSubmissionId: 'sub-004',
    title: 'Deep Learning in Genomics',
    journalTitle: 'International Journal of Bioinformatics',
    status: 'accepted',
    submittedAt: '2026-03-10T12:00:00Z',
    lastStatusUpdate: '2026-04-20T15:00:00Z',
    ojsUrl: 'https://ojs.example.com/submissions/sub-004',
    authorEmail: 'diana@example.com',
  },
];

const MOCK_ALL_USERS: any[] = [
  {
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    password: 'Password123!'
  },
  {
    email: 'author@example.com',
    firstName: 'Author',
    lastName: 'User',
    role: 'author',
    password: 'Password123!'
  }
];


export class OjsClient {
  private journalPathMap = new Map<string, string>();
  private journalTitleMap = new Map<string, string>();

  private isMock(): boolean {
    return OJS_BASE_URL.includes('example.com') || !OJS_API_KEY;
  }

  async fetchJournals(): Promise<OjsJournal[]> {
    if (this.isMock()) return MOCK_JOURNALS;
    try {
      const res = await fetch(`${OJS_BASE_URL}/index.php/index/api/v1/contexts`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` },
      });
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      const data = (await res.json()) as any;
      
      const journals: OjsJournal[] = [];
      for (const item of data.items) {
        const idStr = item.id.toString();
        this.journalPathMap.set(idStr, item.urlPath);
        this.journalTitleMap.set(idStr, item.name?.en || item.name || 'Untitled');
        
        journals.push({
          ojsJournalId: idStr,
          title: item.name?.en || item.name || 'Untitled',
          description: item.description?.en || null,
          issn: item.issn || null,
        });
      }
      return journals;
    } catch (error: any) {
      console.warn('OJS API call failed, falling back to mock data:', error.message || error);
      return MOCK_JOURNALS;
    }
  }

  async fetchVolumes(ojsJournalId: string): Promise<OjsVolume[]> {
    if (this.isMock()) return MOCK_VOLUMES[ojsJournalId] || [];
    try {
      const path = this.journalPathMap.get(ojsJournalId) || 'index';
      const res = await fetch(`${OJS_BASE_URL}/index.php/${path}/api/v1/issues`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` },
      });
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      const data = (await res.json()) as any;
      
      const volumesMap = new Map<string, OjsVolume>();
      for (const item of data.items) {
        if (item.volume) {
          const volStr = item.volume.toString();
          if (!volumesMap.has(volStr)) {
            volumesMap.set(volStr, {
              volumeNumber: volStr,
              year: (item.year || '').toString(),
            });
          }
        }
      }
      return Array.from(volumesMap.values());
    } catch (error: any) {
      console.warn('OJS API call failed, falling back to mock data:', error.message || error);
      return MOCK_VOLUMES[ojsJournalId] || [];
    }
  }

  async fetchIssues(ojsJournalId: string, volumeNumber: string): Promise<OjsIssue[]> {
    const key = `${ojsJournalId}_${volumeNumber}`;
    if (this.isMock()) return MOCK_ISSUES[key] || [];
    try {
      const path = this.journalPathMap.get(ojsJournalId) || 'index';
      const res = await fetch(
        `${OJS_BASE_URL}/index.php/${path}/api/v1/issues`,
        { headers: { Authorization: `Bearer ${OJS_API_KEY}` } }
      );
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      const data = (await res.json()) as any;
      
      const issues: OjsIssue[] = [];
      for (const item of data.items) {
        if (item.volume && item.volume.toString() === volumeNumber && item.number) {
          issues.push({
            issueNumber: item.number.toString(),
            title: item.title?.en || null,
            year: (item.year || '').toString(),
          });
        }
      }
      return issues;
    } catch (error: any) {
      console.warn('OJS API call failed, falling back to mock data:', error.message || error);
      return MOCK_ISSUES[key] || [];
    }
  }

  async fetchArticles(
    ojsJournalId: string,
    volumeNumber: string,
    issueNumber: string
  ): Promise<OjsArticle[]> {
    const key = `${ojsJournalId}_${volumeNumber}_${issueNumber}`;
    if (this.isMock()) return MOCK_ARTICLES[key] || [];
    try {
      const path = this.journalPathMap.get(ojsJournalId) || 'index';
      // Fetch all published submissions
      const res = await fetch(
        `${OJS_BASE_URL}/index.php/${path}/api/v1/submissions?status=3`,
        { headers: { Authorization: `Bearer ${OJS_API_KEY}` } }
      );
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      const data = (await res.json()) as any;
      
      const articles: OjsArticle[] = [];
      for (const item of data.items) {
        const pub = item.publications && item.publications.length > 0 ? item.publications[0] : null;
        if (!pub) continue;
        
        let pdfUrl: string | null = null;
        if (pub.galleys && Array.isArray(pub.galleys)) {
          const pdfGalley = pub.galleys.find((g: any) => 
            (g.label || '').toLowerCase().includes('pdf') || 
            (g.file?.mimetype || '').toLowerCase().includes('pdf') ||
            (g.fileType || '').toLowerCase().includes('pdf')
          );
          if (pdfGalley) {
            pdfUrl = pdfGalley.urlPublished || pdfGalley.urlRemote || null;
            if (!pdfUrl && pdfGalley.id) {
               pdfUrl = `${OJS_BASE_URL}/index.php/${path}/article/view/${item.id}/${pdfGalley.id}`;
            }
          }
        }
        
        articles.push({
          ojsArticleId: item.id.toString(),
          title: pub.title?.en || pub.title || 'Untitled',
          abstract: pub.abstract?.en || '',
          pdfUrl,
          doi: pub.doi || null,
          publishedAt: pub.datePublished || item.dateSubmitted || new Date().toISOString(),
        });
      }
      return articles;
    } catch (error: any) {
      console.warn('OJS API call failed, falling back to mock data:', error.message || error);
      return MOCK_ARTICLES[key] || [];
    }
  }

  async fetchAuthors(ojsArticleId: string): Promise<OjsAuthor[]> {
    if (this.isMock()) return MOCK_AUTHORS[ojsArticleId] || [];
    try {
      let data = null;
      for (const p of this.journalPathMap.values()) {
         const res = await fetch(`${OJS_BASE_URL}/index.php/${p}/api/v1/submissions/${ojsArticleId}`, {
           headers: { Authorization: `Bearer ${OJS_API_KEY}` },
         });
         if (res.ok) {
           data = (await res.json()) as any;
           break;
         }
      }
      if (!data) throw new Error('Submission not found in any context');
      
      const pub = data.publications && data.publications.length > 0 ? data.publications[0] : null;
      const authors: OjsAuthor[] = [];
      if (pub && pub.authors) {
        for (const auth of pub.authors) {
          authors.push({
            firstName: auth.givenName?.en || 'Unknown',
            lastName: auth.familyName?.en || '',
            email: auth.email || null,
            institution: auth.affiliation?.en || null,
            orcid: auth.orcid || null,
          });
        }
      }
      return authors;
    } catch (error: any) {
      console.warn('OJS API call failed, falling back to mock data:', error.message || error);
      return MOCK_AUTHORS[ojsArticleId] || [];
    }
  }

  async fetchSubmissions(): Promise<OjsSubmission[]> {
    if (this.isMock()) return MOCK_SUBMISSIONS;
    try {
      const allSubmissions: OjsSubmission[] = [];
      for (const [id, path] of this.journalPathMap.entries()) {
        const title = this.journalTitleMap.get(id) || 'Unknown Journal';
        const res = await fetch(`${OJS_BASE_URL}/index.php/${path}/api/v1/submissions`, {
          headers: { Authorization: `Bearer ${OJS_API_KEY}` },
        });
        if (!res.ok) continue;
        const data = (await res.json()) as any;
        
        for (const item of data.items) {
          let mappedStatus: OjsSubmission['status'] = 'submitted';
          if (item.status === 1) mappedStatus = 'submitted';
          if (item.status === 2) mappedStatus = 'under_review';
          if (item.status === 3) mappedStatus = 'published';
          if (item.status === 4) mappedStatus = 'rejected';
          
          let authorEmail = 'unknown@example.com';
          const pub = item.publications?.[0];
          if (pub && pub.authors && pub.authors.length > 0) {
            authorEmail = pub.authors[0].email || authorEmail;
          }

          allSubmissions.push({
            ojsSubmissionId: item.id.toString(),
            title: pub?.title?.en || pub?.title || 'Untitled',
            journalTitle: title,
            status: mappedStatus,
            submittedAt: item.dateSubmitted || new Date().toISOString(),
            lastStatusUpdate: item.lastModified || item.dateSubmitted || new Date().toISOString(),
            ojsUrl: `${OJS_BASE_URL}/index.php/${path}/workflow/access/${item.id}`,
            authorEmail,
          });
        }
      }
      return allSubmissions;
    } catch (error: any) {
      console.warn('OJS API call failed, falling back to mock submissions:', error.message || error);
      return MOCK_SUBMISSIONS;
    }
  }

  async authenticateUser(email: string, password: string): Promise<any | null> {
    if (this.isMock()) {
      const u = MOCK_ALL_USERS.find(u => u.email === email && u.password === password);
      return u ? { ...u } : null;
    }
    try {
      const res = await fetch(`${OJS_BASE_URL}/index.php/index/api/v1/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      
      // We would ideally fetch the full profile here to get role IDs,
      // but for this MVP, we parse from login response or default to author.
      return {
        email,
        firstName: data.givenName?.en || 'Unknown',
        lastName: data.familyName?.en || 'User',
        role: 'author', 
      };
    } catch (e) {
      console.error('OJS proxy login failed:', e);
      return null;
    }
  }

  async fetchAllUsers(): Promise<any[]> {
    if (this.isMock()) return MOCK_ALL_USERS;
    try {
      const res = await fetch(`${OJS_BASE_URL}/index.php/index/api/v1/users`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` }
      });
      if (!res.ok) return [];
      const data = (await res.json()) as any;
      return data.items.map((item: any) => ({
        email: item.email,
        firstName: item.givenName?.en || 'Unknown',
        lastName: item.familyName?.en || '',
        // Role ID 1 = Site Admin, 16 = Journal Manager
        role: (item.groups && item.groups.some((g: any) => g.roleId === 1 || g.roleId === 16)) ? 'admin' : 'author'
      }));
    } catch (e) {
      console.warn('OJS API call failed fetching all users:', e);
      return [];
    }
  }
}

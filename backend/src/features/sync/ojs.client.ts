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
      pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/mock/o/nlp.pdf',
      doi: '10.1016/j.jair.2025.01.001',
      publishedAt: '2025-01-15T09:00:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000001_11_2': [
    {
      ojsArticleId: '11111111-1111-1111-1111-111111111112',
      title: 'Reinforcement Learning in Robotics',
      abstract: 'A comprehensive study on model-free RL algorithms for robot manipulation tasks.',
      pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/mock/o/robotics.pdf',
      doi: '10.1016/j.jair.2026.02.005',
      publishedAt: '2026-02-20T10:00:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000002_5_1': [
    {
      ojsArticleId: '22222222-2222-2222-2222-222222222221',
      title: 'Genome-wide Association Studies of Disease',
      abstract: 'We identify key genetic variants associated with type-2 diabetes in a cohort of 50,000...',
      pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/mock/o/gwas.pdf',
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
    ojsSubmissionId: 'sub-00000000-0000-0000-0000-000000000001',
    title: 'Attention Mechanisms in Transformers: A Comparative Study',
    journalTitle: 'Journal of Artificial Intelligence Research',
    status: 'under_review',
    submittedAt: '2026-05-10T10:00:00Z',
    lastStatusUpdate: '2026-05-15T14:30:00Z',
    ojsUrl: 'https://ojs.example.com/index.php/jair/submission/sub-00000001',
    authorEmail: 'alice@example.com',
  },
  {
    ojsSubmissionId: 'sub-00000000-0000-0000-0000-000000000002',
    title: 'Splicing Detection in Non-Coding RNA Sequences',
    journalTitle: 'International Journal of Bioinformatics',
    status: 'revisions_required',
    submittedAt: '2026-05-20T08:00:00Z',
    lastStatusUpdate: '2026-06-01T11:00:00Z',
    ojsUrl: 'https://ojs.example.com/index.php/ijb/submission/sub-00000002',
    authorEmail: 'bob@example.com',
  },
  {
    ojsSubmissionId: 'sub-00000000-0000-0000-0000-000000000003',
    title: 'Zero-Shot Learning with Vision-Language Models',
    journalTitle: 'Journal of Artificial Intelligence Research',
    status: 'submitted',
    submittedAt: '2026-06-15T09:00:00Z',
    lastStatusUpdate: '2026-06-15T09:00:00Z',
    ojsUrl: 'https://ojs.example.com/index.php/jair/submission/sub-00000003',
    authorEmail: 'charlie@example.com',
  },
  {
    ojsSubmissionId: 'sub-00000000-0000-0000-0000-000000000004',
    title: 'Single-Cell RNA Sequencing Analysis Pipelines',
    journalTitle: 'International Journal of Bioinformatics',
    status: 'accepted',
    submittedAt: '2026-04-12T10:00:00Z',
    lastStatusUpdate: '2026-05-20T16:00:00Z',
    ojsUrl: 'https://ojs.example.com/index.php/ijb/submission/sub-00000004',
    authorEmail: 'diana@example.com',
  },
  {
    ojsSubmissionId: 'sub-00000000-0000-0000-0000-000000000005',
    title: 'Pathways of Somatic Mutation Clustering in Tumors',
    journalTitle: 'International Journal of Bioinformatics',
    status: 'rejected',
    submittedAt: '2026-03-01T11:30:00Z',
    lastStatusUpdate: '2026-04-05T09:00:00Z',
    ojsUrl: 'https://ojs.example.com/index.php/ijb/submission/sub-00000005',
    authorEmail: 'bob@example.com',
  },
];

export class OjsClient {
  private isMock(): boolean {
    return OJS_BASE_URL.includes('example.com') || !OJS_API_KEY;
  }

  async fetchJournals(): Promise<OjsJournal[]> {
    if (this.isMock()) return MOCK_JOURNALS;
    try {
      const res = await fetch(`${OJS_BASE_URL}/api/v1/journals`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` },
      });
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      return (await res.json()) as OjsJournal[];
    } catch (error) {
      console.warn('OJS API call failed, falling back to mock data:', error);
      return MOCK_JOURNALS;
    }
  }

  async fetchVolumes(ojsJournalId: string): Promise<OjsVolume[]> {
    if (this.isMock()) return MOCK_VOLUMES[ojsJournalId] || [];
    try {
      const res = await fetch(`${OJS_BASE_URL}/api/v1/journals/${ojsJournalId}/volumes`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` },
      });
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      return (await res.json()) as OjsVolume[];
    } catch (error) {
      console.warn('OJS API call failed, falling back to mock data:', error);
      return MOCK_VOLUMES[ojsJournalId] || [];
    }
  }

  async fetchIssues(ojsJournalId: string, volumeNumber: string): Promise<OjsIssue[]> {
    const key = `${ojsJournalId}_${volumeNumber}`;
    if (this.isMock()) return MOCK_ISSUES[key] || [];
    try {
      const res = await fetch(
        `${OJS_BASE_URL}/api/v1/journals/${ojsJournalId}/volumes/${volumeNumber}/issues`,
        { headers: { Authorization: `Bearer ${OJS_API_KEY}` } }
      );
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      return (await res.json()) as OjsIssue[];
    } catch (error) {
      console.warn('OJS API call failed, falling back to mock data:', error);
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
      const res = await fetch(
        `${OJS_BASE_URL}/api/v1/journals/${ojsJournalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles`,
        { headers: { Authorization: `Bearer ${OJS_API_KEY}` } }
      );
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      return (await res.json()) as OjsArticle[];
    } catch (error) {
      console.warn('OJS API call failed, falling back to mock data:', error);
      return MOCK_ARTICLES[key] || [];
    }
  }

  async fetchAuthors(ojsArticleId: string): Promise<OjsAuthor[]> {
    if (this.isMock()) return MOCK_AUTHORS[ojsArticleId] || [];
    try {
      const res = await fetch(`${OJS_BASE_URL}/api/v1/articles/${ojsArticleId}/authors`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` },
      });
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      return (await res.json()) as OjsAuthor[];
    } catch (error) {
      console.warn('OJS API call failed, falling back to mock data:', error);
      return MOCK_AUTHORS[ojsArticleId] || [];
    }
  }

  async fetchSubmissions(): Promise<OjsSubmission[]> {
    if (this.isMock()) return MOCK_SUBMISSIONS;
    try {
      const res = await fetch(`${OJS_BASE_URL}/api/v1/submissions?status=queued,review,editing,published`, {
        headers: { Authorization: `Bearer ${OJS_API_KEY}` },
      });
      if (!res.ok) throw new Error(`OJS returned ${res.status}`);
      return (await res.json()) as OjsSubmission[];
    } catch (error) {
      console.warn('OJS API call failed, falling back to mock submissions:', error);
      return MOCK_SUBMISSIONS;
    }
  }
}

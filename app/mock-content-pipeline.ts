// Mock Content Pipeline data for visualization
export interface ContentItem {
  id: string;
  title: string;
  status: 'brainstorm' | 'greenlit' | 'in_production' | 'published';
  sponsor?: string;
  difficulty: 'simple' | 'moderate' | 'complex';
  submittedDate: string;
  productionStartDate?: string;
  publishDate?: string;
  views?: number;
  watchHours?: number;
  revenue?: number;
  agent: string;
}

export const mockContentPipeline: ContentItem[] = [
  // BRAINSTORM (Recent submissions, waiting for review)
  {
    id: 'idea-001',
    title: 'AI Agents for Solopreneurs',
    status: 'brainstorm',
    sponsor: 'Anthropic',
    difficulty: 'moderate',
    submittedDate: '2026-03-01T10:00:00Z',
    agent: 'Aurelius',
  },
  {
    id: 'idea-002',
    title: 'Vector Database Showdown 2026',
    status: 'brainstorm',
    sponsor: 'Pinecone',
    difficulty: 'complex',
    submittedDate: '2026-02-28T14:30:00Z',
    agent: 'Curie',
  },
  {
    id: 'idea-003',
    title: 'Prompt Engineering Experiments',
    status: 'brainstorm',
    difficulty: 'moderate',
    submittedDate: '2026-02-26T11:20:00Z',
    agent: 'Curie',
  },

  // GREENLIT (Approved, waiting to start production)
  {
    id: 'idea-004',
    title: 'How to Build Your Own AI Tool',
    status: 'greenlit',
    sponsor: 'Vercel',
    difficulty: 'simple',
    submittedDate: '2026-02-25T09:15:00Z',
    agent: 'Aurelius',
  },
  {
    id: 'idea-005',
    title: 'LLM Cost Optimization Guide',
    status: 'greenlit',
    sponsor: 'Anthropic',
    difficulty: 'moderate',
    submittedDate: '2026-02-24T15:45:00Z',
    agent: 'Curie',
  },

  // IN PRODUCTION (Currently being filmed/edited)
  {
    id: 'idea-006',
    title: 'RAG Systems in Production',
    status: 'in_production',
    sponsor: 'Weaviate',
    difficulty: 'complex',
    submittedDate: '2026-02-20T10:00:00Z',
    productionStartDate: '2026-02-27T09:00:00Z',
    agent: 'Aurelius',
  },
  {
    id: 'idea-007',
    title: 'Open Source AI Models Benchmark',
    status: 'in_production',
    difficulty: 'complex',
    submittedDate: '2026-02-18T13:30:00Z',
    productionStartDate: '2026-02-28T10:00:00Z',
    agent: 'Curie',
  },
  {
    id: 'idea-008',
    title: 'Automation with n8n + AI',
    status: 'in_production',
    sponsor: 'n8n',
    difficulty: 'moderate',
    submittedDate: '2026-02-15T11:00:00Z',
    productionStartDate: '2026-03-01T14:00:00Z',
    agent: 'Ogilvy',
  },

  // PUBLISHED (Live with metrics)
  {
    id: 'idea-009',
    title: 'Building a Media Company with AI',
    status: 'published',
    difficulty: 'moderate',
    submittedDate: '2026-02-15T08:00:00Z',
    publishDate: '2026-02-20T15:30:00Z',
    views: 12400,
    watchHours: 1844,
    revenue: 2100,
    agent: 'Aurelius',
  },
  {
    id: 'idea-010',
    title: 'ChatGPT vs Claude: Real Test',
    status: 'published',
    sponsor: 'Anthropic',
    difficulty: 'simple',
    submittedDate: '2026-02-10T10:15:00Z',
    publishDate: '2026-02-17T14:00:00Z',
    views: 18700,
    watchHours: 2821,
    revenue: 2800,
    agent: 'Curie',
  },
  {
    id: 'idea-011',
    title: 'Image Generation Tools Compared',
    status: 'published',
    difficulty: 'moderate',
    submittedDate: '2026-02-05T12:30:00Z',
    publishDate: '2026-02-13T16:00:00Z',
    views: 8900,
    watchHours: 1247,
    revenue: 1200,
    agent: 'Curie',
  },
  {
    id: 'idea-012',
    title: 'AI Workflows for Designers',
    status: 'published',
    sponsor: 'Adobe',
    difficulty: 'complex',
    submittedDate: '2026-01-28T09:00:00Z',
    publishDate: '2026-02-08T13:00:00Z',
    views: 24100,
    watchHours: 3615,
    revenue: 3500,
    agent: 'Aurelius',
  },
];

export const sponsors = ['Anthropic', 'Vercel', 'Pinecone', 'Weaviate', 'n8n', 'Adobe'];
export const agents = ['Aurelius', 'Curie', 'Ogilvy'];

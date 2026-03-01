// Mock data for Editorial MVP UI
export interface VideoIdea {
  id: string;
  title: string;
  angle: string;
  description: string;
  audience_hook: string;
  status: 'brainstorm' | 'under_review' | 'feedback_pending' | 'greenlit' | 'in_production' | 'published' | 'rejected' | 'archived';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  partner_fit: string[];
  agent_origin: string;
  submitted_by_name: string;
  created_at: string;
  updated_at: string;
  greenlit_at?: string;
  greenlit_by?: string;
  estimated_production_hours?: number;
  likes?: number;
}

export interface Note {
  id: string;
  author: string;
  text: string;
  type: 'feedback' | 'approval' | 'rejection';
  created_at: string;
}

export interface ResearchDrop {
  id: string;
  topic: string;
  summary: string;
  key_findings: string[];
  urgency: 'low' | 'medium' | 'high';
  suggested_angles: string[];
  partner_fit: string[];
  agent_origin: string;
  created_at: string;
}

export interface DashboardStats {
  ideas_submitted: number;
  ideas_greenlit: number;
  ideas_published: number;
  ideas_rejected: number;
  avg_time_to_greenlit_days: number;
  agent_contributions: { agent_origin: string; count: number }[];
  trending_tags: { tag: string; count: number }[];
}

// Mock Ideas
export const mockIdeas: VideoIdea[] = [
  {
    id: '1',
    title: 'AI Agents for Solopreneurs',
    angle: 'When to use agents vs. simpler automation — practical decision framework with real examples',
    description: 'Explore the explosion of AI agents and help solopreneurs decide whether they need one. Cover agent frameworks, when simpler automation suffices, and case studies from real businesses.',
    audience_hook: 'Solopreneurs and small teams confused about when to adopt AI agents',
    status: 'brainstorm',
    priority: 'high',
    tags: ['workflow', 'ai-tool', 'business', 'tutorial'],
    partner_fit: ['Anthropic', 'OpenAI', 'Replit'],
    agent_origin: 'aurelius',
    submitted_by_name: 'Aurelius',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
    estimated_production_hours: 4.5,
    likes: 1,
  },
  {
    id: '2',
    title: 'Vector Database Showdown 2026',
    angle: 'Qdrant vs Milvus vs Pinecone — which vector DB wins and why',
    description: 'Deep dive into the latest vector database options. Compare performance, cost, ease of use. Real benchmark data.',
    audience_hook: 'Developers choosing a vector DB for their RAG application',
    status: 'under_review',
    priority: 'high',
    tags: ['technical', 'tool', 'review', 'ai-tool'],
    partner_fit: ['Pinecone', 'Weaviate', 'Qdrant'],
    agent_origin: 'curie',
    submitted_by_name: 'Curie',
    created_at: '2026-02-28T14:30:00Z',
    updated_at: '2026-02-28T14:30:00Z',
    estimated_production_hours: 5,
    likes: 2,
  },
  {
    id: '3',
    title: 'How to Build Your Own AI Tool',
    angle: 'From idea to MVP in 2 hours — clone, customize, deploy',
    description: 'Step-by-step guide to forking an open-source AI tool and shipping your own version. No deep learning required.',
    audience_hook: 'Indie hackers wanting to ship AI products fast',
    status: 'greenlit',
    priority: 'medium',
    tags: ['workflow', 'ai-tool', 'tutorial', 'case-study'],
    partner_fit: ['Vercel', 'Replit', 'GitHub'],
    agent_origin: 'aurelius',
    submitted_by_name: 'Aurelius',
    created_at: '2026-02-25T09:15:00Z',
    updated_at: '2026-02-28T16:45:00Z',
    greenlit_at: '2026-02-28T16:45:00Z',
    greenlit_by: 'Yeeling',
    estimated_production_hours: 2,
    likes: 3,
  },
  {
    id: '4',
    title: 'Prompt Engineering 2026: What Actually Works',
    angle: 'Experiments + data on what prompt techniques actually improve output quality',
    description: 'We tested 50+ prompt techniques. Here\'s what moved the needle and what\'s hype.',
    audience_hook: 'Developers trying to get better results from LLMs without fine-tuning',
    status: 'feedback_pending',
    priority: 'medium',
    tags: ['ai-tool', 'workflow', 'technical', 'tutorial'],
    partner_fit: ['Anthropic', 'OpenAI'],
    agent_origin: 'curie',
    submitted_by_name: 'Curie',
    created_at: '2026-02-26T11:20:00Z',
    updated_at: '2026-02-26T11:20:00Z',
    estimated_production_hours: 3,
    likes: 0,
  },
  {
    id: '5',
    title: 'Building a Media Company with AI',
    angle: 'How we grew Hause from 0 to 35K subscribers in 5 months using AI tools',
    description: 'Behind-the-scenes on our process, tools, economics, and lessons learned.',
    audience_hook: 'Creators wanting to build media businesses more efficiently',
    status: 'published',
    priority: 'high',
    tags: ['business', 'case-study', 'workflow'],
    partner_fit: [],
    agent_origin: 'aurelius',
    submitted_by_name: 'Aurelius',
    created_at: '2026-02-15T08:00:00Z',
    updated_at: '2026-02-20T15:30:00Z',
    greenlit_at: '2026-02-17T10:00:00Z',
    greenlit_by: 'Yeeling',
    estimated_production_hours: 4,
    likes: 5,
  },
];

// Mock Notes
export const mockNotes: { [ideaId: string]: Note[] } = {
  '2': [
    {
      id: 'n1',
      author: 'Yeeling',
      text: 'Love the angle. Can you add benchmark code we can run live?',
      type: 'feedback',
      created_at: '2026-02-28T15:00:00Z',
    },
    {
      id: 'n2',
      author: 'Curie',
      text: 'Updated with benchmarks from Qdrant docs. Added comparison table.',
      type: 'feedback',
      created_at: '2026-02-28T16:30:00Z',
    },
  ],
  '4': [
    {
      id: 'n3',
      author: 'Yeeling',
      text: 'Need more detail on the experimental methodology. How many samples per technique?',
      type: 'feedback',
      created_at: '2026-02-26T14:00:00Z',
    },
  ],
};

// Mock Research Drops
export const mockResearchDrops: ResearchDrop[] = [
  {
    id: 'r1',
    topic: 'Vector DB Tools Trending',
    summary: 'New research shows Qdrant and Milvus gaining significant traction in 2026',
    key_findings: [
      'Qdrant: 40% YoY adoption growth',
      'Milvus: Enterprise preference increasing',
      'Pinecone: Still dominant but market saturation',
      'Cost is now primary decision factor over features',
    ],
    urgency: 'high',
    suggested_angles: [
      'Why teams are switching to Qdrant',
      'Vector DB cost comparison 2026',
      'Choosing your vector database: a flowchart',
    ],
    partner_fit: ['Pinecone', 'Weaviate', 'Qdrant'],
    agent_origin: 'curie',
    created_at: '2026-03-01T09:30:00Z',
  },
  {
    id: 'r2',
    topic: 'Gen Z Creator Economics Shift',
    summary: 'Gen Z creators prioritizing sustainable income over viral growth',
    key_findings: [
      'Median creator income rising: +30% YoY',
      '72% prefer long-form education content',
      'Subscription > AdSense by 3:1 preference',
      'Audience wants transparent monetization',
    ],
    urgency: 'high',
    suggested_angles: [
      'How young creators are building sustainable income',
      'The subscription economy for educators',
      'Why short-form growth is a trap',
    ],
    partner_fit: ['Substack', 'Patreon', 'Circle'],
    agent_origin: 'curie',
    created_at: '2026-02-28T14:15:00Z',
  },
  {
    id: 'r3',
    topic: 'LLM API Pricing Wars',
    summary: 'Major price drops from OpenAI, Anthropic, and Meta — what it means for margins',
    key_findings: [
      'OpenAI GPT-4 price dropped 30%',
      'Anthropic launching cheaper model tier',
      'Meta open-sourcing competitive models',
      'Margins tightening for app builders',
    ],
    urgency: 'medium',
    suggested_angles: [
      'Is AI software viable anymore? New economics',
      'Building with open-source vs paid APIs',
    ],
    partner_fit: ['Anthropic', 'OpenAI'],
    agent_origin: 'curie',
    created_at: '2026-02-27T10:00:00Z',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  ideas_submitted: 12,
  ideas_greenlit: 3,
  ideas_published: 2,
  ideas_rejected: 0,
  avg_time_to_greenlit_days: 4.2,
  agent_contributions: [
    { agent_origin: 'aurelius', count: 6 },
    { agent_origin: 'curie', count: 4 },
    { agent_origin: 'ogilvy', count: 2 },
  ],
  trending_tags: [
    { tag: 'ai-tool', count: 8 },
    { tag: 'workflow', count: 6 },
    { tag: 'business', count: 4 },
  ],
};

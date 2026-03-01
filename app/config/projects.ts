export interface Project {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  status: 'live' | 'in-dev' | 'maintenance' | 'backlog';
  url: string;
  category: 'partnerships' | 'editorial' | 'platform' | 'design' | 'production';
  owner?: string;
  lastUpdated: string;
  actions: {
    label: string;
    url: string;
    isPrimary?: boolean;
  }[];
}

export const PROJECTS: Project[] = [
  {
    id: 'partnerships',
    name: 'Hause Partnerships',
    emoji: '🤝',
    tagline: 'Media kit & sponsor offerings',
    status: 'live',
    url: 'https://hause-partnerships.vercel.app/',
    category: 'partnerships',
    owner: 'Yeeling',
    lastUpdated: '2026-03-01T09:30:00Z',
    actions: [
      {
        label: 'View Live',
        url: 'https://hause-partnerships.vercel.app/',
        isPrimary: true,
      },
      {
        label: 'Edit Content',
        url: 'https://github.com/HauseOS/hause-partnerships',
      },
    ],
  },
  {
    id: 'editorial',
    name: 'Hause Editorial',
    emoji: '✏️',
    tagline: 'Content ideas, research, publishing platform',
    status: 'live',
    url: 'https://hause.vercel.app/',
    category: 'editorial',
    owner: 'Anders',
    lastUpdated: '2026-02-28T14:15:00Z',
    actions: [
      {
        label: 'View Live',
        url: 'https://hause.vercel.app/',
        isPrimary: true,
      },
      {
        label: 'Editorial Board',
        url: '/editorial/ideas',
      },
    ],
  },
  {
    id: 'design-system',
    name: 'Hause Design System',
    emoji: '🎨',
    tagline: 'Design tokens, components, reference site',
    status: 'live',
    url: 'https://hause-design-system.vercel.app/',
    category: 'design',
    owner: 'Shared',
    lastUpdated: '2026-03-01T08:45:00Z',
    actions: [
      {
        label: 'View Site',
        url: 'https://hause-design-system.vercel.app/',
        isPrimary: true,
      },
      {
        label: 'Documentation',
        url: 'https://github.com/HauseOS/hause-design-system',
      },
    ],
  },
  {
    id: 'hauseops',
    name: 'HauseOS',
    emoji: '⚙️',
    tagline: 'Central operations hub, editorial brainstorm, automations',
    status: 'in-dev',
    url: 'https://hause-ops.vercel.app/',
    category: 'platform',
    owner: 'Shared',
    lastUpdated: '2026-03-01T11:00:00Z',
    actions: [
      {
        label: 'Projects',
        url: '/',
        isPrimary: true,
      },
      {
        label: 'Editorial',
        url: '/editorial/ideas',
      },
      {
        label: 'Dashboard',
        url: '/editorial',
      },
    ],
  },
];

export const BACKLOG_PROJECTS = [
  {
    emoji: '🎬',
    name: 'Video Production Hub',
    description: 'Track shoots, editing, publish queue',
  },
  {
    emoji: '📊',
    name: 'Analytics Dashboard',
    description: 'YouTube metrics + audience insights',
  },
  {
    emoji: '💼',
    name: 'Sponsor CRM',
    description: 'Partnership pipeline + outreach',
  },
];

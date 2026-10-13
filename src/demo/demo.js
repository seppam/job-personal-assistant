// Offline demo mode (VITE_DEMO_MODE=true): no Clerk sign-in, no AI keys and no
// network calls. Everything below is fictional sample data for screenshots/demos.
export const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

export const demoUser = { id: 'demo-user', firstName: 'Alex', primaryEmailAddress: { emailAddress: 'alex.demo@example.com' } };

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString();

export const demoState = {
  config: {
    geminiKey: 'demo-mode-placeholder',
    anthropicKey: '',
    mongoUri: '',
    atlasAppId: '',
    atlasApiKey: '',
    preferredModel: 'gemini-2.5-flash',
    isInitialized: true,
    isRateLimited: false,
    rateLimitExpiry: null,
    envLocks: { geminiKey: false, anthropicKey: false, mongoUri: false, atlasAppId: false, atlasApiKey: false },
  },
  jobs: {
    columns: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
    jobs: [
      { id: 'j1', title: 'Frontend Engineer', company: 'Northwind Labs', status: 'Wishlist', score: 91, verdict: 'Legit', link: '', createdAt: daysAgo(2) },
      { id: 'j2', title: 'React Developer', company: 'Lumen Studio', status: 'Wishlist', score: 84, verdict: 'Legit', link: '', createdAt: daysAgo(3) },
      { id: 'j3', title: 'Full-Stack Engineer', company: 'Acme Robotics', status: 'Applied', score: 88, verdict: 'Legit', link: '', createdAt: daysAgo(6) },
      { id: 'j4', title: 'Web Developer (Remote)', company: 'QuickHire Global', status: 'Applied', score: 32, verdict: 'High Risk', link: '', createdAt: daysAgo(7) },
      { id: 'j5', title: 'UI Engineer', company: 'Fabrikam Digital', status: 'Interviewing', score: 93, verdict: 'Legit', link: '', createdAt: daysAgo(12) },
      { id: 'j6', title: 'Software Engineer II', company: 'Contoso Cloud', status: 'Offer', score: 95, verdict: 'Legit', link: '', createdAt: daysAgo(20) },
      { id: 'j7', title: 'Junior Developer', company: 'Globex Corp', status: 'Rejected', score: 70, verdict: 'Suspicious', link: '', createdAt: daysAgo(25) },
    ],
  },
  profile: {
    firstName: 'Alex',
    email: 'alex.demo@example.com',
    currentRole: 'Frontend Developer',
    targetRole: 'Senior Full-Stack Engineer',
    yearsExperience: '3',
    topSkills: 'React, TypeScript, Node.js, Tailwind CSS',
    careerGoal: 'Move into a full-stack role on a product team within 12 months.',
  },
  cv: {
    personal: {
      name: 'Alex Demo',
      email: 'alex.demo@example.com',
      phone: '+00 000 0000 0000',
      location: 'Sample City',
      summary: 'Frontend developer with 3 years of experience building React applications, dashboards and design systems.',
    },
    experience: [
      { id: 'e1', company: 'Example Studio', role: 'Frontend Developer', dates: '2023 - Present', bullets: 'Built a component library used by 4 product teams.\nCut bundle size by 35% with code splitting and lazy loading.' },
      { id: 'e2', company: 'Sample Agency', role: 'Junior Web Developer', dates: '2021 - 2023', bullets: 'Delivered 12 client websites with React and Node.js.\nIntroduced unit testing and CI checks.' },
    ],
    education: [],
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Testing'],
    projects: [],
    targetJD: 'Senior Full-Stack Engineer: own features end to end with React, Node.js and PostgreSQL. Experience with testing, CI/CD, API design and mentoring required.',
  },
};

export const demoScan = {
  score: 34,
  verdict: 'High Risk',
  flags: [
    'Asks for a "registration fee" before the interview',
    'Contact only through a free messaging account',
    'Salary far above market for the stated seniority',
    'Company website was registered 3 weeks ago',
  ],
  recommendation: 'Do not share personal documents or pay any fee. Verify the company through its official site and a LinkedIn page with real employees before replying. (Sample output from offline demo mode.)',
};

export const demoMatch = {
  matchScore: 76,
  strengths: ['Strong React and TypeScript background', 'Experience with testing and CI', 'Shipped shared component libraries'],
  gaps: ['No PostgreSQL or SQL experience listed', 'Limited API design examples', 'No mentoring experience mentioned'],
  preppMode: 'Prepare a short story about an API you designed and be ready to discuss database modelling. (Sample output from offline demo mode.)',
};

export const demoRoadmap = [
  { title: 'Learn relational databases', description: 'Model a small schema in PostgreSQL and practise joins, indexes and migrations.', suggestedProject: 'Job tracker API backed by PostgreSQL', estimatedWeeks: 3 },
  { title: 'Design a REST API', description: 'Practise resource naming, pagination, validation and error handling.', suggestedProject: 'Node.js API with OpenAPI docs', estimatedWeeks: 2 },
  { title: 'Add automated testing', description: 'Cover the API with integration tests and run them in CI.', suggestedProject: 'GitHub Actions pipeline with tests', estimatedWeeks: 2 },
  { title: 'Deploy end to end', description: 'Containerise and deploy the app with monitoring and rollbacks.', suggestedProject: 'Dockerised full-stack deployment', estimatedWeeks: 2 },
  { title: 'Practise mentoring', description: 'Review code for a junior teammate or open-source newcomer and write up the lessons.', suggestedProject: 'Code review guide for the team', estimatedWeeks: 2 },
];

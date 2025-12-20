// List of common tech-related keywords to bold
export const TECH_KEYWORDS = [
  
  // Programming Languages
  "HTML",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Golang",
  "Rust",
  "Swift",
  "Kotlin",
  "PHP",
  "Scala",
  "R",
  "MATLAB",
  "Perl",
  "Haskell",
  "Clojure",
  "Elixir",
  "Dart",
  "Lua",
  "Shell",
  "Bash",
  "PowerShell",
  "SQL",
  "NoSQL",
  "GraphQL",

  // Frontend Frameworks & Libraries
  "React",
  "React.js",
  "ReactJS",
  "Next.js",
  "NextJS",
  "Vue",
  "Vue.js",
  "VueJS",
  "Angular",
  "AngularJS",
  "Svelte",
  "SvelteKit",
  "Nuxt",
  "Nuxt.js",
  "Gatsby",
  "Remix",
  "Astro",
  "Solid",
  "SolidJS",
  "Qwik",
  "Preact",
  "jQuery",
  "Backbone.js",
  "Ember.js",

  // Backend Frameworks
  "Node.js",
  "NodeJS",
  "Express",
  "Express.js",
  "NestJS",
  "Fastify",
  "Koa",
  "Django",
  "Flask",
  "FastAPI",
  "Rails",
  "Ruby on Rails",
  "Spring",
  "Spring Boot",
  "Laravel",
  "Symfony",
  "ASP.NET",
  ".NET",
  "Gin",
  "Echo",
  "Fiber",

  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Firebase",
  "Firestore",
  "Supabase",
  "PlanetScale",
  "CockroachDB",
  "MariaDB",
  "Oracle",
  "Neo4j",
  "Elasticsearch",
  "InfluxDB",
  "TimescaleDB",
  "Prisma",
  "Drizzle",

  // Cloud & DevOps
  "AWS",
  "Amazon Web Services",
  "Azure",
  "Google Cloud",
  "GCP",
  "Vercel",
  "Netlify",
  "Heroku",
  "DigitalOcean",
  "Cloudflare",
  "Docker",
  "Kubernetes",
  "K8s",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "CircleCI",
  "Travis CI",
  "ArgoCD",

  // Tools & Technologies
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "npm",
  "yarn",
  "pnpm",
  "Webpack",
  "Vite",
  "Rollup",
  "Parcel",
  "esbuild",
  "SWC",
  "Babel",
  "ESLint",
  "Prettier",
  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Selenium",
  "Postman",
  "Insomnia",

  // CSS & Styling
  "CSS",
  "Sass",
  "SCSS",
  "Less",
  "Tailwind",
  "TailwindCSS",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
  "MUI",
  "Chakra UI",
  "Styled Components",
  "Emotion",
  "CSS Modules",
  "PostCSS",
  "Ant Design",
  "Shadcn",

  // State Management & Data
  "Redux",
  "MobX",
  "Zustand",
  "Recoil",
  "Jotai",
  "XState",
  "React Query",
  "TanStack Query",
  "SWR",
  "Apollo",
  "Apollo Client",
  "Relay",
  "tRPC",
  "REST",
  "RESTful",
  "API",
  "APIs",
  "WebSocket",
  "WebSockets",
  "gRPC",

  // Mobile Development
  "React Native",
  "Flutter",
  "Ionic",
  "Xamarin",
  "Cordova",
  "Capacitor",
  "Expo",
  "SwiftUI",
  "UIKit",
  "Jetpack Compose",
  "Android",
  "iOS",

  // AI/ML
  "TensorFlow",
  "PyTorch",
  "Keras",
  "scikit-learn",
  "OpenAI",
  "GPT",
  "ChatGPT",
  "LLM",
  "LLMs",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "Computer Vision",
  "Neural Network",
  "Hugging Face",
  "LangChain",
  "OpenCV",

  // Other
  "Agile",
  "Scrum",
  "Kanban",
  "CI/CD",
  "DevOps",
  "Microservices",
  "Serverless",
  "JAMstack",
  "PWA",
  "SPA",
  "SSR",
  "SSG",
  "ISR",
  "OAuth",
  "JWT",
  "SAML",
  "WebRTC",
  "Blockchain",
  "Web3",
  "Solidity",
  "Ethereum",
  "Linux",
  "Unix",
  "Windows",
  "macOS",
  "Ubuntu",
  "CentOS",
  "Nginx",
  "Apache",
  "Figma",
  "Sketch",
  "Adobe XD",
  "Zeplin",
  "Storybook",
  "Notion",
  "Jira",
  "Confluence",
  "Slack",
  "VS Code",
  "Visual Studio",
  "IntelliJ",
  "Vim",
  "Neovim",
]

// Create a case-insensitive regex pattern for matching tech keywords
export function createTechRegex(): RegExp {
  const escapedKeywords = TECH_KEYWORDS.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  // Sort by length descending to match longer phrases first (e.g., "React Native" before "React")
  escapedKeywords.sort((a, b) => b.length - a.length)
  return new RegExp(`\\b(${escapedKeywords.join("|")})\\b`, "gi")
}

// Parse text and return array of segments (text or bold tech words)
export function parseTextWithTechKeywords(text: string): Array<{ text: string; isTech: boolean }> {
  if (!text) return []

  const regex = createTechRegex()
  const segments: Array<{ text: string; isTech: boolean }> = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isTech: false,
      })
    }
    // Add the tech keyword
    segments.push({
      text: match[0],
      isTech: true,
    })
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isTech: false,
    })
  }

  return segments
}

import { Cloud, Languages, Database, GitBranch, Binary, Palette, Brain, Network, Cpu, ShieldAlert, GitMerge, Terminal, type LucideIcon } from "lucide-react"

export type Subject = {
  id: string
  slug: string
  name: string
  fullName: string
  tagline: string
  description: string
  icon: LucideIcon
  gradient: string
  colorFrom: string
  colorTo: string
  progress: number
  totalLessons: number
  completedLessons: number
  hours: number
  level: string
  modules: Module[]
}

export type Module = {
  id: string
  title: string
  description: string
  lessons: number
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  progress: number
  locked?: boolean
}

const iconMap: Record<string, LucideIcon> = {
  Cloud,
  Languages,
  Database,
  GitBranch,
  Binary,
  Palette,
  Brain,
  Network,
  Cpu,
  ShieldAlert,
  GitMerge,
  Terminal
};

export const subjects: Subject[] = [
  {
    id: "git-github",
    slug: "git-and-github",
    name: "Git & GitHub",
    fullName: "Git & GitHub for Developers",
    tagline: "Version control and collaborative coding",
    description: "Go from Git novice to pro. Master commits, branching strategies, pull requests, collaborative workflows, and conflict resolution.",
    icon: iconMap["GitMerge"],
    gradient: "icon-gradient-git",
    colorFrom: "from-violet-400",
    colorTo: "to-indigo-500",
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    hours: 10,
    level: "Beginner",
    modules: [
      {
        id: "git-github-1",
        title: "Git Module 1 (Days 1-5)",
        description: "Learn the core principles and hands-on practices for Days 1 to 5",
        lessons: 5,
        duration: "5h 00m",
        difficulty: "Beginner",
        progress: 0
      },
      {
        id: "git-github-2",
        title: "Git Module 2 (Days 6-10)",
        description: "Learn the core principles and hands-on practices for Days 6 to 10",
        lessons: 5,
        duration: "5h 00m",
        difficulty: "Beginner",
        progress: 0
      },
    ]
  },
  {
    id: "fe",
    slug: "fe",
    name: "基本情報",
    fullName: "基本情報技術者試験 (FE)",
    tagline: "日本のIT資格 được master",
    description: "Master the Japanese Fundamental Information Technology Engineer Examination. Covers algorithms, hardware, networks, databases, and project management.",
    icon: iconMap["Palette"],
    gradient: "icon-gradient-fe",
    colorFrom: "from-blue-500",
    colorTo: "to-indigo-600",
    progress: 0,
    totalLessons: 100,
    completedLessons: 0,
    hours: 100,
    level: "Advanced",
    modules: [
      {
        id: "fe-phase-01-computer-science-basics",
        title: "Phase 1: Computer Science Basics",
        description: "Master all lessons in phase 1: computer science basics",
        lessons: 20,
        duration: "24h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-02-algorithm-programming",
        title: "Phase 2: Algorithm Programming",
        description: "Master all lessons in phase 2: algorithm programming",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-03-core-infrastructure",
        title: "Phase 3: Core Infrastructure",
        description: "Master all lessons in phase 3: core infrastructure",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-04-software-engineering",
        title: "Phase 4: Software Engineering",
        description: "Master all lessons in phase 4: software engineering",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-05-advanced-systems-network",
        title: "Phase 5: Advanced Systems Network",
        description: "Master all lessons in phase 5: advanced systems network",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-06-database-engineering",
        title: "Phase 6: Database Engineering",
        description: "Master all lessons in phase 6: database engineering",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-07-software-engineering",
        title: "Phase 7: Software Engineering",
        description: "Master all lessons in phase 7: software engineering",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-08-management-strategy",
        title: "Phase 8: Management Strategy",
        description: "Master all lessons in phase 8: management strategy",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-09-advanced-math",
        title: "Phase 9: Advanced Math",
        description: "Master all lessons in phase 9: advanced math",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-10-final-review",
        title: "Phase 10: Final Review",
        description: "Master all lessons in phase 10: final review",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-11-management-master",
        title: "Phase 11: Management Master",
        description: "Master all lessons in phase 11: management master",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-12-security-master",
        title: "Phase 12: Security Master",
        description: "Master all lessons in phase 12: security master",
        lessons: 5,
        duration: "6h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "fe-phase-13-cloud-security-master",
        title: "Phase 13: Cloud Security Master",
        description: "Master all lessons in phase 13: cloud security master",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Advanced",
        progress: 0
      },
    ]
  },
  {
    id: "aws",
    slug: "aws",
    name: "AWS",
    fullName: "Amazon Web Services",
    tagline: "Master the cloud, scale infinitely",
    description: "Build, deploy, and scale production applications on the world's leading cloud platform. From EC2 to Lambda, master 200+ AWS services.",
    icon: iconMap["Cloud"],
    gradient: "icon-gradient-aws",
    colorFrom: "from-orange-400",
    colorTo: "to-amber-500",
    progress: 0,
    totalLessons: 60,
    completedLessons: 0,
    hours: 60,
    level: "Intermediate",
    modules: [
      {
        id: "aws-1",
        title: "AWS Module 1 (Days 1-10)",
        description: "Learn the core principles and hands-on practices for Days 1 to 10",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "aws-2",
        title: "AWS Module 2 (Days 11-20)",
        description: "Learn the core principles and hands-on practices for Days 11 to 20",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "aws-3",
        title: "AWS Module 3 (Days 21-30)",
        description: "Learn the core principles and hands-on practices for Days 21 to 30",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "aws-4",
        title: "AWS Module 4 (Days 31-40)",
        description: "Learn the core principles and hands-on practices for Days 31 to 40",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "aws-5",
        title: "AWS Module 5 (Days 41-50)",
        description: "Learn the core principles and hands-on practices for Days 41 to 50",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "aws-6",
        title: "AWS Module 6 (Days 51-60)",
        description: "Learn the core principles and hands-on practices for Days 51 to 60",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
    ]
  },
  {
    id: "database",
    slug: "database-engineering",
    name: "Database",
    fullName: "Database Engineering & SQL",
    tagline: "Design, query, and optimize relational databases",
    description: "Learn schema design, advanced SQL querying, indexing strategies, transaction isolation levels, and performance tuning for production databases.",
    icon: iconMap["Database"],
    gradient: "icon-gradient-database",
    colorFrom: "from-emerald-400",
    colorTo: "to-teal-500",
    progress: 0,
    totalLessons: 30,
    completedLessons: 0,
    hours: 30,
    level: "Advanced",
    modules: [
      {
        id: "database-1",
        title: "Database Module 1 (Days 1-10)",
        description: "Learn the core principles and hands-on practices for Days 1 to 10",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "database-2",
        title: "Database Module 2 (Days 11-20)",
        description: "Learn the core principles and hands-on practices for Days 11 to 20",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "database-3",
        title: "Database Module 3 (Days 21-30)",
        description: "Learn the core principles and hands-on practices for Days 21 to 30",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Advanced",
        progress: 0
      },
    ]
  },
  {
    id: "bjt",
    slug: "business-japanese-test",
    name: "BJT",
    fullName: "Business Japanese Test (BJT)",
    tagline: "Master professional Japanese for career success",
    description: "Unlock high-level corporate Japanese. Practice honorifics (keigo), email etiquette, meetings protocols, and business customs for Japanese workplaces.",
    icon: iconMap["Languages"],
    gradient: "icon-gradient-bjt",
    colorFrom: "from-pink-400",
    colorTo: "to-rose-500",
    progress: 0,
    totalLessons: 119,
    completedLessons: 0,
    hours: 119,
    level: "Intermediate",
    modules: [
      {
        id: "bjt-1",
        title: "BJT Module 1 (Days 1-20)",
        description: "Learn the core principles and hands-on practices for Days 1 to 20",
        lessons: 20,
        duration: "20h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "bjt-2",
        title: "BJT Module 2 (Days 21-40)",
        description: "Learn the core principles and hands-on practices for Days 21 to 40",
        lessons: 20,
        duration: "20h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "bjt-3",
        title: "BJT Module 3 (Days 41-60)",
        description: "Learn the core principles and hands-on practices for Days 41 to 60",
        lessons: 20,
        duration: "20h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "bjt-4",
        title: "BJT Module 4 (Days 61-80)",
        description: "Learn the core principles and hands-on practices for Days 61 to 80",
        lessons: 20,
        duration: "20h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "bjt-5",
        title: "BJT Module 5 (Days 81-100)",
        description: "Learn the core principles and hands-on practices for Days 81 to 100",
        lessons: 20,
        duration: "20h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "bjt-6",
        title: "BJT Module 6 (Days 101-119)",
        description: "Learn the core principles and hands-on practices for Days 101 to 119",
        lessons: 19,
        duration: "19h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
    ]
  },
  {
    id: "devops",
    slug: "devops-engineering",
    name: "DevOps",
    fullName: "DevOps & Cloud Infrastructure",
    tagline: "Automate, deploy, and monitor like a pro",
    description: "Bridge the gap between dev and ops. Learn Docker containers, Kubernetes orchestration, CI/CD pipelines, Infrastructure as Code, and monitoring.",
    icon: iconMap["GitBranch"],
    gradient: "icon-gradient-devops",
    colorFrom: "from-cyan-400",
    colorTo: "to-blue-500",
    progress: 0,
    totalLessons: 60,
    completedLessons: 0,
    hours: 60,
    level: "Intermediate",
    modules: [
      {
        id: "devops-1",
        title: "DevOps Module 1 (Days 1-10)",
        description: "Learn the core principles and hands-on practices for Days 1 to 10",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "devops-2",
        title: "DevOps Module 2 (Days 11-20)",
        description: "Learn the core principles and hands-on practices for Days 11 to 20",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "devops-3",
        title: "DevOps Module 3 (Days 21-30)",
        description: "Learn the core principles and hands-on practices for Days 21 to 30",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "devops-4",
        title: "DevOps Module 4 (Days 31-40)",
        description: "Learn the core principles and hands-on practices for Days 31 to 40",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "devops-5",
        title: "DevOps Module 5 (Days 41-50)",
        description: "Learn the core principles and hands-on practices for Days 41 to 50",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "devops-6",
        title: "DevOps Module 6 (Days 51-60)",
        description: "Learn the core principles and hands-on practices for Days 51 to 60",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
    ]
  },
  {
    id: "system-design",
    slug: "system-design",
    name: "System Design",
    fullName: "System Design & Architecture",
    tagline: "Build highly scalable, reliable systems",
    description: "Learn to design large-scale systems. Covers load balancing, caching, databases replication, microservices, message queues, and real-world case studies.",
    icon: iconMap["Network"],
    gradient: "icon-gradient-sysdesign",
    colorFrom: "from-red-400",
    colorTo: "to-rose-500",
    progress: 0,
    totalLessons: 60,
    completedLessons: 0,
    hours: 60,
    level: "Advanced",
    modules: [
      {
        id: "system-design-phase-01-foundations",
        title: "Phase 1: Foundations",
        description: "Master all lessons in phase 1: foundations",
        lessons: 15,
        duration: "18h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "system-design-phase-02-scalability-reliability",
        title: "Phase 2: Scalability Reliability",
        description: "Master all lessons in phase 2: scalability reliability",
        lessons: 15,
        duration: "18h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "system-design-phase-03-microservices-deep-dive",
        title: "Phase 3: Microservices Deep Dive",
        description: "Master all lessons in phase 3: microservices deep dive",
        lessons: 15,
        duration: "18h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "system-design-phase-04-real-world-case-studies",
        title: "Phase 4: Real World Case Studies",
        description: "Master all lessons in phase 4: real world case studies",
        lessons: 15,
        duration: "18h 00m",
        difficulty: "Advanced",
        progress: 0
      },
    ]
  },
  {
    id: "dsa",
    slug: "data-structures-and-algorithms",
    name: "DSA",
    fullName: "Data Structures & Algorithms",
    tagline: "Crack the coding interview and optimize code",
    description: "Master essential data structures and algorithms. From arrays and lists to trees, graphs, dynamic programming, and space-time complexity analysis.",
    icon: iconMap["Binary"],
    gradient: "icon-gradient-dsa",
    colorFrom: "from-purple-400",
    colorTo: "to-violet-500",
    progress: 0,
    totalLessons: 60,
    completedLessons: 0,
    hours: 60,
    level: "Intermediate",
    modules: [
      {
        id: "dsa-1",
        title: "DSA Module 1 (Days 1-10)",
        description: "Learn the core principles and hands-on practices for Days 1 to 10",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "dsa-2",
        title: "DSA Module 2 (Days 11-20)",
        description: "Learn the core principles and hands-on practices for Days 11 to 20",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "dsa-3",
        title: "DSA Module 3 (Days 21-30)",
        description: "Learn the core principles and hands-on practices for Days 21 to 30",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "dsa-4",
        title: "DSA Module 4 (Days 31-40)",
        description: "Learn the core principles and hands-on practices for Days 31 to 40",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "dsa-5",
        title: "DSA Module 5 (Days 41-50)",
        description: "Learn the core principles and hands-on practices for Days 41 to 50",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "dsa-6",
        title: "DSA Module 6 (Days 51-60)",
        description: "Learn the core principles and hands-on practices for Days 51 to 60",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
    ]
  },
  {
    id: "mindset",
    slug: "developer-mindset",
    name: "Mindset",
    fullName: "Developer Mindset & Career Growth",
    tagline: "Be more than just a coder",
    description: "Grow your soft skills, engineering culture, agile practices, project management methodologies, technical communication, and leadership skills.",
    icon: iconMap["Brain"],
    gradient: "icon-gradient-mindset",
    colorFrom: "from-yellow-400",
    colorTo: "to-amber-500",
    progress: 0,
    totalLessons: 30,
    completedLessons: 0,
    hours: 30,
    level: "All Levels",
    modules: [
      {
        id: "mindset-phase-01-transformation",
        title: "Phase 1: Transformation",
        description: "Master all lessons in phase 1: transformation",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "mindset-phase-02-social-api",
        title: "Phase 2: Social Api",
        description: "Master all lessons in phase 2: social api",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "mindset-phase-03-influence",
        title: "Phase 3: Influence",
        description: "Master all lessons in phase 3: influence",
        lessons: 10,
        duration: "12h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
    ]
  },
  {
    id: "cybersecurity-awareness",
    slug: "cybersecurity-awareness",
    name: "Security",
    fullName: "Cybersecurity Awareness & Defense",
    tagline: "Secure systems, analyze threats, defend networks",
    description: "Understand the security landscape. Learn about common vulnerabilities (OWASP Top 10), penetration testing basics, cryptography, and network defense.",
    icon: iconMap["ShieldAlert"],
    gradient: "icon-gradient-cyber",
    colorFrom: "from-red-500",
    colorTo: "to-red-700",
    progress: 0,
    totalLessons: 15,
    completedLessons: 0,
    hours: 15,
    level: "Beginner",
    modules: [
      {
        id: "cybersecurity-awareness-1",
        title: "Security Module 1 (Days 1-5)",
        description: "Learn the core principles and hands-on practices for Days 1 to 5",
        lessons: 5,
        duration: "5h 00m",
        difficulty: "Beginner",
        progress: 0
      },
      {
        id: "cybersecurity-awareness-2",
        title: "Security Module 2 (Days 6-10)",
        description: "Learn the core principles and hands-on practices for Days 6 to 10",
        lessons: 5,
        duration: "5h 00m",
        difficulty: "Beginner",
        progress: 0
      },
      {
        id: "cybersecurity-awareness-3",
        title: "Security Module 3 (Days 11-15)",
        description: "Learn the core principles and hands-on practices for Days 11 to 15",
        lessons: 5,
        duration: "5h 00m",
        difficulty: "Beginner",
        progress: 0
      },
    ]
  },
  {
    id: "blockchain-and-web3-fundamentals",
    slug: "blockchain-and-web3-fundamentals",
    name: "Blockchain",
    fullName: "Blockchain & Web3 Fundamentals",
    tagline: "Decentralize the future",
    description: "Understand blockchain mechanics, cryptography, smart contracts, Ethereum Virtual Machine, decentralized finance (DeFi), and consensus protocols.",
    icon: iconMap["Cpu"],
    gradient: "icon-gradient-blockchain",
    colorFrom: "from-yellow-500",
    colorTo: "to-orange-500",
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    hours: 20,
    level: "Beginner",
    modules: [
      {
        id: "blockchain-and-web3-fundamentals-1",
        title: "Blockchain Module 1 (Days 1-10)",
        description: "Learn the core principles and hands-on practices for Days 1 to 10",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Beginner",
        progress: 0
      },
      {
        id: "blockchain-and-web3-fundamentals-2",
        title: "Blockchain Module 2 (Days 11-20)",
        description: "Learn the core principles and hands-on practices for Days 11 to 20",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Beginner",
        progress: 0
      },
    ]
  },
  {
    id: "python",
    slug: "python",
    name: "Python",
    fullName: "Python, Machine Learning, Deep Learning & Web API",
    tagline: "From syntax to neural networks, client-side Wasm runtime",
    description: "Master Python programming from scratch. Transition to advanced machine learning and deep learning using interactive browser-based exercises.",
    icon: iconMap["Terminal"],
    gradient: "icon-gradient-python",
    colorFrom: "from-blue-500",
    colorTo: "to-yellow-500",
    progress: 0,
    totalLessons: 50,
    completedLessons: 0,
    hours: 50,
    level: "Advanced",
    modules: [
      {
        id: "python-basics",
        title: "Python Basics",
        description: "Master python basic syntax and fundamentals",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Beginner",
        progress: 0
      },
      {
        id: "python-ml",
        title: "Machine Learning",
        description: "Introduction to regression, classification and scikit-learn",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Intermediate",
        progress: 0
      },
      {
        id: "python-dl",
        title: "Deep Learning",
        description: "Neural networks, backpropagation and basic PyTorch models",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "python-advanced",
        title: "Advanced Python",
        description: "Master advanced Python features like decorators, generators, asyncio, metaprogramming",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Advanced",
        progress: 0
      },
      {
        id: "python-fastapi",
        title: "FastAPI Web API",
        description: "Build high-performance REST APIs with FastAPI, Pydantic, SQLAlchemy and JWT authentication",
        lessons: 10,
        duration: "10h 00m",
        difficulty: "Advanced",
        progress: 0
      }
    ]
  },
];

export type OverallStats = {
  totalLessons: number
  completedLessons: number
  totalSubjects: number
  inProgressSubjects: number
  totalHours: number
  averageProgress: number
  perSubjectProgress: number[]
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find((s) => s.slug === slug)
}

export type SubjectStats = {
  totalLessons: number
  completedLessons: number
  progress: number
  totalMinutes: number
  hours: number
  minutes: number
  moduleCount: number
  completedModules: number
}

function parseDurationToMinutes(duration: string): number {
  let minutes = 0
  const hMatch = duration.match(/(\d+)\s*h/)
  const mMatch = duration.match(/(\d+)\s*m/)
  if (hMatch) minutes += Number.parseInt(hMatch[1], 10) * 60
  if (mMatch) minutes += Number.parseInt(mMatch[1], 10)
  return minutes
}

export function computeSubjectStats(subject: Subject): SubjectStats {
  const totalLessons = subject.modules.reduce((sum, m) => sum + m.lessons, 0)
  const completedLessons = subject.modules.reduce(
    (sum, m) => sum + Math.round((m.lessons * m.progress) / 100),
    0,
  )
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalMinutes = subject.modules.reduce((sum, m) => sum + parseDurationToMinutes(m.duration), 0)
  const completedModules = subject.modules.filter((m) => m.progress === 100).length

  return {
    totalLessons,
    completedLessons,
    progress,
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    moduleCount: subject.modules.length,
    completedModules,
  }
}

export function computeOverallStats(): OverallStats {
  const stats = subjects.map(s => computeSubjectStats(s))
  
  const totalLessons = stats.reduce((sum, s) => sum + s.totalLessons, 0)
  const completedLessons = stats.reduce((sum, s) => sum + s.completedLessons, 0)
  const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0)
  
  const inProgressSubjects = stats.filter(s => s.progress > 0 && s.progress < 100).length
  const averageProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  
  return {
    totalLessons,
    completedLessons,
    totalSubjects: subjects.length,
    inProgressSubjects,
    totalHours: Math.round(totalMinutes / 60),
    averageProgress,
    perSubjectProgress: stats.map(s => s.progress)
  }
}

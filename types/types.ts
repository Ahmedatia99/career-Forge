export type LoginFormData = {
	email: string;
	password: string;
};

export type RegisterFormData = {
	email: string;
	password: string;
	confirmedPassword: string;
};
export interface UserLink {
  id:string
  label: string;
  url: string;
}
export interface UserProfile {
  firstName: string
  lastName: string
  headline: string
  email: string
  phone: string
  country: string
   links?: UserLink[];
  profilePicture?: string
}


export interface WorkExperience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Project {
  id: string
  title: string
  description: string
  url?: string
  technologies: string[]
}

export interface Language {
  id: string
  name: string
  proficiency: string
}
export interface Certification {
  id: string
  name: string
  company?: string
  startDate: string
  description:string
  url?: string
}

export interface Skill {
  id: string
  category: string
  skills: string[]
}

export interface CV {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  personalInfo?: UserProfile
  professionalSummary?: string
  workExperience?: WorkExperience[]
  education?: Education[]
  skills?: Skill[]
  projects?: Project[]
  languages?: Language[]
  certifications?: Certification[]
  template: string
}

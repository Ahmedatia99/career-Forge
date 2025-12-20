export type LoginFormData = {
	email: string;
	password: string;
};

export type RegisterFormData = {
	email: string;
	password: string;
	confirmedPassword: string;
};

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
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

export interface CV {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  personalInfo: UserProfile
  professionalSummary: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  languages: Language[]
  template: string
}

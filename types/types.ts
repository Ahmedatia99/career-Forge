import { ProfileSetting } from "./user-types";

export type RegisterFormData = {
	email: string;
	password: string;
  firstName: string;
  lastName: string;
};

export interface ResetPassword {
  token: string;
  newPassword: string;
}
export interface UserLink {
  id:string
  label: string;
  url: string;
}
export interface UserProfile {
  profileSetting: ProfileSetting
  headline: string
  links?: UserLink[];
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

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    role: string;
  };
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

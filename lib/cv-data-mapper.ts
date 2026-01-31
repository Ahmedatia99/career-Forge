/**
 * CV Data Mapper
 * 
 * Maps backend CV response to frontend CV form structure
 * The backend may return parsed CV data in different formats
 */

import type { CV, UserProfile, WorkExperience, Education, Skill, Project, Language, Certification, UserLink } from "@/types/types";

// Generate a unique ID for items that don't have one
let counter = 0;
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `id-${Date.now()}-${++counter}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Backend CV response structure (from parsing)
 */
interface BackendCV {
  _id?: string;
  id?: string;
  title?: string;
  fileName?: string;
  content?: any;
  parsedContent?: any;
  parsedData?: any;
  parsingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Direct fields (might be at root or nested)
  personalInfo?: any;
  professionalSummary?: string;
  summary?: string;
  workExperience?: any[];
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
  languages?: any[];
  certifications?: any[];
  template?: string;
}

/**
 * Map a single work experience item
 */
function mapWorkExperience(exp: any, index: number): WorkExperience {
  return {
    id: exp.id || exp._id || generateId(),
    title: exp.title || exp.position || exp.jobTitle || '',
    company: exp.company || exp.organization || exp.employer || '',
    location: exp.location || exp.city || '',
    startDate: exp.startDate || exp.start || exp.from || '',
    endDate: exp.endDate || exp.end || exp.to || '',
    current: exp.current || exp.isCurrent || exp.present || !exp.endDate,
    description: exp.description || exp.responsibilities || exp.duties || 
      (Array.isArray(exp.highlights) ? exp.highlights.join('\n') : '') ||
      (Array.isArray(exp.bullets) ? exp.bullets.join('\n') : ''),
  };
}

/**
 * Map a single education item
 */
function mapEducation(edu: any, index: number): Education {
  return {
    id: edu.id || edu._id || generateId(),
    degree: edu.degree || edu.qualification || edu.title || '',
    institution: edu.institution || edu.school || edu.university || edu.college || '',
    location: edu.location || edu.city || '',
    startDate: edu.startDate || edu.start || edu.from || '',
    endDate: edu.endDate || edu.end || edu.to || edu.graduationDate || edu.year || '',
    current: edu.current || edu.isCurrent || !edu.endDate,
    description: edu.description || edu.details || edu.gpa ? `GPA: ${edu.gpa}` : '',
  };
}

/**
 * Map skills - handle various formats
 */
function mapSkills(skills: any): Skill[] {
  if (!skills) return [];
  
  // If skills is already in the correct format
  if (Array.isArray(skills) && skills.length > 0) {
    // Check if it's already Skill[] format
    if (skills[0].category && skills[0].skills) {
      return skills.map((s, i) => ({
        id: s.id || generateId(),
        category: s.category,
        skills: Array.isArray(s.skills) ? s.skills : [s.skills],
      }));
    }
    
    // Check if it's flat string array
    if (typeof skills[0] === 'string') {
      return [{
        id: generateId(),
        category: 'Skills',
        skills: skills,
      }];
    }
    
    // Check if it's array of objects with name/skill property
    if (skills[0].name || skills[0].skill) {
      return [{
        id: generateId(),
        category: 'Skills',
        skills: skills.map((s: any) => s.name || s.skill || String(s)),
      }];
    }

    // Check if it's categorized skills { technical: [...], soft: [...] }
    if (typeof skills[0] === 'object' && !Array.isArray(skills[0])) {
      const result: Skill[] = [];
      skills.forEach((skillGroup: any, index: number) => {
        if (skillGroup.category || skillGroup.type) {
          result.push({
            id: generateId(),
            category: skillGroup.category || skillGroup.type || `Category ${index + 1}`,
            skills: Array.isArray(skillGroup.skills || skillGroup.items) 
              ? (skillGroup.skills || skillGroup.items).map((s: any) => typeof s === 'string' ? s : s.name || s.skill)
              : [],
          });
        }
      });
      if (result.length > 0) return result;
    }
  }
  
  // If skills is an object with categories
  if (typeof skills === 'object' && !Array.isArray(skills)) {
    const result: Skill[] = [];
    Object.entries(skills).forEach(([category, skillList]) => {
      if (Array.isArray(skillList)) {
        result.push({
          id: generateId(),
          category: category.charAt(0).toUpperCase() + category.slice(1),
          skills: skillList.map((s: any) => typeof s === 'string' ? s : s.name || s.skill || String(s)),
        });
      }
    });
    return result;
  }
  
  return [];
}

/**
 * Map a single project item
 */
function mapProject(proj: any, index: number): Project {
  return {
    id: proj.id || proj._id || generateId(),
    title: proj.title || proj.name || proj.projectName || '',
    description: proj.description || proj.summary || '',
    url: proj.url || proj.link || proj.github || proj.website || '',
    technologies: Array.isArray(proj.technologies) 
      ? proj.technologies 
      : Array.isArray(proj.tech) 
        ? proj.tech 
        : Array.isArray(proj.stack)
          ? proj.stack
          : typeof proj.technologies === 'string' 
            ? proj.technologies.split(',').map((t: string) => t.trim())
            : [],
  };
}

/**
 * Map a single language item
 */
function mapLanguage(lang: any, index: number): Language {
  if (typeof lang === 'string') {
    return {
      id: generateId(),
      name: lang,
      proficiency: 'Intermediate',
    };
  }
  return {
    id: lang.id || lang._id || generateId(),
    name: lang.name || lang.language || '',
    proficiency: lang.proficiency || lang.level || lang.fluency || 'Intermediate',
  };
}

/**
 * Map a single certification item
 */
function mapCertification(cert: any, index: number): Certification {
  return {
    id: cert.id || cert._id || generateId(),
    name: cert.name || cert.title || cert.certification || '',
    company: cert.company || cert.issuer || cert.organization || cert.issuingOrganization || '',
    startDate: cert.startDate || cert.date || cert.issueDate || cert.dateObtained || '',
    description: cert.description || cert.details || '',
    url: cert.url || cert.link || cert.credentialUrl || '',
  };
}

/**
 * Map personal info from various formats
 */
function mapPersonalInfo(data: any): UserProfile {
  console.log('mapPersonalInfo input:', JSON.stringify(data, null, 2));
  
  // Try to find personal info from various possible locations
  const personalInfo = data.personalInfo || data.personal || data.contact || data.contactInfo || {};
  const profileSetting = personalInfo.profileSetting || {};
  
  console.log('Found personalInfo:', JSON.stringify(personalInfo, null, 2));
  
  // Handle links
  let links: UserLink[] = [];
  if (personalInfo.links && Array.isArray(personalInfo.links)) {
    links = personalInfo.links.map((link: any, i: number) => ({
      id: link.id || generateId(),
      label: link.label || link.type || link.name || 'Link',
      url: link.url || link.href || link.value || '',
    }));
  } else {
    // Extract links from individual fields
    const linkFields = ['linkedin', 'github', 'website', 'portfolio', 'twitter'];
    linkFields.forEach(field => {
      const value = personalInfo[field] || data[field];
      if (value) {
        links.push({
          id: generateId(),
          label: field.charAt(0).toUpperCase() + field.slice(1),
          url: value,
        });
      }
    });
  }

  // Extract firstName and lastName from various sources
  let firstName = '';
  let lastName = '';
  
  // Check profileSetting first
  if (profileSetting.firstName) {
    firstName = profileSetting.firstName;
    lastName = profileSetting.lastName || '';
  }
  // Then check personalInfo direct fields  
  else if (personalInfo.firstName || personalInfo.first_name) {
    firstName = personalInfo.firstName || personalInfo.first_name || '';
    lastName = personalInfo.lastName || personalInfo.last_name || '';
  }
  // Try to split fullName or name
  else if (personalInfo.fullName || personalInfo.name || personalInfo.full_name) {
    const fullName = personalInfo.fullName || personalInfo.name || personalInfo.full_name || '';
    const nameParts = fullName.trim().split(/\s+/);
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }

  const result: UserProfile = {
    profileSetting: {
      firstName: firstName,
      lastName: lastName,
      email: profileSetting.email || personalInfo.email || data.email || '',
      phone: profileSetting.phone || personalInfo.phone || personalInfo.telephone || personalInfo.mobile || data.phone || '',
      country: profileSetting.country || personalInfo.country || personalInfo.location || personalInfo.address || personalInfo.city || data.location || '',
    },
    headline: personalInfo.headline || personalInfo.title || personalInfo.jobTitle || personalInfo.position || data.title || '',
    links,
  };
  
  console.log('mapPersonalInfo result:', JSON.stringify(result, null, 2));
  
  return result;
}

/**
 * Main function to map backend CV data to frontend CV format
 */
export function mapBackendCVToFrontend(backendCV: BackendCV): CV {
  // Debug log
  console.log('=== mapBackendCVToFrontend ===');
  console.log('Input keys:', Object.keys(backendCV));
  
  // Extract the actual content - the backend stores parsed data in 'content' field
  // Priority: content > parsedContent > parsedData > root level
  let content: any = {};
  
  if (backendCV.content && typeof backendCV.content === 'object' && Object.keys(backendCV.content).length > 0) {
    content = backendCV.content;
    console.log('Using backendCV.content');
  } else if (backendCV.parsedContent && typeof backendCV.parsedContent === 'object' && Object.keys(backendCV.parsedContent).length > 0) {
    content = backendCV.parsedContent;
    console.log('Using backendCV.parsedContent');
  } else if (backendCV.parsedData && typeof backendCV.parsedData === 'object' && Object.keys(backendCV.parsedData).length > 0) {
    content = backendCV.parsedData;
    console.log('Using backendCV.parsedData');
  } else {
    console.log('No nested content found, using root level');
  }
  
  console.log('Content keys:', Object.keys(content));

  // Merge content with root level data - content takes priority for parsed fields
  const data = { 
    ...backendCV,  // Root level data (id, title, createdAt, etc.)
    ...content,    // Parsed content (personalInfo, workExperience, etc.)
  };
  
  console.log('Merged data keys:', Object.keys(data));

  const cv: CV = {
    id: data._id || data.id || '',
    title: data.title || data.fileName?.replace(/\.[^/.]+$/, "") || 'Untitled CV',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    personalInfo: mapPersonalInfo(data),
    professionalSummary: data.professionalSummary || data.summary || data.objective || data.profile || '',
    workExperience: (data.workExperience || data.experience || data.work || []).map(mapWorkExperience),
    education: (data.education || data.educations || []).map(mapEducation),
    skills: mapSkills(data.skills),
    projects: (data.projects || []).map(mapProject),
    languages: (data.languages || []).map(mapLanguage),
    certifications: (data.certifications || data.certificates || []).map(mapCertification),
    template: data.template || 'Minimal',
  };

  console.log('=== Final Mapped CV ===');
  console.log('ID:', cv.id);
  console.log('Title:', cv.title);
  console.log('Personal Info:', JSON.stringify(cv.personalInfo, null, 2));
  console.log('Summary:', cv.professionalSummary?.substring(0, 100) + '...');
  console.log('Work Experience count:', cv.workExperience?.length);
  console.log('Education count:', cv.education?.length);
  console.log('Skills count:', cv.skills?.length);
  console.log('========================');

  return cv;
}

/**
 * Check if backend CV has parsed content
 */
export function hasParsedContent(backendCV: BackendCV): boolean {
  const content = backendCV.content || backendCV.parsedContent || backendCV.parsedData || backendCV;
  
  return !!(
    content.personalInfo || 
    content.personal ||
    content.professionalSummary || 
    content.summary ||
    content.workExperience?.length ||
    content.experience?.length ||
    content.education?.length ||
    content.skills?.length ||
    content.projects?.length
  );
}

/**
 * Check if CV is still being parsed
 */
export function isParsingInProgress(backendCV: BackendCV): boolean {
  const status = backendCV.parsingStatus?.toLowerCase();
  return status === 'pending' || status === 'processing' || status === 'queued';
}

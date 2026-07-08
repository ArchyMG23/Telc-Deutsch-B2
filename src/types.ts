export type UserRole = 'student' | 'admin' | 'super_admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  teacherId?: string | null;
  createdAt: any;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface EvaluationRule {
  id: string;
  name: string;
  criteria: EvaluationCriterion[];
  maxTotalScore: number;
  version: number;
  createdBy: string;
  active: boolean;
  createdAt: any;
}

export interface Submission {
  id: string;
  exerciseId: string;
  exerciseTitle?: string;
  studentId: string;
  studentName?: string;
  corrected_by_admin_id?: string;
  text: string;
  status: 'en_cours' | 'soumis' | 'corrige';
  submittedAt?: any;
  createdAt: any;
}

export interface CorrectionAnnotation {
  start: number;
  end: number;
  text: string;
  comment: string;
  type: 'grammar' | 'vocabulary' | 'structure' | 'content';
}

export interface Correction {
  id: string;
  submissionId: string;
  teacherId: string;
  annotations: CorrectionAnnotation[];
  scoresByCriterion: Record<string, number>;
  finalScore: number;
  generalComment: string;
  evaluationRuleId: string;
  correctedAt: any;
}

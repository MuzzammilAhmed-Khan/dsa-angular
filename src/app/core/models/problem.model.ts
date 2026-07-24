export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ProgressStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED';

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  topicId: number;
  topicName: string;
  leetcodeUrl: string;
  examples: string;
  constraints: string;
  hints: string;
  progressStatus: ProgressStatus;
  revisit: boolean;
  hasSolution: boolean;
  createdAt: string;
}

export interface ProblemRequest {
  title: string;
  description: string;
  difficulty: Difficulty;
  topicId: number;
  leetcodeUrl?: string;
  examples?: string;
  constraints?: string;
  hints?: string;
}

import { Difficulty, ProgressStatus } from './problem.model';

export interface Progress {
  id: number;
  problemId: number;
  problemTitle: string;
  difficulty: Difficulty;
  topicName: string;
  status: ProgressStatus;
  attempts: number;
  revisit: boolean;
  personalNotes: string;
  solvedAt: string;
}

export interface ProgressUpdateRequest {
  status: ProgressStatus;
  revisit: boolean;
  personalNotes?: string;
}

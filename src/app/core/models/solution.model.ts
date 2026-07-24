export interface Solution {
  id: number;
  problemId: number;
  problemTitle: string;
  approach: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  notes: string;
  updatedAt: string;
}

export interface SolutionRequest {
  problemId: number;
  approach?: string;
  code?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  notes?: string;
}

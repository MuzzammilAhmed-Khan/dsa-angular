export interface Stats {
  totalProblems: number;
  solved: number;
  attempted: number;
  notStarted: number;
  solvedPercent: number;
  toRevisit: number;
  solvedByTopic: Record<string, number>;
  totalByDifficulty: Record<string, number>;
  solvedByDifficulty: Record<string, number>;
}

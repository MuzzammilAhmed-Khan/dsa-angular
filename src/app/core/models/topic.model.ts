export type Category = 'LINEAR' | 'NON_LINEAR' | 'ALGORITHM';

export interface Topic {
  id: number;
  name: string;
  description: string;
  category: Category;
  problemCount: number;
  createdAt: string;
}

export interface TopicRequest {
  name: string;
  description: string;
  category: Category;
}

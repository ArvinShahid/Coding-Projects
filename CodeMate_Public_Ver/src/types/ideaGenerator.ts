
export interface Idea {
  title: string;
  description: string;
  problem: string;
  solution: string;
}

export interface SelectedIdea extends Idea {
  vision: string;
}

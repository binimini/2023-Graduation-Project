export interface IAlgoProbLevel {
    id: string;
    name: string;
}

export interface IAlgoProbCategory {
  id: string;
  name: string;
}

export interface IAlgoProbInfo {
  number: number;
  title: string;
  averageTries: number;
  description: string;
  input: string;
  output: string;
  level: {
    id: string;
    name: string;
  };
  categories: string  | IAlgoProbCategory[];
}
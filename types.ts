
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TongueSin {
  id: string;
  title: string;
  definition: string;
  example: string;
  alternative: string;
  icon: string;
}

export interface AccountingEntry {
  id: string;
  date: string;
  sins: {
    [key: string]: boolean;
  };
  note: string;
}

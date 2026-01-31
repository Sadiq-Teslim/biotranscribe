export enum SequenceType {
  DNA = 'DNA',
  RNA = 'RNA'
}

export interface AminoAcid {
  code: string; // 1 letter code
  name: string; // Full name
  codon: string; // The triplet that generated it
  index: number; // Position in sequence
}

export interface AnalysisResult {
  rnaSequence: string;
  proteinSequence: AminoAcid[];
  originalSequence: string;
  type: SequenceType;
}

export interface HistoryRecord {
  id: string;
  name: string;
  date: string;
  type: SequenceType;
  inputSequence: string;
  rnaSequence: string;
  proteinSequenceString: string; // Stored as string for search simplicity
  aiAnalysis?: string;
}

export interface CodonMap {
  [key: string]: {
    name: string;
    symbol: string;
  };
}
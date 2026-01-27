import { SequenceType, AminoAcid } from '../types';
import { CODON_TABLE, DNA_REGEX, RNA_REGEX } from '../constants';

export const cleanSequence = (seq: string): string => {
  return seq.replace(/\s/g, '').toUpperCase();
};

export const validateSequence = (seq: string): SequenceType | null => {
  const cleaned = cleanSequence(seq);
  if (cleaned.length === 0) return null;
  
  if (RNA_REGEX.test(cleaned)) {
    // Check if it contains U, then it's definitely RNA. If it's just ACG, it could be either, but we default to DNA usually unless specified.
    // However, regex logic:
    // If it has T, it's DNA.
    // If it has U, it's RNA.
    // If neither, technically ambiguous, but user selector usually handles this.
    // Here we return detected type.
    if (cleaned.includes('U') && !cleaned.includes('T')) return SequenceType.RNA;
    if (cleaned.includes('T') && !cleaned.includes('U')) return SequenceType.DNA;
    // Ambiguous (only ACG) -> Default to DNA for conversion purposes or user selection
    return SequenceType.DNA; 
  }
  if (DNA_REGEX.test(cleaned)) return SequenceType.DNA;
  
  return null;
};

export const transcribeToRNA = (dnaSeq: string): string => {
  // Coding strand assumption: Replace T with U.
  return cleanSequence(dnaSeq).replace(/T/g, 'U');
};

export const translateRNA = (rnaSeq: string): AminoAcid[] => {
  const cleanRNA = cleanSequence(rnaSeq);
  const protein: AminoAcid[] = [];
  
  for (let i = 0; i < cleanRNA.length; i += 3) {
    if (i + 3 > cleanRNA.length) break;
    
    const codon = cleanRNA.slice(i, i + 3);
    const aminoInfo = CODON_TABLE[codon];
    
    if (aminoInfo) {
      protein.push({
        code: aminoInfo.symbol,
        name: aminoInfo.name,
        codon: codon,
        index: Math.floor(i / 3) + 1
      });
      
      // Optional: Stop translation at stop codon? 
      // Usually bioinformatics tools show the stop symbol (*) but stop the chain there if it's strictly functional simulation.
      // We will include the stop symbol for visualization but technically translation ends.
      if (aminoInfo.symbol === '*') {
        break;
      }
    } else {
      // Handle unknown codon (N or other chars)
      protein.push({
        code: '?',
        name: 'Unknown',
        codon: codon,
        index: Math.floor(i / 3) + 1
      });
    }
  }
  
  return protein;
};

export const processInput = (input: string, forcedType?: SequenceType) => {
  const cleaned = cleanSequence(input);
  let type = forcedType || validateSequence(cleaned) || SequenceType.DNA;
  
  // Cross check validity with forced type
  if (forcedType === SequenceType.RNA && cleaned.includes('T')) {
    throw new Error("Invalid RNA sequence: Contains Thymine (T)");
  }
  if (forcedType === SequenceType.DNA && cleaned.includes('U')) {
    throw new Error("Invalid DNA sequence: Contains Uracil (U)");
  }

  let rna = cleaned;
  if (type === SequenceType.DNA) {
    rna = transcribeToRNA(cleaned);
  }

  const protein = translateRNA(rna);
  
  return {
    originalSequence: cleaned,
    rnaSequence: rna,
    proteinSequence: protein,
    detectedType: type
  };
};
import { CodonMap } from './types';

// Standard Genetic Code
export const CODON_TABLE: CodonMap = {
  'UUU': { name: 'Phenylalanine', symbol: 'F' }, 'UUC': { name: 'Phenylalanine', symbol: 'F' },
  'UUA': { name: 'Leucine', symbol: 'L' }, 'UUG': { name: 'Leucine', symbol: 'L' },
  'CUU': { name: 'Leucine', symbol: 'L' }, 'CUC': { name: 'Leucine', symbol: 'L' },
  'CUA': { name: 'Leucine', symbol: 'L' }, 'CUG': { name: 'Leucine', symbol: 'L' },
  'AUU': { name: 'Isoleucine', symbol: 'I' }, 'AUC': { name: 'Isoleucine', symbol: 'I' },
  'AUA': { name: 'Isoleucine', symbol: 'I' }, 'AUG': { name: 'Methionine (Start)', symbol: 'M' },
  'GUU': { name: 'Valine', symbol: 'V' }, 'GUC': { name: 'Valine', symbol: 'V' },
  'GUA': { name: 'Valine', symbol: 'V' }, 'GUG': { name: 'Valine', symbol: 'V' },
  'UCU': { name: 'Serine', symbol: 'S' }, 'UCC': { name: 'Serine', symbol: 'S' },
  'UCA': { name: 'Serine', symbol: 'S' }, 'UCG': { name: 'Serine', symbol: 'S' },
  'CCU': { name: 'Proline', symbol: 'P' }, 'CCC': { name: 'Proline', symbol: 'P' },
  'CCA': { name: 'Proline', symbol: 'P' }, 'CCG': { name: 'Proline', symbol: 'P' },
  'ACU': { name: 'Threonine', symbol: 'T' }, 'ACC': { name: 'Threonine', symbol: 'T' },
  'ACA': { name: 'Threonine', symbol: 'T' }, 'ACG': { name: 'Threonine', symbol: 'T' },
  'GCU': { name: 'Alanine', symbol: 'A' }, 'GCC': { name: 'Alanine', symbol: 'A' },
  'GCA': { name: 'Alanine', symbol: 'A' }, 'GCG': { name: 'Alanine', symbol: 'A' },
  'UAU': { name: 'Tyrosine', symbol: 'Y' }, 'UAC': { name: 'Tyrosine', symbol: 'Y' },
  'UAA': { name: 'Stop', symbol: '*' }, 'UAG': { name: 'Stop', symbol: '*' },
  'CAU': { name: 'Histidine', symbol: 'H' }, 'CAC': { name: 'Histidine', symbol: 'H' },
  'CAA': { name: 'Glutamine', symbol: 'Q' }, 'CAG': { name: 'Glutamine', symbol: 'Q' },
  'AAU': { name: 'Asparagine', symbol: 'N' }, 'AAC': { name: 'Asparagine', symbol: 'N' },
  'AAA': { name: 'Lysine', symbol: 'K' }, 'AAG': { name: 'Lysine', symbol: 'K' },
  'GAU': { name: 'Aspartic Acid', symbol: 'D' }, 'GAC': { name: 'Aspartic Acid', symbol: 'D' },
  'GAA': { name: 'Glutamic Acid', symbol: 'E' }, 'GAG': { name: 'Glutamic Acid', symbol: 'E' },
  'UGU': { name: 'Cysteine', symbol: 'C' }, 'UGC': { name: 'Cysteine', symbol: 'C' },
  'UGA': { name: 'Stop', symbol: '*' }, 'UGG': { name: 'Tryptophan', symbol: 'W' },
  'CGU': { name: 'Arginine', symbol: 'R' }, 'CGC': { name: 'Arginine', symbol: 'R' },
  'CGA': { name: 'Arginine', symbol: 'R' }, 'CGG': { name: 'Arginine', symbol: 'R' },
  'AGU': { name: 'Serine', symbol: 'S' }, 'AGC': { name: 'Serine', symbol: 'S' },
  'AGA': { name: 'Arginine', symbol: 'R' }, 'AGG': { name: 'Arginine', symbol: 'R' },
  'GGU': { name: 'Glycine', symbol: 'G' }, 'GGC': { name: 'Glycine', symbol: 'G' },
  'GGA': { name: 'Glycine', symbol: 'G' }, 'GGG': { name: 'Glycine', symbol: 'G' },
};

export const DNA_REGEX = /^[ACGT\s]+$/i;
export const RNA_REGEX = /^[ACGU\s]+$/i;
import { DocumentData } from 'firebase/firestore';

export interface DetectionSubItem extends DocumentData {
  result: string;
  timestamp: string;
}

export interface DetectionDocument extends DocumentData {
  subcollection: DetectionSubItem[];
}
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  snippet: string;
  date: string;
  threadId?: string;
}

export interface ReplyTone {
  value: string;
  label: string;
  description: string;
}

export const REPLY_TONES: ReplyTone[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
];
// ─── List Types ───
// Dedicated type file for list-related interfaces

export interface VCList {
  id: string;
  name: string;
  description?: string;
  companyIds: string[];
  createdAt: string;
  updatedAt: string;
}

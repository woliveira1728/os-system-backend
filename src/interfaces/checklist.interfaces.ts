export interface CreateChecklistBody {
  title: string;
  required?: boolean;
  order?: number;
}

export interface UpdateChecklistBody {
  title?: string;
  completed?: boolean;
  notes?: string;
  required?: boolean;
  order?: number;
}

export interface CreateChecklistTemplateBody {
  title: string;
  items: ChecklistTemplateItem[];
  category?: string;
}

export interface ChecklistTemplateItem {
  title: string;
  required: boolean;
  order: number;
}

export interface ChecklistTemplateResponse {
  id: string;
  title: string;
  items: any;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
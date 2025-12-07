export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  location: string;
  lga?: string;
  ward?: string;
  status: 'in progress' | 'completed';
  images: string[];
}

export interface News {
  id: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  title: string;
  details: string;
  event: string;
  location: string;
  images: string[];
}

export interface Complaint {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  description: string;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  subscribed: boolean;
}

export interface NewsletterTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  html_content: string;
  thumbnail?: string;
}

export interface NewsletterCampaign {
  id: string;
  created_at: string;
  subject: string;
  html_content: string;
  sent_to_count: number;
  failed_count: number;
  status: 'completed' | 'partial' | 'failed';
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      news: {
        Row: News;
        Insert: Omit<News, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<News, 'id' | 'created_at' | 'updated_at'>>;
      };
      complaints: {
        Row: Complaint;
        Insert: Omit<Complaint, 'id' | 'created_at'>;
        Update: Partial<Omit<Complaint, 'id' | 'created_at'>>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, 'id' | 'created_at'>;
        Update: Partial<Omit<NewsletterSubscriber, 'id' | 'created_at'>>;
      };
      newsletter_campaigns: {
        Row: NewsletterCampaign;
        Insert: Omit<NewsletterCampaign, 'id' | 'created_at'>;
        Update: Partial<Omit<NewsletterCampaign, 'id' | 'created_at'>>;
      };
      newsletter_templates: {
        Row: NewsletterTemplate;
        Insert: Omit<NewsletterTemplate, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NewsletterTemplate, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

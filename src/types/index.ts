// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin' | 'investor';
  bio?: string;
  location?: string;
  phone?: string;
  avatar_url?: string;
  is_investor?: boolean;
  investor_type?: string;
  investment_range?: string;
  industries?: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  funding_goal?: number;
  current_funding?: number;
  image_url?: string;
  video_url?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  profiles?: Profile;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements?: string[];
  salary_range?: string;
  posted_by: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Investment {
  id: string;
  investor_id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  projects?: Project;
  profiles?: Profile;
}

export interface Donation {
  id: string;
  donor_id?: string;
  project_id: string;
  amount: number;
  donor_name?: string;
  donor_email?: string;
  message?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type?: string;
  created_at: string;
}

// Auth Context Types
export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  refreshProfile: () => void;
}

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Form Types
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  funding_goal?: number;
  image_url?: string;
  video_url?: string;
}

export interface InvestmentFormData {
  amount: number;
  message?: string;
}

// Extended types for complex queries
export interface ProjectWithProfile extends Project {
  profiles?: Profile;
  funds_raised?: number;
  total_donations?: number;
}

export interface InvestmentWithDetails extends Investment {
  project?: Project;
  equity_offered?: number;
}

export interface ConversationThread {
  id: string;
  commitment_id: string;
  other_user: Profile;
  project_title: string;
  last_message: string;
  unread_count: number;
  amount: number;
  status: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface NotificationExtended extends Notification {
  project_id?: string;
}

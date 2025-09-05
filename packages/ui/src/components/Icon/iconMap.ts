import {
  // Commonly used icons
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  
  // UI Icons
  Search,
  Filter,
  Settings,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Download,
  Upload,
  Copy,
  Share,
  
  // Status Icons  
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Loader2,
  
  // User & Social
  User,
  Users,
  Heart,
  MessageSquare,
  Bookmark,
  Bell,
  
  // Media
  Image,
  Video,
  Music,
  File,
  FileText,
  
  // Navigation
  Home,
  Grid3X3,
  List,
  Calendar,
  Mail,
  Phone,
  
  type LucideIcon
} from 'lucide-react';

export const iconMap = {
  // Basic actions
  'plus': Plus,
  'minus': Minus,
  'x': X,
  'check': Check,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  
  // UI elements
  'search': Search,
  'filter': Filter,
  'settings': Settings,
  'menu': Menu,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  'eye': Eye,
  'eye-off': EyeOff,
  'edit': Edit,
  'trash': Trash2,
  'download': Download,
  'upload': Upload,
  'copy': Copy,
  'share': Share,
  
  // Status
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle, 
  'info': Info,
  'x-circle': XCircle,
  'loader-2': Loader2,
  
  // User & social
  'user': User,
  'users': Users,
  'heart': Heart,
  'message-square': MessageSquare,
  'bookmark': Bookmark,
  'bell': Bell,
  
  // Media
  'image': Image,
  'video': Video,
  'music': Music,
  'file': File,
  'file-text': FileText,
  
  // Navigation
  'home': Home,
  'grid': Grid3X3,
  'list': List,
  'calendar': Calendar,
  'mail': Mail,
  'phone': Phone,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

// 타입 export
export type { LucideIcon };
-- ==============================================================================
-- CaseKeeper PostgreSQL Database Schema & Row Level Security Policies
-- Platform: Supabase PostgreSQL
-- Target Market: India
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Base user account metadata)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'public' CHECK (role IN ('public', 'lawyer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. LAWYER_PROFILES (Advocate credentials, bar status & practice focus)
CREATE TABLE IF NOT EXISTS lawyer_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bar_council_number TEXT UNIQUE NOT NULL,
  title TEXT,
  practice_areas TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"English", "Hindi"}',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  bio TEXT,
  verified BOOLEAN DEFAULT false,
  years_experience INT DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 5.0,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CASES (Core case metadata & advocate ownership)
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  reference_number TEXT,
  category TEXT NOT NULL,
  jurisdiction TEXT,
  court TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'archived', 'closed')),
  parties JSONB DEFAULT '{"petitioner": "", "respondent": ""}',
  notes TEXT,
  next_hearing_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CASE_MEMBERSHIPS (Access permissions for secondary advocates)
CREATE TABLE IF NOT EXISTS case_memberships (
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'co_counsel', 'viewer')),
  granted_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (case_id, user_id)
);

-- 5. DOCUMENTS (Uploaded case PDFs & Adobe extraction status)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/pdf',
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'done', 'failed')),
  extraction_status TEXT DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'processing', 'done', 'failed', 'unsupported')),
  extracted_text TEXT,
  extracted_pages JSONB,
  page_count INT DEFAULT 0,
  error_message TEXT,
  upload_date TIMESTAMPTZ DEFAULT now()
);

-- 6. BRIEF_VERSIONS (Generated and lawyer-reviewed structured briefs)
CREATE TABLE IF NOT EXISTS brief_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  document_ids UUID[] DEFAULT '{}',
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'final')),
  version_number INT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT true,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. CASE_EVENTS (Important dates, benchmark records & cause lists)
CREATE TABLE IF NOT EXISTS case_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'extracted')),
  confirmed BOOLEAN DEFAULT false,
  event_type TEXT DEFAULT 'hearing',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TASKS (Case actionable items & AI suggestions)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  due_date DATE,
  is_suggestion BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. HANDOFFS (Co-counsel case transfer invitations)
CREATE TABLE IF NOT EXISTS handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'revoked', 'expired')),
  notes TEXT,
  brief_version_id UUID REFERENCES brief_versions(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. HANDOFF_ITEMS (Selective documents associated with a handoff)
CREATE TABLE IF NOT EXISTS handoff_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handoff_id UUID NOT NULL REFERENCES handoffs(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. PUBLIC_CONVERSATIONS (Anonymous public legal chatbot sessions)
CREATE TABLE IF NOT EXISTS public_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. PUBLIC_MESSAGES (Public chatbot message exchanges)
CREATE TABLE IF NOT EXISTS public_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. PUBLIC_KNOWLEDGE_SOURCES (Approved statutory knowledge base)
CREATE TABLE IF NOT EXISTS public_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authority TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  statutory_reference TEXT,
  url TEXT,
  jurisdiction TEXT DEFAULT 'All India',
  last_reviewed DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true
);

-- 14. PUBLIC_RESOURCES (Official department and portal directory)
CREATE TABLE IF NOT EXISTS public_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authority TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  jurisdiction TEXT DEFAULT 'All India',
  type TEXT DEFAULT 'Portal',
  last_reviewed DATE DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT true
);

-- 15. LAWYER_ENQUIRIES (Citizen consultation requests)
CREATE TABLE IF NOT EXISTS lawyer_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(id),
  enquirer_name TEXT NOT NULL,
  enquirer_email TEXT NOT NULL,
  enquirer_phone TEXT,
  case_category TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. AUDIT_EVENTS (Security, access, and handoff revocation logs)
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE handoff_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view lawyer public details; users can view/edit their own profile
CREATE POLICY "Public profiles can be viewed by all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Lawyer Profiles: Anyone can view public directory; only the advocate can update
CREATE POLICY "Public directory is readable by all" ON lawyer_profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Advocate can update own lawyer profile" ON lawyer_profiles FOR UPDATE USING (auth.uid() = id);

-- Cases: Only owner or authorized case members can read/modify
CREATE POLICY "Owner or member can access case" ON cases
  FOR ALL USING (
    owner_id = auth.uid() OR
    id IN (SELECT case_id FROM case_memberships WHERE user_id = auth.uid())
  );

-- Documents: Only authorized case members can view or upload
CREATE POLICY "Case participants can access documents" ON documents
  FOR ALL USING (
    case_id IN (
      SELECT id FROM cases WHERE owner_id = auth.uid()
      UNION
      SELECT case_id FROM case_memberships WHERE user_id = auth.uid()
    )
  );

-- Brief Versions: Accessible to case participants
CREATE POLICY "Case participants can access briefs" ON brief_versions
  FOR ALL USING (
    case_id IN (
      SELECT id FROM cases WHERE owner_id = auth.uid()
      UNION
      SELECT case_id FROM case_memberships WHERE user_id = auth.uid()
    )
  );

-- Handoffs: Sender can manage; recipient can view only when sent or accepted
CREATE POLICY "Handoff sender full access" ON handoffs
  FOR ALL USING (sender_id = auth.uid());

CREATE POLICY "Handoff recipient view/accept" ON handoffs
  FOR SELECT USING (recipient_id = auth.uid() AND status IN ('sent', 'accepted'));

CREATE POLICY "Handoff recipient update status" ON handoffs
  FOR UPDATE USING (recipient_id = auth.uid() AND status = 'sent');

-- Handoff Items: Strictly accessible only if the handoff has been ACCEPTED (PRD Section 5.8)
CREATE POLICY "Shared items accessible only upon accepted handoff" ON handoff_items
  FOR SELECT USING (
    handoff_id IN (
      SELECT id FROM handoffs 
      WHERE (sender_id = auth.uid() OR (recipient_id = auth.uid() AND status = 'accepted'))
    )
  );

-- Public Knowledge Sources & Public Resources: Read-only for everyone
CREATE POLICY "Public knowledge sources readable by anyone" ON public_knowledge_sources FOR SELECT USING (is_active = true);
CREATE POLICY "Public resources readable by anyone" ON public_resources FOR SELECT USING (published = true);

-- Public Chatbot: Read/Write by session token
CREATE POLICY "Chatbot sessions readable by everyone" ON public_conversations FOR ALL USING (true);
CREATE POLICY "Chatbot messages readable by everyone" ON public_messages FOR ALL USING (true);

-- Lawyer Enquiries: Anyone can insert an enquiry; only the advocate can read their received enquiries
CREATE POLICY "Citizens can insert enquiries" ON lawyer_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Advocates can read their own enquiries" ON lawyer_enquiries FOR SELECT USING (lawyer_id = auth.uid());

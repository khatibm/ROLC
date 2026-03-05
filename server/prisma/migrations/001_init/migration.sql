-- Migration: 001_init
-- Tamim Diwan initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE "Gender" AS ENUM ('M', 'F');
CREATE TYPE "RelationType" AS ENUM ('FATHER', 'MOTHER', 'SPOUSE');
CREATE TYPE "RelationStatus" AS ENUM ('CONFIRMED', 'PENDING', 'REJECTED');
CREATE TYPE "RelationSource" AS ENUM ('ADMIN', 'USER_REQUEST');
CREATE TYPE "TicketType" AS ENUM ('SUGGESTION', 'COMPLAINT');
CREATE TYPE "TicketStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CLOSED');

-- Branches
CREATE TABLE branches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar         VARCHAR(255) NOT NULL,
  parent_branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Persons
CREATE TABLE persons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name_ar VARCHAR(255) NOT NULL,
  gender       "Gender" NOT NULL,
  birth_date   DATE,
  death_date   DATE,
  branch_id    UUID REFERENCES branches(id) ON DELETE SET NULL,
  city         VARCHAR(100),
  bio          TEXT,
  photo_url    TEXT,
  is_public    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relationships (adjacency list)
CREATE TABLE relationships (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id         UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  related_person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  relation_type     "RelationType" NOT NULL,
  status            "RelationStatus" NOT NULL DEFAULT 'CONFIRMED',
  source            "RelationSource" NOT NULL DEFAULT 'ADMIN',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(person_id, related_person_id, relation_type)
);

CREATE INDEX idx_relationships_person ON relationships(person_id);
CREATE INDEX idx_relationships_related ON relationships(related_person_id);

-- Person Tree Paths (closure table)
CREATE TABLE person_tree_paths (
  ancestor_id   UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  descendant_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  depth         INT NOT NULL,
  PRIMARY KEY (ancestor_id, descendant_id)
);

CREATE INDEX idx_tree_paths_descendant ON person_tree_paths(descendant_id, depth);
CREATE INDEX idx_tree_paths_ancestor   ON person_tree_paths(ancestor_id, depth);

-- News
CREATE TABLE news (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar        VARCHAR(500) NOT NULL,
  content_ar      TEXT NOT NULL,
  category        VARCHAR(100) NOT NULL DEFAULT 'عام',
  cover_image_url TEXT,
  gallery_json    JSONB,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category     ON news(category);

-- Events
CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar        VARCHAR(500) NOT NULL,
  description_ar  TEXT NOT NULL,
  start_at        TIMESTAMPTZ NOT NULL,
  end_at          TIMESTAMPTZ NOT NULL,
  city            VARCHAR(100),
  location_text   VARCHAR(500),
  map_url         TEXT,
  contact_name    VARCHAR(255),
  contact_phone   VARCHAR(50),
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_city     ON events(city);

-- Tickets
CREATE TABLE tickets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type           "TicketType" NOT NULL,
  title          VARCHAR(500) NOT NULL,
  message        TEXT NOT NULL,
  attachment_url TEXT,
  contact_phone  VARCHAR(50),
  contact_email  VARCHAR(255),
  status         "TicketStatus" NOT NULL DEFAULT 'NEW',
  admin_note     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_status ON tickets(status);

-- Admin Users
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trg_branches_updated_at   BEFORE UPDATE ON branches   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_persons_updated_at    BEFORE UPDATE ON persons    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_news_updated_at       BEFORE UPDATE ON news       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_events_updated_at     BEFORE UPDATE ON events     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_tickets_updated_at    BEFORE UPDATE ON tickets    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_admin_updated_at      BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration to create gallery_images table

CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    alt_text TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

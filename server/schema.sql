-- ============================================================================
-- Relay Room - Database Schema
-- Task: Real-Time Chat Application (EncoderX Task 4)
-- ============================================================================

-- Table: Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    color VARCHAR(16) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Conversations / Chat Rooms
CREATE TABLE IF NOT EXISTS rooms (
    room_id VARCHAR(128) PRIMARY KEY,
    user1_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Persistent Chat Messages
-- Stores sender info, receiver info, payload, and timestamps
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    room_id VARCHAR(128) NOT NULL,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    sender_name VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & quick room history retrieval
CREATE INDEX IF NOT EXISTS idx_messages_room_created ON messages (room_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages (receiver_id);

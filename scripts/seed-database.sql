-- Create sample users
INSERT INTO users (id, email, password, username, bio, avatar) VALUES
('user1', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'john_doe', 'Fitness enthusiast and productivity lover', '/placeholder.svg?height=100&width=100'),
('user2', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'jane_smith', 'Mindfulness practitioner and book lover', '/placeholder.svg?height=100&width=100'),
('user3', 'mike@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'mike_wilson', 'Developer building better habits', '/placeholder.svg?height=100&width=100');

-- Create sample habits
INSERT INTO habits (id, name, category, frequency, notes, color, "userId") VALUES
('habit1', 'Morning Exercise', 'health', 'daily', 'Start the day with 30 minutes of exercise', '#ef4444', 'user1'),
('habit2', 'Read for 30 minutes', 'personal', 'daily', 'Read books to expand knowledge', '#3b82f6', 'user1'),
('habit3', 'Meal Prep', 'health', 'weekly', 'Prepare healthy meals for the week', '#10b981', 'user1'),
('habit4', 'Meditation', 'personal', 'daily', '10 minutes of mindfulness meditation', '#8b5cf6', 'user2'),
('habit5', 'Code Review', 'work', 'daily', 'Review code and learn new patterns', '#f59e0b', 'user3');

-- Create sample completions (recent check-ins)
INSERT INTO completions (id, "habitId", "userId", "completedAt", notes) VALUES
('comp1', 'habit1', 'user1', CURRENT_DATE, 'Great workout today!'),
('comp2', 'habit2', 'user1', CURRENT_DATE, 'Finished chapter 3'),
('comp3', 'habit4', 'user2', CURRENT_DATE, 'Feeling more centered'),
('comp4', 'habit5', 'user3', CURRENT_DATE, 'Learned about new React patterns');

-- Create sample friendships
INSERT INTO friendships (id, "followerId", "followingId") VALUES
('friend1', 'user1', 'user2'),
('friend2', 'user1', 'user3'),
('friend3', 'user2', 'user1'),
('friend4', 'user3', 'user1');

-- Seed initial data for AGI OS-DAO

-- Insert initial agents
INSERT INTO agents (name, type, status, workload, tasks_completed, success_rate) VALUES
  ('Alpha-1', 'reasoning', 'active', 75, 1247, 98.5),
  ('Vision-2', 'vision', 'active', 60, 892, 97.2),
  ('Lang-3', 'language', 'idle', 0, 2341, 99.1),
  ('Code-4', 'code', 'active', 85, 567, 96.8),
  ('Research-5', 'research', 'paused', 0, 1823, 98.9),
  ('Analysis-6', 'analysis', 'active', 45, 934, 97.5)
ON CONFLICT DO NOTHING;

-- Insert sample tools
INSERT INTO tools (name, category, description, cost, rating, downloads, installed) VALUES
  ('Web Search API', 'ai', 'Advanced web search with semantic understanding', 100, 4.8, 15420, true),
  ('Image Generator', 'ai', 'Generate high-quality images from text descriptions', 200, 4.9, 12350, true),
  ('Code Interpreter', 'ai', 'Execute and analyze code in multiple languages', 150, 4.7, 18920, false),
  ('Database Connector', 'data', 'Connect to SQL and NoSQL databases', 80, 4.6, 9870, true),
  ('Vector Store', 'data', 'Store and search embeddings efficiently', 120, 4.8, 11240, false),
  ('API Gateway', 'integration', 'Manage and route API requests', 90, 4.5, 7650, false),
  ('Webhook Manager', 'integration', 'Handle incoming webhooks and events', 70, 4.4, 6230, false),
  ('File Processor', 'utility', 'Process various file formats', 60, 4.6, 8940, true),
  ('Scheduler', 'utility', 'Schedule and automate tasks', 50, 4.7, 10120, false),
  ('Email Service', 'integration', 'Send and manage emails', 85, 4.5, 7890, false),
  ('Analytics Tracker', 'data', 'Track and analyze user behavior', 110, 4.8, 9560, true),
  ('Cache Manager', 'utility', 'Manage distributed caching', 75, 4.6, 8340, false)
ON CONFLICT DO NOTHING;

-- Insert sample proposals
INSERT INTO proposals (title, description, category, status, votes_for, votes_against, votes_abstain, created_by, ends_at) VALUES
  ('Increase Agent Capacity', 'Proposal to increase the maximum number of concurrent agents from 50 to 100', 'technical', 'active', 15420, 3240, 1200, '0x742d...5f3a', NOW() + INTERVAL '5 days'),
  ('New Tool Integration', 'Add support for advanced computer vision tools', 'technical', 'active', 8920, 2100, 890, '0x8f3b...2c1d', NOW() + INTERVAL '3 days'),
  ('Treasury Allocation', 'Allocate 100,000 AGI tokens for infrastructure upgrades', 'economic', 'active', 12340, 5670, 2100, '0x5a2c...9e4b', NOW() + INTERVAL '7 days'),
  ('Governance Update', 'Reduce quorum requirement from 50% to 40%', 'governance', 'passed', 18920, 4320, 1560, '0x3d8f...7a2c', NOW() - INTERVAL '2 days'),
  ('Community Fund', 'Create a community development fund with 50,000 AGI', 'community', 'rejected', 6780, 12340, 890, '0x9c4e...1b5f', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Insert sample memories
INSERT INTO memories (agent_id, type, content, importance, tags, access_count) 
SELECT 
  id,
  'conversation',
  'Discussed optimization strategies for neural network training',
  'high',
  ARRAY['optimization', 'neural-networks', 'training'],
  15
FROM agents WHERE name = 'Alpha-1'
LIMIT 1;

INSERT INTO memories (agent_id, type, content, importance, tags, access_count)
SELECT 
  id,
  'decision',
  'Decided to use transformer architecture for language processing',
  'high',
  ARRAY['architecture', 'transformers', 'nlp'],
  23
FROM agents WHERE name = 'Lang-3'
LIMIT 1;

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (title, type, content, tags, access_count) VALUES
  ('AGI Architecture Patterns', 'documentation', 'Comprehensive guide to AGI system architecture and design patterns', ARRAY['architecture', 'design', 'patterns'], 342),
  ('Neural Network Optimization', 'research', 'Latest research on optimizing neural network performance', ARRAY['neural-networks', 'optimization', 'research'], 567),
  ('DAO Governance Best Practices', 'article', 'Best practices for decentralized autonomous organization governance', ARRAY['dao', 'governance', 'best-practices'], 234)
ON CONFLICT DO NOTHING;

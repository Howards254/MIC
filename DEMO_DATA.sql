-- Demo Data for MIC Platform
-- Run this AFTER making Karol an admin

-- Note: You need to sign up these users first through the app, then run this to add demo data

-- Demo Projects (replace user_id with actual IDs from your profiles table)
-- To get user IDs, run: SELECT id, email, full_name FROM profiles;

-- Example: Insert demo projects
-- Replace 'USER_ID_HERE' with actual user IDs from your database

INSERT INTO projects (user_id, title, description, category, funding_goal, funds_raised, timeline, team_size, status) VALUES
-- Pending project (needs approval)
('USER_ID_1', 'Bamboo Composite Building Materials', 'Revolutionary building materials made from sustainable bamboo composites that rival traditional timber in strength and durability. Our innovative process creates eco-friendly alternatives for construction.', 'Building Materials', 150000, 0, '18 months', 8, 'pending'),

-- Approved project with some funding
('USER_ID_2', 'Hemp Fiber Furniture Collection', 'Beautiful, sustainable furniture crafted from hemp fibers. We offer a renewable alternative to traditional wood furniture with modern designs that appeal to eco-conscious consumers.', 'Furniture', 100000, 35000, '12 months', 5, 'approved'),

-- Approved project
('USER_ID_3', 'Mycelium-Based Packaging Solutions', 'Eco-friendly packaging solutions grown from mycelium that are fully biodegradable. Perfect replacement for plastic foam packaging in shipping and product protection.', 'Packaging', 80000, 52000, '10 months', 6, 'approved');

-- Demo Investor Application (pending)
-- Replace 'USER_ID_4' with actual user ID
INSERT INTO investor_applications (user_id, company_name, investment_range, areas_of_interest, linkedin_url, website_url, reason, status) VALUES
('USER_ID_4', 'Green Ventures Capital', '$50,000 - $500,000', ARRAY['Building Materials', 'Packaging', 'Furniture'], 'https://linkedin.com/company/greenventures', 'https://greenventures.com', 'We are passionate about investing in sustainable alternatives that combat deforestation. Our fund focuses on early-stage companies with innovative solutions to environmental challenges.', 'pending');

-- Demo Job Posting (for approved project)
-- Replace 'PROJECT_ID' and 'USER_ID' with actual IDs
INSERT INTO jobs (project_id, posted_by, title, description, location, job_type, salary_range, requirements, responsibilities, status) VALUES
('PROJECT_ID', 'USER_ID', 'Materials Engineer', 'We are looking for an experienced materials engineer to help develop our hemp fiber composite technology. Join our mission to create sustainable furniture alternatives.', 'San Francisco, CA', 'full-time', '$80,000 - $120,000', 
ARRAY['Bachelor degree in Materials Science or related field', '5+ years experience in composite materials', 'Knowledge of sustainable materials', 'Strong problem-solving skills'],
ARRAY['Lead materials research and development', 'Test and validate hemp fiber prototypes', 'Collaborate with manufacturing team', 'Document findings and improvements'],
'open');

-- To see all data:
SELECT 'Projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'Investor Applications', COUNT(*) FROM investor_applications
UNION ALL
SELECT 'Jobs', COUNT(*) FROM jobs;

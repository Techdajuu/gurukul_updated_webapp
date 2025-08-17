-- Promote existing user to admin
UPDATE profiles 
SET role = 'admin'
WHERE user_id = 'ff0d7c3d-11cd-43bc-bc40-4bb4574641a2';
-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "user"
    ("firstName", "lastName", "username", "hashedPassword")
    values ('Lawrence', 'Wang', 'lwang', '1234')

-- Enable realtime for books and pdfs tables
ALTER TABLE public.books REPLICA IDENTITY FULL;
ALTER TABLE public.pdfs REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pdfs;
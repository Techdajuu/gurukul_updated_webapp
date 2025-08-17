import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Heart, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ContactSellerModal from './ContactSellerModal';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  location?: string;
  seller_id: string;
  category_id: string;
  seller_phone?: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  categories?: {
    name: string;
  };
  book_images?: {
    image_url: string;
    is_primary: boolean;
  }[];
}

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('books-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books',
          filter: 'status=eq.approved'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchBooks(); // Refresh the list when a new book is added
          } else if (payload.eventType === 'UPDATE') {
            fetchBooks(); // Refresh on updates
          } else if (payload.eventType === 'DELETE') {
            setBooks(prev => prev.filter(book => book.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          profiles!seller_id(full_name, avatar_url),
          categories(name),
          book_images(image_url, is_primary)
        `)
        .eq('status', 'approved')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = (book: Book) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact sellers",
        variant: "destructive",
      });
      return;
    }

    setSelectedBook(book);
    setContactModalOpen(true);
  };

  const getBookImage = (book: Book) => {
    const primaryImage = book.book_images?.find(img => img.is_primary);
    return primaryImage?.image_url || book.book_images?.[0]?.image_url || 
           'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop';
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Books
            </h2>
            <p className="text-muted-foreground text-lg">
              Popular books from verified sellers
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Featured Books
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Popular books from verified sellers
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg">
              No books available yet. Be the first to upload!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => (
              <Card key={book.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={getBookImage(book)}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {book.price === 0 && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                      FREE
                    </Badge>
                  )}
                </div>

                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">by {book.author}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {book.price > 0 ? (
                        <span className="text-base sm:text-lg font-bold text-green-600">Rs.{book.price}</span>
                      ) : (
                        <span className="text-base sm:text-lg font-bold text-green-600">FREE</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">{book.condition}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">{book.categories?.name}</Badge>
                    </div>
                    {book.location && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{book.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Seller: {book.profiles?.full_name || 'Unknown'}
                  </div>
                </CardContent>

                <CardFooter className="p-3 sm:p-4 pt-0 space-y-2">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleContactSeller(book)}
                  >
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span className="text-xs sm:text-sm">Contact Seller</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-6 sm:mt-8">
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/books'}>
            View All Books
          </Button>
        </div>

        {/* Contact Seller Modal */}
        {selectedBook && (
          <ContactSellerModal
            isOpen={contactModalOpen}
            onClose={() => {
              setContactModalOpen(false);
              setSelectedBook(null);
            }}
            book={selectedBook}
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;
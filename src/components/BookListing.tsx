import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Phone, Heart, Search, Filter, Loader2 } from "lucide-react";
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
    phone?: string;
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

interface Category {
  id: string;
  name: string;
}

const BookListing = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get search query and category from URL parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearchQuery) {
      setSearchTerm(urlSearchQuery);
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('books-listing-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books',
          filter: 'status=eq.approved'
        },
        () => {
          fetchBooks(); // Refresh when books change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, priceRange]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          profiles!seller_id(full_name, avatar_url),
          categories(name),
          book_images(image_url, is_primary)
        `)
        .eq('status', 'approved')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (priceRange !== 'all') {
        switch (priceRange) {
          case 'free':
            query = query.eq('price', 0);
            break;
          case 'under-500':
            query = query.gt('price', 0).lte('price', 500);
            break;
          case '500-1000':
            query = query.gt('price', 500).lte('price', 1000);
            break;
          case 'over-1000':
            query = query.gt('price', 1000);
            break;
        }
      }

      const { data, error } = await query;

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

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Filters */}
      <div className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="under-500">Under Rs.500</SelectItem>
              <SelectItem value="500-1000">Rs.500 - Rs.1000</SelectItem>
              <SelectItem value="over-1000">Over Rs.1000</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="sm:col-span-2 lg:col-span-1"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange('all');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Books ({books.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white">
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
                      <Badge variant="outline" className="text-xs">{book.categories?.name}</Badge>
                    {book.location && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{book.location}</span>
                      </div>
                    )}
                    </div>

                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Seller: {book.profiles?.full_name || 'Unknown'}
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 sm:p-4 pt-0">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleContactSeller(book)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

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
  );
};

export default BookListing;
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Star, 
  Eye, 
  Download, 
  Settings, 
  
  DollarSign,
  Package,
  TrendingUp,
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadBook from '@/components/UploadBook';
import UploadPDF from '@/components/UploadPDF';
import UserProfile from '@/components/UserProfile';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  is_available: boolean;
  status: string;
  views_count: number;
  created_at: string;
  categories?: {
    name: string;
  };
}

interface PDF {
  id: string;
  title: string;
  downloads_count: number;
  status: string;
  created_at: string;
  categories?: {
    name: string;
  };
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState<Book[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.id) {
      fetchUserContent();
    }
  }, [user, profile?.id]);

  const fetchUserContent = async () => {
    if (!profile?.id) {
      console.log('Profile ID not available yet');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching content for profile ID:', profile.id);
      
      // Fetch user's books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          categories(name)
        `)
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });

      if (booksError) {
        console.error('Books error:', booksError);
        throw booksError;
      }

      // Fetch user's PDFs
      const { data: pdfsData, error: pdfsError } = await supabase
        .from('pdfs')
        .select(`
          *,
          categories(name)
        `)
        .eq('uploader_id', profile.id)
        .order('created_at', { ascending: false });

      if (pdfsError) {
        console.error('PDFs error:', pdfsError);
        throw pdfsError;
      }

      console.log('Books data:', booksData);
      console.log('PDFs data:', pdfsData);

      setBooks(booksData || []);
      setPdfs(pdfsData || []);
    } catch (error) {
      console.error('Error fetching user content:', error);
      toast({
        title: "Error",
        description: "Failed to load your content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ is_available: false })
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book marked as sold!",
      });

      // Refresh the data
      if (profile?.id) {
        fetchUserContent();
      }
    } catch (error) {
      console.error('Error marking book as sold:', error);
      toast({
        title: "Error",
        description: "Failed to mark book as sold",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsAvailable = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ is_available: true })
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book marked as available!",
      });

      // Refresh the data
      if (profile?.id) {
        fetchUserContent();
      }
    } catch (error) {
      console.error('Error marking book as available:', error);
      toast({
        title: "Error",
        description: "Failed to mark book as available",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gurukul-blue/5 to-gurukul-green/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const approvedBooks = books.filter(book => book.status === 'approved');
  const approvedPdfs = pdfs.filter(pdf => pdf.status === 'approved');
  const pendingBooks = books.filter(book => book.status === 'pending');
  const pendingPdfs = pdfs.filter(pdf => pdf.status === 'pending');
  const soldBooks = approvedBooks.filter(book => !book.is_available);
  const totalViews = approvedBooks.reduce((sum, book) => sum + (book.views_count || 0), 0);
  const totalDownloads = approvedPdfs.reduce((sum, pdf) => sum + (pdf.downloads_count || 0), 0);

  const stats = [
    { 
      label: 'Books Listed', 
      value: approvedBooks.length.toString(), 
      icon: BookOpen, 
      color: 'text-blue-600' 
    },
    { 
      label: 'PDFs Shared', 
      value: approvedPdfs.length.toString(), 
      icon: FileText, 
      color: 'text-green-600' 
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || user.email}!
            </p>
          </div>
          <Badge variant="secondary" className="capitalize">
            {profile?.role || 'seller'}
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="my-books" className="text-xs sm:text-sm">My Books</TabsTrigger>
            <TabsTrigger value="upload-book" className="text-xs sm:text-sm">Upload Book</TabsTrigger>
            <TabsTrigger value="upload-pdf" className="text-xs sm:text-sm">Upload PDF</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-secondary/20`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {loading ? '...' : stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending Approval</span>
                    <Badge variant="secondary">{pendingBooks.length + pendingPdfs.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Downloads</span>
                    <Badge variant="outline">{totalDownloads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Books</span>
                    <Badge variant="outline">{approvedBooks.filter(b => b.is_available).length}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('upload-book')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Book
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('upload-pdf')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Share PDF Resource
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('my-books')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage My Books
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-books" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Books</span>
                </CardTitle>
                <CardDescription>Manage your book listings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : books.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No books listed yet.</p>
                    <Button onClick={() => setActiveTab('upload-book')}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your First Book
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {books.map((book) => (
                      <Card key={book.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{book.title}</h3>
                              <Badge 
                                variant={
                                  book.status === 'approved' ? 'default' : 
                                  book.status === 'pending' ? 'secondary' : 'destructive'
                                }
                              >
                                {book.status}
                              </Badge>
                              {!book.is_available && book.status === 'approved' && (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  SOLD
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Author: {book.author}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              Price: Rs.{book.price} | Condition: {book.condition}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              Category: {book.categories?.name} | Views: {book.views_count || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Listed: {formatDate(book.created_at)}
                            </p>
                          </div>
                          
                          {book.status === 'approved' && (
                            <div className="flex items-center space-x-2 ml-4">
                              {book.is_available ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkAsSold(book.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark as Sold
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsAvailable(book.id)}
                                >
                                  <Package className="h-4 w-4 mr-1" />
                                  Mark Available
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PDFs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>My PDFs</span>
                </CardTitle>
                <CardDescription>Educational resources you've shared</CardDescription>
              </CardHeader>
              <CardContent>
                {pdfs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No PDFs shared yet.</p>
                    <Button onClick={() => setActiveTab('upload-pdf')}>
                      <Upload className="h-4 w-4 mr-2" />
                      Share Your First PDF
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pdfs.map((pdf) => (
                      <Card key={pdf.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{pdf.title}</h3>
                              <Badge 
                                variant={
                                  pdf.status === 'approved' ? 'default' : 
                                  pdf.status === 'pending' ? 'secondary' : 'destructive'
                                }
                              >
                                {pdf.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Category: {pdf.categories?.name} | Downloads: {pdf.downloads_count || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Shared: {formatDate(pdf.created_at)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload-book">
            <UploadBook />
          </TabsContent>

          <TabsContent value="upload-pdf">
            <UploadPDF />
          </TabsContent>


          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
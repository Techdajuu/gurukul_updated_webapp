import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  X, 
  Check,
  Eye,
  BarChart3,
  Trash2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PendingItem {
  id: string;
  title: string;
  author?: string;
  uploader_name: string;
  category_name: string;
  created_at: string;
  type: 'book' | 'pdf';
}

interface ApprovedItem {
  id: string;
  title: string;
  author?: string;
  seller_name: string;
  category_name: string;
  created_at: string;
  price?: number;
  location?: string;
  type: 'book' | 'pdf';
  downloads_count?: number;
  views_count?: number;
}

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [pendingBooks, setPendingBooks] = useState<PendingItem[]>([]);
  const [pendingPDFs, setPendingPDFs] = useState<PendingItem[]>([]);
  const [approvedBooks, setApprovedBooks] = useState<ApprovedItem[]>([]);
  const [approvedPDFs, setApprovedPDFs] = useState<ApprovedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchPendingItems();
      fetchApprovedItems();
    }
  }, [profile]);

  const fetchPendingItems = async () => {
    try {
      // Fetch pending books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          id,
          title,
          author,
          created_at,
          profiles!seller_id(full_name),
          categories(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      // Fetch pending PDFs
      const { data: pdfsData, error: pdfsError } = await supabase
        .from('pdfs')
        .select(`
          id,
          title,
          created_at,
          profiles!uploader_id(full_name),
          categories(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pdfsError) throw pdfsError;

      const formattedBooks = booksData?.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        uploader_name: book.profiles?.full_name || 'Unknown',
        category_name: book.categories?.name || 'Unknown',
        created_at: book.created_at,
        type: 'book' as const,
      })) || [];

      const formattedPDFs = pdfsData?.map(pdf => ({
        id: pdf.id,
        title: pdf.title,
        uploader_name: pdf.profiles?.full_name || 'Unknown',
        category_name: pdf.categories?.name || 'Unknown',
        created_at: pdf.created_at,
        type: 'pdf' as const,
      })) || [];

      setPendingBooks(formattedBooks);
      setPendingPDFs(formattedPDFs);
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedItems = async () => {
    try {
      // Fetch approved books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          id,
          title,
          author,
          price,
          location,
          views_count,
          created_at,
          profiles!seller_id(full_name),
          categories(name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      // Fetch approved PDFs
      const { data: pdfsData, error: pdfsError } = await supabase
        .from('pdfs')
        .select(`
          id,
          title,
          downloads_count,
          created_at,
          profiles!uploader_id(full_name),
          categories(name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (pdfsError) throw pdfsError;

      const formattedApprovedBooks = booksData?.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        seller_name: book.profiles?.full_name || 'Unknown',
        category_name: book.categories?.name || 'Unknown',
        created_at: book.created_at,
        price: book.price,
        location: book.location,
        views_count: book.views_count,
        type: 'book' as const,
      })) || [];

      const formattedApprovedPDFs = pdfsData?.map(pdf => ({
        id: pdf.id,
        title: pdf.title,
        seller_name: pdf.profiles?.full_name || 'Unknown',
        category_name: pdf.categories?.name || 'Unknown',
        created_at: pdf.created_at,
        downloads_count: pdf.downloads_count,
        type: 'pdf' as const,
      })) || [];

      setApprovedBooks(formattedApprovedBooks);
      setApprovedPDFs(formattedApprovedPDFs);
    } catch (error) {
      console.error('Error fetching approved items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch approved items",
        variant: "destructive",
      });
    }
  };

  const handleApproveItem = async (id: string, type: 'book' | 'pdf') => {
    try {
      const table = type === 'book' ? 'books' : 'pdfs';
      const { error } = await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'book' ? 'Book' : 'PDF'} approved successfully`,
      });

      // Refresh the lists
      fetchPendingItems();
      fetchApprovedItems();
    } catch (error) {
      console.error('Error approving item:', error);
      toast({
        title: "Error",
        description: "Failed to approve item",
        variant: "destructive",
      });
    }
  };

  const handleRejectItem = async (id: string, type: 'book' | 'pdf') => {
    try {
      const table = type === 'book' ? 'books' : 'pdfs';
      const { error } = await supabase
        .from(table)
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'book' ? 'Book' : 'PDF'} rejected`,
      });

      // Refresh the lists
      fetchPendingItems();
      fetchApprovedItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast({
        title: "Error",
        description: "Failed to reject item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string, type: 'book' | 'pdf') => {
    try {
      const table = type === 'book' ? 'books' : 'pdfs';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'book' ? 'Book' : 'PDF'} deleted successfully`,
      });

      // Refresh the lists
      fetchPendingItems();
      fetchApprovedItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
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
            <CardDescription>Please sign in to access the admin dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gurukul-blue/5 to-gurukul-green/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Pending Books', 
      value: pendingBooks.length.toString(), 
      icon: BookOpen, 
      color: 'text-gurukul-blue' 
    },
    { 
      label: 'Pending PDFs', 
      value: pendingPDFs.length.toString(), 
      icon: FileText, 
      color: 'text-gurukul-green' 
    },
    { 
      label: 'Approved Books', 
      value: approvedBooks.length.toString(), 
      icon: BookOpen, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Approved PDFs', 
      value: approvedPDFs.length.toString(), 
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

  const PendingItemCard = ({ item }: { item: PendingItem }) => (
    <Card key={item.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {item.type === 'book' ? (
                <BookOpen className="h-4 w-4 text-gurukul-blue" />
              ) : (
                <FileText className="h-4 w-4 text-gurukul-green" />
              )}
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <Badge variant="secondary">{item.category_name}</Badge>
            </div>
            
            {item.author && (
              <p className="text-sm text-muted-foreground mb-1">
                Author: {item.author}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground mb-1">
              Uploaded by: {item.uploader_name}
            </p>
            
            <p className="text-xs text-muted-foreground">
              {formatDate(item.created_at)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApproveItem(item.id, item.type)}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRejectItem(item.id, item.type)}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteItem(item.id, item.type)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ApprovedItemCard = ({ item }: { item: ApprovedItem }) => (
    <Card key={item.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {item.type === 'book' ? (
                <BookOpen className="h-4 w-4 text-blue-600" />
              ) : (
                <FileText className="h-4 w-4 text-green-600" />
              )}
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <Badge variant="outline">{item.category_name}</Badge>
            </div>
            
            {item.author && (
              <p className="text-sm text-muted-foreground mb-1">
                Author: {item.author}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground mb-1">
              {item.type === 'book' ? 'Seller' : 'Uploader'}: {item.seller_name}
            </p>

            {item.type === 'book' && item.price !== undefined && (
              <p className="text-sm text-muted-foreground mb-1">
                Price: {item.price > 0 ? `Rs.${item.price}` : 'FREE'}
              </p>
            )}

            {item.location && (
              <p className="text-sm text-muted-foreground mb-1">
                Location: {item.location}
              </p>
            )}

            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-1">
              <span>Uploaded: {formatDate(item.created_at)}</span>
              {item.views_count !== undefined && (
                <span>Views: {item.views_count}</span>
              )}
              {item.downloads_count !== undefined && (
                <span>Downloads: {item.downloads_count}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteItem(item.id, item.type)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage content and user submissions
            </p>
          </div>
          <Badge variant="default" className="bg-red-500">
            <ShieldCheck className="h-4 w-4 mr-1" />
            Admin
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="books">Pending Books ({pendingBooks.length})</TabsTrigger>
            <TabsTrigger value="pdfs">Pending PDFs ({pendingPDFs.length})</TabsTrigger>
            <TabsTrigger value="approved-books">Approved Books ({approvedBooks.length})</TabsTrigger>
            <TabsTrigger value="approved-pdfs">Approved PDFs ({approvedPDFs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Pending Books</span>
                </CardTitle>
                <CardDescription>
                  Review and approve book submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : pendingBooks.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No pending books to review
                  </p>
                ) : (
                  <div>
                    {pendingBooks.map((book) => (
                      <PendingItemCard key={book.id} item={book} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdfs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Pending PDFs</span>
                </CardTitle>
                <CardDescription>
                  Review and approve PDF submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : pendingPDFs.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No pending PDFs to review
                  </p>
                ) : (
                  <div>
                    {pendingPDFs.map((pdf) => (
                      <PendingItemCard key={pdf.id} item={pdf} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved-books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Approved Books</span>
                </CardTitle>
                <CardDescription>
                  View and manage books that sellers are selling
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : approvedBooks.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No approved books found
                  </p>
                ) : (
                  <div>
                    {approvedBooks.map((book) => (
                      <ApprovedItemCard key={book.id} item={book} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved-pdfs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Approved PDFs</span>
                </CardTitle>
                <CardDescription>
                  View and manage PDFs that users have uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : approvedPDFs.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No approved PDFs found
                  </p>
                ) : (
                  <div>
                    {approvedPDFs.map((pdf) => (
                      <ApprovedItemCard key={pdf.id} item={pdf} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
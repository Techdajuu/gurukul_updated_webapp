import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PDF {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_size?: number;
  downloads_count?: number;
  uploader_id: string;
  category_id: string;
  profiles?: {
    full_name: string;
  };
  categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const PDFs = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPDFs();
    fetchCategories();
  }, []);

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

  const fetchPDFs = async () => {
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select(`
          *,
          profiles!uploader_id(full_name),
          categories(name)
        `)
        .eq('status', 'approved')
        .order('downloads_count', { ascending: false });

      if (error) throw error;
      setPdfs(data || []);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to load PDFs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdf: PDF) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download PDFs",
        variant: "destructive",
      });
      return;
    }

    try {
      // Increment download count
      await supabase
        .from('pdfs')
        .update({ downloads_count: (pdf.downloads_count || 0) + 1 })
        .eq('id', pdf.id);

      // Open the PDF in a new tab
      window.open(pdf.file_url, '_blank');
      
      toast({
        title: "Download started",
        description: `Downloading "${pdf.title}"`,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (pdf: PDF) => {
    window.open(pdf.file_url, '_blank');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pdf.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Free PDF Library</h1>
            <p className="text-lg text-blue-100">
              Download study materials, notes, and guides shared by the community
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search PDFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
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
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredPDFs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No PDFs found matching your criteria.' 
                  : 'No PDFs available yet. Be the first to share!'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPDFs.map((pdf) => (
                <Card key={pdf.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {pdf.title}
                            </h3>
                            <Badge variant="secondary">{pdf.categories?.name}</Badge>
                          </div>
                          {pdf.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {pdf.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Download className="h-4 w-4" />
                              <span>{(pdf.downloads_count || 0).toLocaleString()}</span>
                            </div>
                            <span>{formatFileSize(pdf.file_size)}</span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Uploaded by {pdf.profiles?.full_name || 'Unknown'}
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDownload(pdf)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(pdf)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PDFs;
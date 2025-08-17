import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Star, FileText, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

const PDFLibrary = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPDFs();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('pdfs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pdfs',
          filter: 'status=eq.approved'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchPDFs(); // Refresh the list when a new PDF is added
          } else if (payload.eventType === 'UPDATE') {
            fetchPDFs(); // Refresh on updates
          } else if (payload.eventType === 'DELETE') {
            setPdfs(prev => prev.filter(pdf => pdf.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        .order('downloads_count', { ascending: false })
        .limit(6);

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

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Free PDF Library
            </h2>
            <p className="text-muted-foreground text-lg">
              Download study materials, notes, and guides shared by the community
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
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Free PDF Library
          </h2>
          <p className="text-muted-foreground text-lg">
            Download study materials, notes, and guides shared by the community
          </p>
        </div>

        {pdfs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No PDFs available yet. Be the first to share!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pdfs.map((pdf) => (
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

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/pdfs'}>
            View All PDFs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PDFLibrary;
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const UploadPDF = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Error",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadPDF = async () => {
    if (!file || !user) return null;

    const fileExt = 'pdf';
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to upload PDFs",
        variant: "destructive",
      });
      return;
    }

    if (!title || !categoryId || !file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload PDF file
      const fileUrl = await uploadPDF();
      
      if (!fileUrl) {
        throw new Error('Failed to upload PDF file');
      }

      // Insert PDF record
      const { error: pdfError } = await supabase
        .from('pdfs')
        .insert({
          uploader_id: profile.id,
          category_id: categoryId,
          title,
          description,
          file_url: fileUrl,
          file_size: file.size,
        });

      if (pdfError) {
        throw pdfError;
      }

      toast({
        title: "Success!",
        description: "Your PDF has been uploaded and is pending approval.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategoryId('');
      setFile(null);
      
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Upload PDF</span>
        </CardTitle>
        <CardDescription>
          Share educational materials with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pdf-title">Title *</Label>
              <Input
                id="pdf-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter PDF title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pdf-category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pdf-description">Description</Label>
            <Textarea
              id="pdf-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the content of the PDF, what it covers, and who it's useful for..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {!file ? (
                <Label htmlFor="pdf-file" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload PDF or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF files only (max 50MB)
                  </p>
                </Label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-gurukul-blue" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeFile}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Button type="submit" disabled={loading || !file} className="w-full">
            {loading ? "Uploading..." : "Upload PDF"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadPDF;
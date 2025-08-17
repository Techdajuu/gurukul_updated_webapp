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
import { Upload, ImagePlus, X, Phone } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const UploadBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    // Pre-fill phone number from profile if available
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
      
      // Create preview URLs
      const urls: string[] = [];
      Array.from(e.target.files).forEach(file => {
        urls.push(URL.createObjectURL(file));
      });
      setImagePreviewUrls(urls);
    }
  };

  const removeImage = (index: number) => {
    if (images) {
      const newFiles = Array.from(images);
      newFiles.splice(index, 1);
      
      const dt = new DataTransfer();
      newFiles.forEach(file => dt.items.add(file));
      setImages(dt.files);
      
      const newUrls = [...imagePreviewUrls];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      setImagePreviewUrls(newUrls);
    }
  };

  const uploadImages = async (bookId: string) => {
    if (!images || !user) return [];

    const uploadPromises = Array.from(images).map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${bookId}/${Date.now()}_${index}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('book-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('book-images')
        .getPublicUrl(fileName);

      return {
        book_id: bookId,
        image_url: publicUrl,
        is_primary: index === 0,
      };
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(result => result !== null);
  };

  const validateNepalPhoneNumber = (phone: string) => {
    if (!phone) return { isValid: false, error: 'Phone number is required for buyers to contact you' };
    
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Nepal mobile number patterns
    // Format: 98XXXXXXXX or 97XXXXXXXX (10 digits)
    // With country code: 977 + 98XXXXXXXX or 977 + 97XXXXXXXX
    const nepalMobileRegex = /^(977)?(98|97)\d{8}$/;
    
    if (!nepalMobileRegex.test(cleanPhone)) {
      return {
        isValid: false,
        error: 'Please enter a valid Nepal mobile number (98XXXXXXXX or 97XXXXXXXX)'
      };
    }
    
    return { isValid: true, error: '' };
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    const validation = validateNepalPhoneNumber(value);
    setPhoneError(validation.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to upload books",
        variant: "destructive",
      });
      return;
    }

    if (!title || !author || !condition || !categoryId || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including phone number",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    const phoneValidation = validateNepalPhoneNumber(phone);
    if (!phoneValidation.isValid) {
      toast({
        title: "Invalid Phone Number",
        description: phoneValidation.error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Insert book
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert({
          seller_id: profile.id,
          category_id: categoryId,
          title,
          author,
          condition: condition as 'new' | 'good' | 'used',
          price: parseFloat(price) || 0,
          description,
          location,
          seller_phone: phone.replace(/\D/g, ''), // Store clean phone number
        })
        .select()
        .single();

      if (bookError) {
        throw bookError;
      }

      // Upload images
      if (images && images.length > 0) {
        const imageData = await uploadImages(bookData.id);
        
        if (imageData.length > 0) {
          const { error: imageError } = await supabase
            .from('book_images')
            .insert(imageData);
          
          if (imageError) {
            console.error('Error saving image data:', imageError);
          }
        }
      }

      toast({
        title: "Success!",
        description: "Your book has been uploaded and is pending approval.",
      });

      // Reset form
      setTitle('');
      setAuthor('');
      setCondition('');
      setPrice('');
      setDescription('');
      setLocation('');
      setPhone('');
      setPhoneError('');
      setCategoryId('');
      setImages(null);
      setImagePreviewUrls([]);
      
      
    } catch (error: any) {
      console.error('Error uploading book:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Book</span>
        </CardTitle>
        <CardDescription>
          List your book for sale or share it for free
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs.) - Enter 0 for free</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone Number (Nepal) *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="98XXXXXXXX or 97XXXXXXXX"
                  className={`pl-10 ${phoneError ? 'border-destructive' : ''}`}
                  required
                />
              </div>
              {phoneError && (
                <p className="text-xs text-destructive">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Required for buyers to contact you about this book
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the book, its condition, and any other relevant details..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="images">Book Images</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Label htmlFor="images" className="cursor-pointer">
                <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload images or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload multiple images (JPG, PNG)
                </p>
              </Label>
            </div>
            
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Uploading..." : "Upload Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadBook;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  Calculator, 
  Microscope, 
  Palette, 
  Globe, 
  Code,
  BookOpen,
  FileText,
  Loader2
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const iconMap: { [key: string]: any } = {
  'Code': Code,
  'Microscope': Microscope,
  'Calculator': Calculator,
  'Palette': Palette,
  'Globe': Globe,
  'GraduationCap': GraduationCap,
  'BookOpen': BookOpen,
  'FileText': FileText,
};

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  book_count?: number;
  pdf_count?: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch categories with counts
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Get book and PDF counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const [booksResult, pdfsResult] = await Promise.all([
            supabase
              .from('books')
              .select('id', { count: 'exact' })
              .eq('category_id', category.id)
              .eq('status', 'approved'),
            supabase
              .from('pdfs')
              .select('id', { count: 'exact' })
              .eq('category_id', category.id)
              .eq('status', 'approved')
          ]);

          return {
            ...category,
            book_count: booksResult.count || 0,
            pdf_count: pdfsResult.count || 0,
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName || !iconMap[iconName]) {
      return BookOpen; // Default icon
    }
    return iconMap[iconName];
  };

  const getRandomColor = (index: number) => {
    const colors = [
      "text-orange-500",
      "text-blue-500", 
      "text-green-500",
      "text-purple-500",
      "text-red-500",
      "text-yellow-500",
    ];
    return colors[index % colors.length];
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/books?category=${categoryId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Find exactly what you need for your studies
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
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Find exactly what you need for your studies
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg">
              No categories available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon);
              const totalItems = (category.book_count || 0) + (category.pdf_count || 0);
              
              return (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/50 backdrop-blur-sm"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="mb-3 sm:mb-4 flex justify-center">
                      <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-background group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${getRandomColor(index)}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {totalItems} items
                    </p>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mt-1 sm:mt-2 line-clamp-2 hidden sm:block">
                        {category.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
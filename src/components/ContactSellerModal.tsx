import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, User, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  location?: string;
  seller_phone?: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

const ContactSellerModal = ({ isOpen, onClose, book }: ContactSellerModalProps) => {
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleWhatsAppContact = () => {
    setLoading(true);
    const sellerName = book.profiles?.full_name || 'Seller';
    const bookTitle = book.title;
    const price = book.price > 0 ? `Rs.${book.price}` : 'FREE';
    
    const message = `Hi ${sellerName}! I'm interested in your book "${bookTitle}" listed for ${price} on Gurukul Pustakalaya. Is it still available?`;
    
    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = '';
    
    if (book.seller_phone) {
      // Remove any non-digit characters
      const cleanPhone = book.seller_phone.replace(/\D/g, '');
      
      // Format Nepal phone number for WhatsApp
      let phoneNumber = cleanPhone;
      
      // If it doesn't start with 977 (Nepal country code), add it
      if (!cleanPhone.startsWith('977')) {
        phoneNumber = `977${cleanPhone}`;
      }
      
      whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    } else {
      // Fallback to general WhatsApp
      whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    }
    
    window.open(whatsappUrl, '_blank');
    setLoading(false);
    onClose();
  };

  const handlePhoneCall = () => {
    if (book.seller_phone) {
      // Format phone number for calling
      const cleanPhone = book.seller_phone.replace(/\D/g, '');
      
      // For Nepal numbers, we can dial directly
      let phoneNumber = cleanPhone;
      
      // If it doesn't start with 977, add it for international calling
      if (!cleanPhone.startsWith('977')) {
        phoneNumber = `+977${cleanPhone}`;
      } else {
        phoneNumber = `+${cleanPhone}`;
      }
      
      window.open(`tel:${phoneNumber}`, '_self');
      onClose();
    } else {
      // Fallback message if no phone number
      alert('Phone number not available. Try contacting via WhatsApp.');
    }
  };

  const formatDisplayPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Format for display: +977-98XXXXXXXX or +977-97XXXXXXXX
    if (cleanPhone.startsWith('977') && cleanPhone.length === 13) {
      return `+977-${cleanPhone.slice(3, 5)}-${cleanPhone.slice(5)}`;
    } else if (cleanPhone.length === 10) {
      return `+977-${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2)}`;
    }
    
    return phone; // Return as-is if format is unexpected
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Contact Seller</span>
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to contact the seller about this book
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Seller Info */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={book.profiles?.avatar_url || undefined} />
              <AvatarFallback>
                {book.profiles?.full_name ? getInitials(book.profiles.full_name) : 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">
                {book.profiles?.full_name || 'Unknown Seller'}
              </h4>
              {book.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {book.location}
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="p-4 bg-card border rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">{book.title}</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">by {book.author}</span>
              <Badge variant="outline">
                {book.price > 0 ? `Rs.${book.price}` : 'FREE'}
              </Badge>
            </div>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleWhatsAppContact}
              disabled={loading}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact via WhatsApp
            </Button>
            
            {book.seller_phone && (
              <Button
                onClick={handlePhoneCall}
                variant="outline"
                className="w-full justify-start"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call {formatDisplayPhone(book.seller_phone)}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Be respectful and follow community guidelines when contacting sellers
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerModal;
import { Facebook, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://www.facebook.com/people/gurukulpustakalaya/61579736211123/?rdid=WjDLnp8F9XjvNhA6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GvQF5YBDP%2F" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://www.tiktok.com/@gurukulpustakalay?_t=ZS-8ytjjxMicbd&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://www.instagram.com/gurukulpustakalaya/?igsh=MWF2NnQ1ZHhiNzZtZA%3D%3D#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://mail.google.com/mail/?view=cm&to=Gurukulpustakalaya@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email Support">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Gurukul Pustakalaya. Made for students by students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
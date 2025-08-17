import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  Book, 
  Upload, 
  Search,
  Shield,
  FileText,
  Users,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I upload a book for sale?",
      answer: "Sign in to your account, go to your Dashboard, and click on 'Upload Book'. Fill in the required details including title, author, price, condition, and upload clear photos of your book."
    },
    {
      question: "How do I contact a seller?",
      answer: "Browse books and click 'Contact Seller' on any book listing. You'll need to sign in first. The seller will receive your message and can respond directly."
    },
    {
      question: "What categories of books are accepted?",
      answer: "We accept academic textbooks, reference books, novels, competitive exam books, and educational PDFs across various subjects and levels."
    },
    {
      question: "How long does book approval take?",
      answer: "Book listings are typically reviewed and approved within 24-48 hours. You'll be notified once your book is live on the platform."
    },
    {
      question: "Can I share PDFs for free?",
      answer: "Yes! You can upload educational PDFs to share with the community. All PDFs go through a review process to ensure quality and appropriateness."
    },
    {
      question: "How do I edit my profile?",
      answer: "Go to your Dashboard and click on the 'Profile' tab. You can update your name, contact information, and profile picture there."
    }
  ];

  const quickActions = [
    {
      title: "Browse Books",
      description: "Find textbooks and educational materials",
      icon: Book,
      link: "/books",
      color: "text-blue-600"
    },
    {
      title: "Upload Content",
      description: "Share your books or PDFs",
      icon: Upload,
      link: "/dashboard",
      color: "text-green-600"
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: Mail,
      link: "/contact",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => (
            <Card key={action.title} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`mx-auto p-3 rounded-full bg-secondary/20 w-fit mb-4`}>
                  <action.icon className={`h-8 w-8 ${action.color}`} />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  <Link to={action.link}>
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start space-x-3 text-lg">
                    <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                Learn how we protect and handle your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/privacy-policy">Read Policy</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Terms of Service</CardTitle>
              <CardDescription>
                Understand our terms and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/terms-of-service">Read Terms</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get personalized help from our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Still Need Help */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="text-center py-8">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Still Need Help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
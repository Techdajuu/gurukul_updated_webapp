import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Database, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect your name, email address, phone number, and other contact details you provide."
        },
        {
          subtitle: "Content Information",
          text: "Information about books and PDFs you upload, including titles, descriptions, images, and categories."
        },
        {
          subtitle: "Usage Information",
          text: "Data about how you use our platform, including pages visited, features used, and interaction patterns."
        },
        {
          subtitle: "Device Information",
          text: "Technical information about your device, browser type, IP address, and operating system."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        {
          subtitle: "Platform Operation",
          text: "To provide and maintain our services, process transactions, and enable communication between users."
        },
        {
          subtitle: "Personalization",
          text: "To customize your experience and show relevant content based on your interests and activity."
        },
        {
          subtitle: "Communication",
          text: "To send you updates, notifications, and respond to your inquiries and support requests."
        },
        {
          subtitle: "Security and Safety",
          text: "To protect our platform, prevent fraud, and ensure the safety of our community."
        }
      ]
    },
    {
      title: "Information Sharing",
      icon: Users,
      content: [
        {
          subtitle: "Public Listings",
          text: "Book and PDF listings you create are publicly visible to help other users find your content."
        },
        {
          subtitle: "User Communication",
          text: "Your contact information may be shared with other users when they express interest in your listings."
        },
        {
          subtitle: "Service Providers",
          text: "We may share data with trusted third-party services that help us operate our platform."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law or to protect the rights and safety of our users."
        }
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your data during transmission and storage."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and authentication measures to protect your information."
        },
        {
          subtitle: "Regular Monitoring",
          text: "Our systems are continuously monitored for security threats and vulnerabilities."
        },
        {
          subtitle: "Data Backup",
          text: "We maintain secure backups of your data to prevent loss and ensure service continuity."
        }
      ]
    },
    {
      title: "Your Rights and Choices",
      icon: Shield,
      content: [
        {
          subtitle: "Access and Updates",
          text: "You can access and update your personal information through your account settings at any time."
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your account and associated data by contacting our support team."
        },
        {
          subtitle: "Privacy Settings",
          text: "You can control various privacy settings and preferences through your account dashboard."
        },
        {
          subtitle: "Communication Preferences",
          text: "You can opt out of non-essential communications and notifications in your account settings."
        }
      ]
    },
    {
      title: "International Users",
      icon: Globe,
      content: [
        {
          subtitle: "Data Transfer",
          text: "Your information may be transferred and processed in countries other than your country of residence."
        },
        {
          subtitle: "Legal Compliance",
          text: "We comply with applicable data protection laws in the jurisdictions where we operate."
        },
        {
          subtitle: "Cross-Border Protection",
          text: "We ensure appropriate safeguards are in place for international data transfers."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how Gurukul Pustakalaya collects, 
            uses, and protects your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Gurukul Pustakalaya ("we," "our," or "us") is committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy describes how we collect, use, 
              disclose, and safeguard your information when you use our platform for buying, selling, and 
              sharing educational materials.
            </p>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="font-semibold text-foreground mb-2">{item.subtitle}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cookies Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                These technologies help us remember your preferences, analyze site usage, and provide personalized content.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">Required for basic site functionality and security.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">Help us understand how users interact with our platform.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Questions About Our Privacy Policy?
              </h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions or concerns about this Privacy Policy or our data practices, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <a 
                  href="mailto:Gurukulpustakalaya@gmail.com"
                  className="text-primary hover:underline font-medium"
                >
                  Gurukulpustakalaya@gmail.com
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a 
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Contact Form
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates Notice */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Changes to This Privacy Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              applicable laws. We will notify you of any material changes by posting the updated policy on 
              our platform and updating the "Last updated" date. Your continued use of our services after 
              any changes indicates your acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
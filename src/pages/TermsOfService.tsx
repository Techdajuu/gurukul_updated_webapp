import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Shield, Gavel, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: [
        {
          text: "By accessing and using Gurukul Pustakalaya, you accept and agree to be bound by the terms and provision of this agreement."
        },
        {
          text: "If you do not agree to abide by these terms, you are not authorized to use or access this platform."
        },
        {
          text: "These terms apply to all visitors, users, and others who access or use the service."
        }
      ]
    },
    {
      title: "User Accounts and Registration",
      icon: Users,
      content: [
        {
          text: "You must register for an account to access certain features of our platform."
        },
        {
          text: "You are responsible for maintaining the confidentiality of your account credentials."
        },
        {
          text: "You must provide accurate and complete information during registration."
        },
        {
          text: "You are responsible for all activities that occur under your account."
        },
        {
          text: "You must notify us immediately of any unauthorized use of your account."
        }
      ]
    },
    {
      title: "Platform Usage",
      icon: FileText,
      content: [
        {
          text: "Our platform is designed for buying, selling, and sharing educational materials among students and educators."
        },
        {
          text: "You may only upload content that you own or have the right to distribute."
        },
        {
          text: "All uploaded content must be educational in nature and appropriate for our community."
        },
        {
          text: "You are responsible for the accuracy of all information you provide about your listings."
        },
        {
          text: "We reserve the right to review and approve all content before it becomes publicly available."
        }
      ]
    },
    {
      title: "Prohibited Activities",
      icon: AlertTriangle,
      content: [
        {
          text: "Uploading copyrighted materials without proper authorization."
        },
        {
          text: "Posting false, misleading, or fraudulent content or information."
        },
        {
          text: "Engaging in harassment, bullying, or inappropriate behavior toward other users."
        },
        {
          text: "Using the platform for commercial purposes outside of selling educational materials."
        },
        {
          text: "Attempting to interfere with the platform's security or functionality."
        },
        {
          text: "Creating multiple accounts to circumvent restrictions or bans."
        }
      ]
    },
    {
      title: "Content and Intellectual Property",
      icon: Shield,
      content: [
        {
          text: "You retain ownership of the content you upload to our platform."
        },
        {
          text: "By uploading content, you grant us a license to display and distribute it on our platform."
        },
        {
          text: "You represent that you have all necessary rights to upload and share your content."
        },
        {
          text: "We respect intellectual property rights and will respond to valid takedown notices."
        },
        {
          text: "Users found to be repeatedly infringing on intellectual property rights may be banned."
        }
      ]
    },
    {
      title: "Transactions and Payments",
      icon: Gavel,
      content: [
        {
          text: "All transactions between buyers and sellers are conducted directly between the parties."
        },
        {
          text: "Gurukul Pustakalaya facilitates connections but is not party to individual transactions."
        },
        {
          text: "We do not handle payments or guarantee the quality of items sold."
        },
        {
          text: "Disputes between buyers and sellers should be resolved directly between the parties."
        },
        {
          text: "We reserve the right to remove listings that violate our terms or community standards."
        }
      ]
    }
  ];

  const additionalTerms = [
    {
      title: "Limitation of Liability",
      content: "Gurukul Pustakalaya is provided on an 'as-is' basis. We make no warranties about the platform's availability, reliability, or suitability for any purpose. We are not liable for any damages arising from your use of the platform."
    },
    {
      title: "Indemnification",
      content: "You agree to indemnify and hold harmless Gurukul Pustakalaya from any claims, damages, or expenses arising from your use of the platform or violation of these terms."
    },
    {
      title: "Privacy and Data Protection",
      content: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information."
    },
    {
      title: "Termination",
      content: "We may terminate or suspend your account and access to the platform at our discretion, with or without notice, for conduct that we believe violates these terms or is harmful to other users."
    },
    {
      title: "Governing Law",
      content: "These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the jurisdiction of Indian courts."
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
              <Gavel className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using Gurukul Pustakalaya. These terms govern your 
            use of our platform and services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Gurukul Pustakalaya. These Terms of Service ("Terms") govern your use of our 
              platform and services. By using our platform, you agree to comply with and be bound by 
              these terms. Please read them carefully before using our services.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
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
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Terms */}
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Additional Terms and Conditions
          </h2>
          
          {additionalTerms.map((term, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{term.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{term.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Gurukul Pustakalaya is built on trust and respect among community members. We expect all users to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">✅ Do</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be honest and accurate in your listings</li>
                  <li>• Treat other users with respect</li>
                  <li>• Respond promptly to inquiries</li>
                  <li>• Share quality educational content</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">❌ Don't</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload copyrighted materials without permission</li>
                  <li>• Post misleading information</li>
                  <li>• Engage in spam or harassment</li>
                  <li>• Use the platform for non-educational purposes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please contact us. 
                We're here to help clarify any concerns you may have.
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
            <h3 className="text-lg font-semibold text-foreground mb-3">Changes to These Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users of 
              any material changes by posting the updated terms on our platform and updating the "Last updated" 
              date. Your continued use of our services after any changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
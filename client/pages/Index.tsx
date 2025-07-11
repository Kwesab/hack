import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  FileText,
  Shield,
  Smartphone,
  CreditCard,
  Clock,
  CheckCircle,
  Users,
  Award,
  Download,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ttu-navy to-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ttu-navy">TTU DocPortal</h1>
              <p className="text-xs text-muted-foreground">
                Takoradi Technical University
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#services"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="#support"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Support
            </a>
            <Link to="/login">
              <Button variant="outline" className="ml-4">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-ttu-gold/10 text-ttu-gold hover:bg-ttu-gold/20 border-ttu-gold/20">
                  🎓 Official TTU Document Services
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-ttu-navy">
                  Request Your Academic
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-ttu-gold">
                    {" "}
                    Documents
                  </span>
                  <br />
                  Digitally
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Fast, secure, and convenient way to request transcripts,
                  certificates, and attestations from Takoradi Technical
                  University. Get your documents delivered digitally or by mail.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-ttu-navy hover:bg-ttu-navy/90 text-white w-full sm:w-auto"
                  >
                    Request Documents
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-ttu-navy text-ttu-navy hover:bg-ttu-navy hover:text-white w-full sm:w-auto"
                  >
                    Track Request
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">
                    Ghana Card Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">Secure Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">24-48 Hours</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-elevation-3 p-8 border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-ttu-navy">
                      Document Request
                    </h3>
                    <Badge className="bg-success/10 text-success">Active</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-ttu-navy rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Official Transcript</p>
                        <p className="text-sm text-muted-foreground">
                          Bachelor of Technology
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-medium text-success">
                          Processing
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Delivery
                        </p>
                        <p className="text-sm font-medium">Digital + Mail</p>
                      </div>
                    </div>

                    <div className="w-full bg-ttu-light-blue rounded-full h-2">
                      <div className="bg-ttu-navy h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-ttu-gold rounded-xl p-4 shadow-elevation-2">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-success rounded-xl p-4 shadow-elevation-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary">
              Available Services
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-ttu-navy">
              What You Can Request
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All your academic documents, authenticated and delivered securely
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-ttu-navy to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-ttu-navy">
                  Official Transcripts
                </CardTitle>
                <CardDescription>
                  Comprehensive academic records with grades and course details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Undergraduate & Graduate</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Official University Seal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Digital & Physical Copies</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Request Transcript
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-ttu-gold to-warning rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-ttu-navy">Certificates</CardTitle>
                <CardDescription>
                  Official degree and diploma certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Degree Certificates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Diploma Certificates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Replacement Copies</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Request Certificate
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-info rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-ttu-navy">Attestations</CardTitle>
                <CardDescription>
                  Verified and authenticated document confirmations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Document Verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Academic Standing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Letter of Good Standing</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Request Attestation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-ttu-gray/30">
        <div className="container max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-ttu-gold/10 text-ttu-gold">
              Simple Process
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-ttu-navy">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your documents in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Verify Identity",
                description:
                  "Upload your Ghana Card for secure identity verification",
              },
              {
                step: "02",
                icon: FileText,
                title: "Select Documents",
                description:
                  "Choose the academic documents you need from our catalog",
              },
              {
                step: "03",
                icon: CreditCard,
                title: "Make Payment",
                description: "Pay securely using mobile money or card payment",
              },
              {
                step: "04",
                icon: Download,
                title: "Receive Documents",
                description:
                  "Get digital copies instantly and physical copies by mail",
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-ttu-navy to-primary rounded-2xl flex items-center justify-center mx-auto">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-ttu-gold text-white">
                    {step.step}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-ttu-navy">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary">
                  Why Choose TTU DocPortal
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-ttu-navy">
                  Secure, Fast & Reliable
                </h2>
                <p className="text-xl text-muted-foreground">
                  Built with modern security standards and designed for the
                  Ghanaian academic environment
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-ttu-navy">
                    Ghana Card Integration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Secure identity verification using official Ghana Card
                    system
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-info" />
                  </div>
                  <h3 className="font-semibold text-ttu-navy">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time updates sent directly to your mobile phone
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-warning" />
                  </div>
                  <h3 className="font-semibold text-ttu-navy">Mobile Money</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay with MTN, Vodafone, or AirtelTigo mobile money
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 bg-ttu-gold/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-ttu-gold" />
                  </div>
                  <h3 className="font-semibold text-ttu-navy">
                    Quick Processing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Most requests processed within 24-48 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-ttu-navy to-primary rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Star className="h-8 w-8 text-ttu-gold" />
                    <div>
                      <h3 className="text-xl font-semibold">
                        Trusted by Students
                      </h3>
                      <p className="text-ttu-light-blue">
                        Over 10,000+ documents delivered
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Document Accuracy</span>
                        <span className="text-sm font-medium">99.9%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-ttu-gold h-2 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Delivery Speed</span>
                        <span className="text-sm font-medium">24-48 hrs</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ttu-navy to-primary">
        <div className="container max-w-4xl text-center">
          <div className="space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Get Your Documents?
            </h2>
            <p className="text-xl text-ttu-light-blue max-w-2xl mx-auto">
              Join thousands of TTU graduates who trust our secure document
              delivery system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-ttu-navy hover:bg-ttu-gray"
              >
                Start Your Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-ttu-navy"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-ttu-navy to-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-ttu-navy">TTU DocPortal</h3>
                  <p className="text-xs text-muted-foreground">
                    Official Document Services
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure, fast, and reliable academic document delivery for TTU
                students and alumni.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-ttu-navy">Services</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Transcripts
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Certificates
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Attestations
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Verifications
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-ttu-navy">Support</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Track Request
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-ttu-navy">Legal</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary"
                >
                  Security
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Takoradi Technical University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

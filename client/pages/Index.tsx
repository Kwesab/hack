import { useState, useEffect } from "react";
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
  Zap,
  Globe,
  ChevronDown,
  Menu,
  X,
  Play,
  TrendingUp,
  BookOpen,
  Lock,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                    alt="TTU Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-yellow-900" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TTU DocPortal
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Takoradi Technical University
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#services"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a
                href="#support"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
              <div className="px-6 py-4 space-y-3">
                <a
                  href="#services"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Services
                </a>
                <a
                  href="#how-it-works"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#support"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Support
                </a>
                <Link to="/login" className="block pt-3">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 pb-20 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8 lg:space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">
                    Official TTU Document Services
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                  Get Your
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Academic Documents
                  </span>
                  <span className="block text-gray-900">Instantly</span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  The fastest and most secure way to request transcripts,
                  certificates, and attestations from Takoradi Technical
                  University.
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600">
                    Documents Delivered
                  </div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                    24hr
                  </div>
                  <div className="text-sm text-gray-600">
                    Average Processing
                  </div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                    Request Documents
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-gray-300 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 group w-full sm:w-auto"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Ghana Card Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Bank-Level Security
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-100 overflow-hidden">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Document Request
                        </h3>
                        <p className="text-sm text-gray-500">
                          Official Transcript
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full">
                      Processing
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">75%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-3 rounded-full w-3/4 relative">
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-lg"></div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Type
                      </p>
                      <p className="font-medium text-gray-900">
                        Bachelor's Transcript
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Delivery
                      </p>
                      <p className="font-medium text-gray-900">
                        Digital + Mail
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Payment Confirmed
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        2:30 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Identity Verified
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        2:15 PM
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-700 font-medium">
                        Processing Document
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">Now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/4 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 lg:py-32 bg-gray-50/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16 lg:mb-20">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 rounded-full text-sm font-medium">
              Available Services
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
              What You Can
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Request
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              All your academic documents, authenticated and delivered with
              unmatched security and speed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: FileText,
                title: "Official Transcripts",
                description:
                  "Complete academic records with official university seal and digital verification",
                features: [
                  "Undergraduate & Graduate",
                  "Official University Seal",
                  "Digital + Physical Copies",
                ],
                gradient: "from-blue-500 to-indigo-600",
                bgGradient: "from-blue-50 to-indigo-50",
              },
              {
                icon: Award,
                title: "Certificates",
                description:
                  "Official degree and diploma certificates with authentication codes",
                features: [
                  "Degree Certificates",
                  "Diploma Certificates",
                  "Replacement Copies",
                ],
                gradient: "from-yellow-500 to-orange-600",
                bgGradient: "from-yellow-50 to-orange-50",
              },
              {
                icon: Shield,
                title: "Attestations",
                description:
                  "Verified document confirmations and academic standing letters",
                features: [
                  "Document Verification",
                  "Academic Standing",
                  "Letter of Good Standing",
                ],
                gradient: "from-green-500 to-emerald-600",
                bgGradient: "from-green-50 to-emerald-50",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl overflow-hidden"
              >
                <CardHeader className="text-center pb-4 relative">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg transition-all duration-300 text-white py-3 rounded-xl font-medium`}
                  >
                    Request Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16 lg:mb-20">
            <Badge className="bg-green-50 text-green-700 border-green-200 px-4 py-2 rounded-full text-sm font-medium">
              Simple Process
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
              How It
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get your documents in just four simple steps with our streamlined
              process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                icon: Users,
                title: "Verify Identity",
                description:
                  "Upload your Ghana Card for secure identity verification using advanced biometric technology",
                color: "blue",
              },
              {
                step: "02",
                icon: FileText,
                title: "Select Documents",
                description:
                  "Choose from our comprehensive catalog of academic documents and certificates",
                color: "purple",
              },
              {
                step: "03",
                icon: CreditCard,
                title: "Secure Payment",
                description:
                  "Pay safely using mobile money, bank cards, or our integrated payment partners",
                color: "yellow",
              },
              {
                step: "04",
                icon: Download,
                title: "Instant Delivery",
                description:
                  "Receive digital copies instantly and track physical delivery in real-time",
                color: "green",
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-6 group">
                <div className="relative">
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${
                      step.color === "blue"
                        ? "from-blue-500 to-indigo-600"
                        : step.color === "purple"
                          ? "from-purple-500 to-indigo-600"
                          : step.color === "yellow"
                            ? "from-yellow-500 to-orange-600"
                            : "from-green-500 to-emerald-600"
                    } rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <step.icon className="h-12 w-12 text-white" />
                  </div>
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${
                      step.color === "blue"
                        ? "from-blue-600 to-indigo-700"
                        : step.color === "purple"
                          ? "from-purple-600 to-indigo-700"
                          : step.color === "yellow"
                            ? "from-yellow-600 to-orange-700"
                            : "from-green-600 to-emerald-700"
                    } rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                  >
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50/30"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-8 lg:space-y-10">
              <div className="space-y-6">
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                  Why Choose TTU DocPortal
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
                  Built for
                  <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Modern Ghana
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Designed specifically for the Ghanaian academic ecosystem with
                  cutting-edge security and local payment integration
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Ghana Card Integration",
                    description:
                      "Seamless verification using the official Ghana Card system",
                    color: "green",
                  },
                  {
                    icon: Smartphone,
                    title: "SMS Notifications",
                    description:
                      "Real-time updates sent directly to your mobile phone",
                    color: "blue",
                  },
                  {
                    icon: CreditCard,
                    title: "Mobile Money",
                    description:
                      "MTN, Vodafone, and AirtelTigo mobile money support",
                    color: "yellow",
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Most requests processed within 24-48 hours",
                    color: "purple",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group space-y-4 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${
                        feature.color === "green"
                          ? "from-green-500 to-emerald-600"
                          : feature.color === "blue"
                            ? "from-blue-500 to-indigo-600"
                            : feature.color === "yellow"
                              ? "from-yellow-500 to-orange-600"
                              : "from-purple-500 to-indigo-600"
                      } rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-10 text-white shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Trusted by Students
                      </h3>
                      <p className="text-gray-300">
                        Nationwide leader in academic document services
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">10,000+</div>
                      <div className="text-gray-300">Documents Delivered</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">99.9%</div>
                      <div className="text-gray-300">Accuracy Rate</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">24hr</div>
                      <div className="text-gray-300">Avg Processing</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-gray-300">Secure Delivery</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">
                          Student Satisfaction
                        </span>
                        <span className="text-sm font-bold">98.7%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-[98.7%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzY2NjY2NiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30"></div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="text-center space-y-8 lg:space-y-10 max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1]">
              Ready to Get Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Documents?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Join thousands of TTU graduates who trust our secure, fast, and
              reliable document delivery system
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center pt-4">
              <Link to="/login">
                <Button className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                  Start Your Request
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 w-full sm:w-auto"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Learn More
              </Button>
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="border-2 border-yellow-300/50 text-yellow-200 hover:bg-yellow-300/10 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 w-full sm:w-auto"
                >
                  🔧 Admin Dashboard (Test)
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Instant Digital Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo & Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-700">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                    alt="TTU Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    TTU DocPortal
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Official Document Services
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The most secure and efficient way to request academic documents
                from Takoradi Technical University.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">Services</h4>
              <div className="space-y-3">
                {[
                  "Official Transcripts",
                  "Degree Certificates",
                  "Attestations",
                  "Document Verification",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">Support</h4>
              <div className="space-y-3">
                {["Help Center", "Track Request", "Contact Us", "FAQ"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">Legal</h4>
              <div className="space-y-3">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Security",
                  "Compliance",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Takoradi Technical University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  WifiOff,
  Zap,
  Landmark,
  Lock,
  Book,
  Database,
  PersonStanding,
  CircleUserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Clear Your <span className="text-blue-400">Exams</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-10 text-balance">
            AI-powered chatbot to help you prepare and pass in your exams at the
            last minute. A chatbot that knows your syllabus, your exam patterm
            and resources provided by your institution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gap-2 px-10 py-8">
              Try JasaiPass <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-muted shadow-2xl">
          <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
            <div className="w-full">
              <Image
                src="/home.png"
                alt="Hero Image"
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to pass just before your exams, all in one
            place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Feature Card 1 */}
          <Card className="p-8 border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your study materials to provide personalized
                  exam tips and resources.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature Card 2 */}
          <Card className="p-8 border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <WifiOff className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Offline Access
                </h3>
                <p className="text-muted-foreground">
                  Download study materials and access them without an internet
                  connection.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature Card 3 */}
          <Card className="p-8 border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <Book className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Detailed Study Guides
                </h3>
                <p className="text-muted-foreground">
                  Generate comprehensive study guides tailored to your syllabus
                  and exam format.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature Card 4 */}
          <Card className="p-8 border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <Database className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Full Past Questions Database
                </h3>
                <p className="text-muted-foreground">
                  Access a comprehensive database of past exam questions to
                  practice and prepare effectively.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 text-center">
          How People are using JassaiPass
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Use Case 1 */}
          <div className="group">
            <div className="bg-primary/5 rounded-lg p-8 mb-4 group-hover:bg-primary/10 transition-colors">
              <Landmark className="w-12 h-12 text-primary mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              For Institutions
            </h3>
            <p className="text-muted-foreground mb-4">
              Colleges & Universities use JassaiPass to help students prepare
              effectively with AI-driven study aids.
            </p>
          </div>

          {/* Use Case 2 */}
          <div className="group">
            <div className="bg-primary/5 rounded-lg p-8 mb-4 group-hover:bg-primary/10 transition-colors">
              <CircleUserRound className="w-12 h-12 text-primary mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              For Professionals
            </h3>
            <p className="text-muted-foreground mb-4">
              Professionals are leveraging JassaiPass to upskill and certify
              themselves with last-minute exam prep.
            </p>
          </div>

          {/* Use Case 3 */}
          <div className="group">
            <div className="bg-primary/5 rounded-lg p-8 mb-4 group-hover:bg-primary/10 transition-colors">
              <PersonStanding className="w-12 h-12 text-primary mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              For Individuals
            </h3>
            <p className="text-muted-foreground mb-4">
              Individuals are using JassaiPass to catch up quickly and pass
              exams with last-minute AI assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
          What People Are Saying
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              text: '"jassaiPass is incredibly intuitive. I sleep better knowing my passwords are secure."',
              author: "Sarah Chen",
              role: "Tech Founder",
              avatar: "SC",
            },
            {
              text: '"The AI features saved us hours of security work. Best investment we made this year."',
              author: "Michael Rodriguez",
              role: "CTO, StartupXYZ",
              avatar: "MR",
            },
            {
              text: '"Finally, a password manager that doesn\'t feel like a chore to use."',
              author: "Emma Thompson",
              role: "Product Manager",
              avatar: "ET",
            },
          ].map((testimonial, i) => (
            <Card key={i} className="p-8 border-border">
              <p className="text-muted-foreground mb-6 italic">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border"
      >
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "Is jassaiPass really free?",
              a: "We offer three plans: Free, Premium, and Enterprise, catering to different needs and budgets.",
            },
            {
              q: "Can I depend on JassaiPass for my exam preparation?",
              a: "Yes, JassaiPass provides AI-powered tools to help you study efficiently and effectively.",
            },
            {
              q: "How is it better than other exam prep tools?",
              a: "Its a RAG based system containing your syllabus and relevant study materials providing personalized answers.",
            },
            {
              q: "Does jassaiPass work offline?",
              a: "Yes. You can save materials for offline access and study anytime, anywhere.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="p-6 border-border cursor-pointer hover:border-primary/50 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
              <p className="text-muted-foreground">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
          Ready to clear all your exams?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Join thousands of users who trust JassaiPass to help them succeed in
          their exams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="gap-2">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              router.push("/pricing");
            }}
          >
            Explore Pricing
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          No credit card required • Free forever plan available
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="w-6 h-6 text-primary" />
                <span className="font-bold text-foreground">jassaiPass</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your secure password manager, powered by AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 jassaiPass. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition text-sm"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition text-sm"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

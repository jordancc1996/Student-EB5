import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Award, Globe } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Free Resource',
    description:
      'StudentEB5 is completely free—no hidden fees, no consultations required. Just reliable information to help you understand your options.',
  },
  {
    icon: Users,
    title: 'Comprehensive Coverage',
    description:
      'Serving international students, professionals, and H1B visa holders with clear information about the EB-5 pathway to permanent residency.',
  },
  {
    icon: Award,
    title: 'Educational Focus',
    description:
      'We provide straightforward, educational content about the EB-5 program so you can make informed decisions about your future.',
  },
  {
    icon: Globe,
    title: 'Accessible Information',
    description:
      'Breaking down complex immigration processes into easy-to-understand resources for individuals worldwide.',
  },
];

const AboutMainContent = () => {
  return (
    <>
      {/* Mission Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              StudentEB5 was created to provide clear, accessible information about the EB-5 investment
              immigration program for those seeking to build their future in the United States. Learn more
              about{' '}
              <a href="/research/5-reasons-switch-h1b-to-eb5" className="text-primary hover:underline">
                5 reasons to switch from H-1B to EB-5
              </a>{' '}
              and explore{' '}
              <a href="/research/f1-students/f1-to-eb5-green-card" className="text-primary hover:underline">
                EB-5 academic opportunities for students
              </a>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We understand the unique challenges that international students, professionals, and H1B visa
              holders face—from managing OPT periods to navigating visa uncertainties and lottery systems.
              Our mission is to help you understand how the EB-5 program can provide a reliable pathway to
              achieving permanent residency. Visit our{' '}
              <a href="/faq" className="text-primary hover:underline">
                FAQ page
              </a>{' '}
              to find answers to common questions or read about{' '}
              <a href="/research/f1-students/f1-to-eb5-green-card" className="text-primary hover:underline">
                the F-1 to green card journey
              </a>{' '}
              to understand what to expect.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This platform is completely free and designed to help you make informed decisions about your
              immigration options. Check out our{' '}
              <a href="/research/h1b-eb5-financial-planning" className="text-primary hover:underline">
                financial planning guide for EB-5
              </a>{' '}
              or browse our full{' '}
              <a href="/resources" className="text-primary hover:underline">
                resources library
              </a>{' '}
              for detailed guides and official forms. Want to know how we can specifically help you? Visit
              our{' '}
              <a href="/faq/how-studenteb5-can-help" className="text-primary hover:underline">
                FAQ on how StudentEB5 can help
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values Grid */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">What Sets Us Apart</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Who We Serve Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-serif font-bold mb-6">Who Can Benefit from EB-5?</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>International Students:</strong> The EB-5 program offers a direct path to permanent
                residency without the uncertainties of OPT limitations or employer sponsorship. You can begin
                the process while still studying, giving you peace of mind for your future. Read our guide
                on{' '}
                <a href="/research/f1-students/f1-to-eb5-green-card" className="text-primary hover:underline">
                  why F-1 and OPT students should consider EB-5 now
                </a>
                .
              </p>
              <p>
                <strong>H1B Visa Holders:</strong> Avoid the stress of annual renewals and lottery systems.
                EB-5 provides a pathway to permanent residency that's not dependent on employer sponsorship,
                giving you more career flexibility and stability. Learn about{' '}
                <a href="/research/eb5-lifeline-h1b-workers" className="text-primary hover:underline">
                  why EB-5 is a lifeline for H-1B workers
                </a>
                .
              </p>
              <p>
                <strong>Professionals:</strong> Whether you're on an L-1, E-2, or other work visa, EB-5 can
                provide a permanent solution that allows you to live and work anywhere in the United States
                without visa restrictions. Explore{' '}
                <a href="/research/h1b-alternatives-o1-eb1-eb5" className="text-primary hover:underline">
                  H-1B alternatives including EB-5
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center">
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent>
            <h2 className="text-2xl font-serif font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-muted-foreground mb-6">
              Explore our comprehensive resources and get personalized guidance for your EB-5 journey
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/resources"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Browse Resources
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
              >
                Contact Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AboutMainContent;

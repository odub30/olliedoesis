// src/app/about/page.tsx
import { Code, Shield, Laptop, BookOpen, Award, MapPin } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/utils/canonical';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Ollie Does Is',
  description: 'Learn more about Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada. Passionate about creating secure, user-friendly digital experiences.',
  alternates: {
    canonical: getCanonicalUrl('about'),
  },
  openGraph: {
    title: 'About | Ollie Does Is',
    description: 'Learn more about Ollie Does Is - Web Developer & Cybersecurity Student based in Henderson, Nevada.',
    type: 'website',
    url: getCanonicalUrl('about'),
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary-800 to-accent-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Me</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Passionate web developer and cybersecurity student dedicated to creating secure, 
            user-friendly digital experiences while protecting the digital world.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Hi, I&apos;m Ollie!</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I&apos;m a web developer with a passion for cybersecurity, combining creativity with 
                  security-first thinking to build robust digital solutions. Currently pursuing my 
                  studies in cybersecurity while developing modern web applications.
                </p>
                <p>
                  My journey started with curiosity about how websites work, which led me down the 
                  rabbit hole of web development. Along the way, I became fascinated with the security 
                  aspects of the digital world and decided to specialize in cybersecurity as well.
                </p>
                <p>
                  When I&apos;m not coding or studying security protocols, you can find me exploring new 
                  technologies, contributing to open source projects, or learning about the latest 
                  cybersecurity threats and defenses.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-carolina" />
                  <span className="text-white">Based in Henderson, Nevada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-carolina" />
                  <span className="text-white">Web Developer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-carolina" />
                  <span className="text-white">Cybersecurity Student</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-carolina" />
                  <span className="text-white">Continuous Learner</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section - 3 Column Layout */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-6 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <h3 className="font-semibold text-lg text-carolina mb-4 flex items-center">
                <Laptop className="h-5 w-5 mr-2 text-carolina" />
                Frontend
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">React</li>
                <li className="text-gray-300 text-sm">Next.js</li>
                <li className="text-gray-300 text-sm">TypeScript</li>
                <li className="text-gray-300 text-sm">Tailwind CSS</li>
                <li className="text-gray-300 text-sm">JavaScript</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-6 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <h3 className="font-semibold text-lg text-carolina mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-carolina" />
                Backend
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">Node.js</li>
                <li className="text-gray-300 text-sm">Python</li>
                <li className="text-gray-300 text-sm">Express</li>
                <li className="text-gray-300 text-sm">REST APIs</li>
                <li className="text-gray-300 text-sm">Database Design</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-6 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <h3 className="font-semibold text-lg text-carolina mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-carolina" />
                Cybersecurity
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">Network Security</li>
                <li className="text-gray-300 text-sm">Penetration Testing</li>
                <li className="text-gray-300 text-sm">Risk Assessment</li>
                <li className="text-gray-300 text-sm">Security Auditing</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-6 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <h3 className="font-semibold text-lg text-carolina mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-carolina" />
                Tools
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">Git</li>
                <li className="text-gray-300 text-sm">VS Code</li>
                <li className="text-gray-300 text-sm">Linux</li>
                <li className="text-gray-300 text-sm">Docker</li>
                <li className="text-gray-300 text-sm">Figma</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-6 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <h3 className="font-semibold text-lg text-carolina mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-carolina" />
                Databases
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">MongoDB</li>
                <li className="text-gray-300 text-sm">PostgreSQL</li>
                <li className="text-gray-300 text-sm">MySQL</li>
                <li className="text-gray-300 text-sm">Prisma</li>
                <li className="text-gray-300 text-sm">Firebase</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-6 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
              <h3 className="font-semibold text-lg text-carolina mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-carolina" />
                DevOps & Cloud
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">Vercel</li>
                <li className="text-gray-300 text-sm">Netlify</li>
                <li className="text-gray-300 text-sm">GitHub Actions</li>
                <li className="text-gray-300 text-sm">Docker</li>
                <li className="text-gray-300 text-sm">CI/CD</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education & Goals */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-bold text-carolina mb-6">Education & Learning</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-white">Cybersecurity Studies</h3>
                <p className="text-carolina font-medium">CompTIA Security+</p>
                <p className="text-gray-300 text-sm mb-3">2024 - Present</p>
                <p className="text-gray-300 text-sm">
                  Focusing on network security, ethical hacking, risk management, and digital forensics.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-white">Self-Taught Development</h3>
                <p className="text-carolina font-medium">Continuous Learning</p>
                <p className="text-gray-300 text-sm mb-3">Ongoing</p>
                <p className="text-gray-300 text-sm">
                  Learning through courses, documentation, and hands-on projects.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-bold text-carolina mb-6">Goals & Interests</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Code className="h-6 w-6 text-carolina mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Full-Stack Development</h3>
                  <p className="text-gray-300 text-sm">
                    Building end-to-end web applications with modern technologies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-carolina mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Cybersecurity Career</h3>
                  <p className="text-gray-300 text-sm">
                    Pursuing a career in cybersecurity to help protect organizations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BookOpen className="h-6 w-6 text-carolina mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Continuous Learning</h3>
                  <p className="text-gray-300 text-sm">
                    Always exploring new technologies and industry trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
// src/app/about/page.tsx
import { Code, Shield, Laptop, BookOpen, Award, MapPin } from 'lucide-react';

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
            <div className="card shadow-strong">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent-600" />
                  <span className="text-foreground">Based in Henderson, Nevada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-accent-600" />
                  <span className="text-foreground">Web Developer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-accent-600" />
                  <span className="text-foreground">Cybersecurity Student</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-accent-600" />
                  <span className="text-foreground">Continuous Learner</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section - 3 Column Layout */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card card-hover bg-gradient-to-br from-accent-50/50 to-accent-100/30 border-accent-200/60">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Laptop className="h-5 w-5 mr-2 text-accent-600" />
                Frontend
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">React</li>
                <li className="text-muted-foreground text-sm">Next.js</li>
                <li className="text-muted-foreground text-sm">TypeScript</li>
                <li className="text-muted-foreground text-sm">Tailwind CSS</li>
                <li className="text-muted-foreground text-sm">JavaScript</li>
              </ul>
            </div>

            <div className="card card-hover bg-gradient-to-br from-primary-50/50 to-primary-100/30 border-primary-200/60">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-primary-600" />
                Backend
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">Node.js</li>
                <li className="text-muted-foreground text-sm">Python</li>
                <li className="text-muted-foreground text-sm">Express</li>
                <li className="text-muted-foreground text-sm">REST APIs</li>
                <li className="text-muted-foreground text-sm">Database Design</li>
              </ul>
            </div>

            <div className="card card-hover bg-gradient-to-br from-accent-50/50 to-accent-100/30 border-accent-200/60">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-accent-600" />
                Cybersecurity
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">Network Security</li>
                <li className="text-muted-foreground text-sm">Penetration Testing</li>
                <li className="text-muted-foreground text-sm">Risk Assessment</li>
                <li className="text-muted-foreground text-sm">Security Auditing</li>
              </ul>
            </div>

            <div className="card card-hover bg-gradient-to-br from-primary-50/50 to-primary-100/30 border-primary-200/60">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary-600" />
                Tools
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">Git</li>
                <li className="text-muted-foreground text-sm">VS Code</li>
                <li className="text-muted-foreground text-sm">Linux</li>
                <li className="text-muted-foreground text-sm">Docker</li>
                <li className="text-muted-foreground text-sm">Figma</li>
              </ul>
            </div>

            <div className="card card-hover bg-gradient-to-br from-accent-50/50 to-accent-100/30 border-accent-200/60">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-accent-600" />
                Databases
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">MongoDB</li>
                <li className="text-muted-foreground text-sm">PostgreSQL</li>
                <li className="text-muted-foreground text-sm">MySQL</li>
                <li className="text-muted-foreground text-sm">Prisma</li>
                <li className="text-muted-foreground text-sm">Firebase</li>
              </ul>
            </div>

            <div className="card card-hover bg-gradient-to-br from-primary-50/50 to-primary-100/30 border-primary-200/60">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary-600" />
                DevOps & Cloud
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">Vercel</li>
                <li className="text-muted-foreground text-sm">Netlify</li>
                <li className="text-muted-foreground text-sm">GitHub Actions</li>
                <li className="text-muted-foreground text-sm">Docker</li>
                <li className="text-muted-foreground text-sm">CI/CD</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education & Goals */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="card shadow-strong">
            <h2 className="text-2xl font-bold text-foreground mb-6">Education & Learning</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Cybersecurity Studies</h3>
                <p className="text-accent-600 font-medium">CompTIA Security+</p>
                <p className="text-muted-foreground text-sm mb-3">2024 - Present</p>
                <p className="text-muted-foreground text-sm">
                  Focusing on network security, ethical hacking, risk management, and digital forensics.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-foreground">Self-Taught Development</h3>
                <p className="text-accent-600 font-medium">Continuous Learning</p>
                <p className="text-muted-foreground text-sm mb-3">Ongoing</p>
                <p className="text-muted-foreground text-sm">
                  Learning through courses, documentation, and hands-on projects.
                </p>
              </div>
            </div>
          </div>

          <div className="card shadow-strong">
            <h2 className="text-2xl font-bold text-foreground mb-6">Goals & Interests</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Code className="h-6 w-6 text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Full-Stack Development</h3>
                  <p className="text-muted-foreground text-sm">
                    Building end-to-end web applications with modern technologies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Cybersecurity Career</h3>
                  <p className="text-muted-foreground text-sm">
                    Pursuing a career in cybersecurity to help protect organizations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BookOpen className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Continuous Learning</h3>
                  <p className="text-muted-foreground text-sm">
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
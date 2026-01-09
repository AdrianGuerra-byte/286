import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { Acuerdo286Section } from "@/components/acuerdo-286-section";
import { ExamCatalog } from "@/components/exam-catalog";
import { CalendarSection } from "@/components/calendar-section";
import { RegistrationProcessSection } from "@/components/registration-process-section";
import { RequirementsSection } from "@/components/requirements-section";
import { FAQSection } from "@/components/faq-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <Acuerdo286Section />
        <RequirementsSection />
        <ExamCatalog />
        <CalendarSection />
        <RegistrationProcessSection />
        {/* <TestimonialsSection /> */}
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

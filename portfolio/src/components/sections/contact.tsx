"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  reducedMotionStaggerContainer,
  reducedMotionStaggerItem,
} from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialLinks } from "@/components/shared/social-links";
import { aboutData } from "@/data/about";
import { validateContactForm } from "@/lib/validations";
import { submitContactForm } from "@/app/actions/contact";
import { trackContactFormSubmit } from "@/lib/analytics";
import type { ContactFormState, FormErrors } from "@/types";

/**
 * Contact section component
 * Form with name, email, message fields
 * Hidden honeypot field for bot detection
 * Social links component
 * Loading state on submit button
 * Requirements: 7.1, 7.6, 18.4
 */

export interface ContactProps {
  className?: string;
}

function Contact({ className }: ContactProps) {
  const { socialLinks, resumeUrl } = aboutData;
  const [isPending, startTransition] = useTransition();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Use reduced motion variants when user prefers reduced motion
  const containerVariants = prefersReducedMotion
    ? reducedMotionStaggerContainer
    : staggerContainer;
  const itemVariants = prefersReducedMotion
    ? reducedMotionStaggerItem
    : staggerItem;

  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    errors: {},
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "", // Hidden field for bot detection
  });


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (formState.errors[name as keyof FormErrors]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: undefined },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    const clientErrors = validateContactForm(formData);
    if (Object.keys(clientErrors).length > 0) {
      setFormState({ status: "error", errors: clientErrors });
      return;
    }

    setFormState({ status: "submitting", errors: {} });

    startTransition(async () => {
      const result = await submitContactForm(formData);

      if (result.success) {
        setFormState({ status: "success", errors: {} });
        setFormData({ name: "", email: "", message: "", honeypot: "" });
        trackContactFormSubmit(true);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormState({ status: "idle", errors: {} });
        }, 5000);
      } else {
        setFormState({
          status: "error",
          errors: result.errors || { general: "Something went wrong. Please try again." },
        });
        trackContactFormSubmit(false);
      }
    });
  };

  return (
    <section
      id="contact"
      className={cn("px-4 py-20", className)}
      aria-label="Contact section"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or want to collaborate? I'd love to hear from you."
        />

        <motion.div
          className="grid gap-12 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot field - hidden from users, catches bots */}
              <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Input
                label="Name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
                error={formState.errors.name}
                required
                disabled={isPending}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={formState.errors.email}
                required
                disabled={isPending}
              />

              <Textarea
                label="Message"
                name="message"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={handleInputChange}
                error={formState.errors.message}
                required
                disabled={isPending}
              />

              {/* General error message */}
              {formState.errors.general && (
                <p className="text-sm text-destructive" role="alert">
                  {formState.errors.general}
                </p>
              )}

              {/* Success message */}
              {formState.status === "success" && (
                <p className="text-sm text-green-600 dark:text-green-400" role="status">
                  Thank you for your message! I'll get back to you soon.
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full"
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Social Links and Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Connect with me
              </h3>
              <p className="mb-6 text-muted-foreground">
                Feel free to reach out through any of these platforms. I'm always
                open to discussing new projects, creative ideas, or opportunities.
              </p>
              <SocialLinks
                links={socialLinks}
                resumeUrl={resumeUrl}
                iconSize="lg"
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Response Time
              </h3>
              <p className="text-muted-foreground">
                I typically respond within 24-48 hours. For urgent inquiries,
                please reach out via email directly.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export { Contact };

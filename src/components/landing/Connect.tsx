/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContactInquiriesMutation } from "@/src/redux/api/contactApi";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ConnectProps } from "../../types/landingPage";
import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { Input } from "@/src/elements/ui/input";

const Connect: React.FC<ConnectProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [inquiries] = useContactInquiriesMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await inquiries(formData).unwrap();
      toast.success(response.message || "Your inquiry has been submitted successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-[calc(10px+(64-10)*((100vw-320px)/(1920-320)))]">
          <span className="inline-block text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            CONNECT WITH US
          </span>

          <h2 className="text-[calc(20px+(36-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 mb-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] leading-tight">
            {data.title}
          </h2>

          {data.description && (
            <p className="text-lg text-slate-600 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))]">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 h-full flex flex-col justify-center space-y-8">
            {/* <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Get in touch</h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                {data.subtitle || "Have a question or need help? We're here for you."}
              </p>
            </div> */}

            <div className="space-y-6">
              {data.phone_no && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Phone size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-md font-medium text-slate-900">{data.phone_no}</p>
                  </div>
                </div>
              )}

              {data.email && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Mail size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</p>
                    <p className="text-md font-medium text-slate-900">{data.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {data.form_enabled ? (
              <div className="bg-white rounded-lg p-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] shadow-sm border border-slate-200">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Full Name"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Email Address"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    placeholder="Subject"
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your needs..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full h-12! rounded-lg! bg-primary px-6 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? "Submitting..." : "Send Message"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Online contact form is currently disabled.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connect;

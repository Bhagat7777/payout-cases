"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, X, Star, Calendar, Building2, FileText, ImageIcon, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { submitCase } from "@/lib/actions/cases";
import { toast } from "sonner";

export default function SubmitApprovalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firmId: "",
    payoutDate: "",
    rating: 0,
    title: "",
    notes: "",
    amount: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
      );
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
      );
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    
    // Append files to FormData
    files.forEach((file) => {
      data.append("files", file);
    });
    
    // Append other required fields
    data.append("type", "approval");
    data.append("rating", formData.rating.toString());
    data.append("payoutDate", formData.payoutDate);
    data.append("firmId", formData.firmId);
    data.append("title", formData.title);
    data.append("notes", formData.notes);
    data.append("amount", formData.amount); // Although 'amount' isn't in the DB schema, we pass it for consistency if needed later.

    try {
      // Call the server action
      await submitCase(data);
      toast.success("Approval case submitted successfully!", {
        description: "Your case is now under review.",
      });
      // Server action handles redirection and revalidation
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission failed", {
        description: (error as Error).message || "Please check your inputs and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/approvals"
            className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Approvals
          </Link>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#22C55E] to-[#00D1B2] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#E6E7EB" }}>
                Submit Payout Approval
              </h1>
              <p className="text-gray-400">Share your successful payout experience</p>
            </div>
          </div>

          <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full mr-2" />
            Approval Case
          </Badge>
        </div>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle style={{ color: "#E6E7EB" }}>Case Details</CardTitle>
            <CardDescription className="text-gray-400">
              Provide details about your payout approval. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firmId" className="text-[#E6E7EB]">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Prop Firm *
                  </Label>
                  <Input
                    id="firmId"
                    name="firmId"
                    value={formData.firmId}
                    onChange={(e) => setFormData({ ...formData, firmId: e.target.value })}
                    placeholder="Enter prop firm name"
                    className="bg-white/5 border-white/10 text-[#E6E7EB] placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payoutDate" className="text-[#E6E7EB]">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Payout Date *
                  </Label>
                  <Input
                    id="payoutDate"
                    name="payoutDate"
                    type="date"
                    value={formData.payoutDate}
                    onChange={(e) => setFormData({ ...formData, payoutDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-[#E6E7EB]"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#E6E7EB]">
                    <Star className="w-4 h-4 inline mr-2" />
                    Rating *
                  </Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-[#E6E7EB]">
                    Payout Amount *
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., $2,500"
                    className="bg-white/5 border-white/10 text-[#E6E7EB] placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#E6E7EB]">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Title (Optional)
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief summary of your experience"
                  maxLength={100}
                  className="bg-white/5 border-white/10 text-[#E6E7EB] placeholder:text-gray-500"
                />
                <p className="text-gray-500 text-sm">{formData.title.length}/100 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#E6E7EB]">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share details about your payout experience, timeline, support quality, etc."
                  maxLength={800}
                  rows={4}
                  className="bg-white/5 border-white/10 text-[#E6E7EB] placeholder:text-gray-500 resize-none"
                />
                <p className="text-gray-500 text-sm">{formData.notes.length}/800 characters</p>
              </div>

              <div className="space-y-2">
                <Label className="text-[#E6E7EB]">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  Evidence Screenshots *
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive ? "border-[#00D1B2] bg-[#00D1B2]/5" : "border-white/20 hover:border-white/40"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-[#E6E7EB] mb-2">
                    Drag and drop your screenshots here, or{" "}
                    <label className="text-[#00D1B2] cursor-pointer hover:underline">
                      browse files
                      <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
                    </label>
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG, WebP up to 5MB each. Maximum 5 files.</p>
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#22C55E] to-[#00D1B2] hover:opacity-90 text-white flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Approval Case
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-white/20 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
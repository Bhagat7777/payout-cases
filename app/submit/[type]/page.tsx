"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { useSocket } from "@/components/providers/socket-provider";

interface FormData {
  traderName: string;
  propFirm: string;
  amount: string;
  date: string;
  screenshot: File | null;
  comments: string;
}

export default function SubmitCasePage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const { socket } = useSocket();
  const isApproval = params.type === "approval";
  const [formData, setFormData] = useState<FormData>({
    traderName: "",
    propFirm: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    screenshot: null,
    comments: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Mock prop firms - replace with actual data from API
  const propFirms = [
    "FTMO",
    "MyForexFunds",
    "FundedNext",
    "The5ers",
    "Blueberry Markets",
    "Earn2Trade"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, propFirm: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, screenshot: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send to your API
      // const response = await fetch("/api/submit", {
      //   method: "POST",
      //   body: JSON.stringify({ ...formData, type: params.type }),
      //   headers: { "Content-Type": "application/json" }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Emit socket event for real-time update
      if (socket) {
        const newCase = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          amount: Number(formData.amount),
          type: params.type,
          status: isApproval ? "completed" : "pending"
        };
        
        if (isApproval) {
          socket.emit("newApproval", newCase);
        } else {
          socket.emit("newDenial", newCase);
        }
      }
      
      toast.success(
        isApproval 
          ? "Approval submitted successfully!" 
          : "Denial submitted successfully!",
        {
          description: "Thank you for contributing to the community.",
        }
      );
      
      // Reset form
      setFormData({
        traderName: "",
        propFirm: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        screenshot: null,
        comments: ""
      });
      setPreviewUrl(null);
      
      // Redirect to appropriate page
      setTimeout(() => {
        router.push(isApproval ? "/payout-approvals" : "/payout-denials");
      }, 1500);
    } catch (error) {
      toast.error("Submission failed", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            {isApproval ? (
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            ) : (
              <div className="bg-red-500/10 p-3 rounded-full">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {isApproval ? "Submit Payout Approval" : "Submit Payout Denial"}
          </h1>
          <p className="text-slate-400">
            Share your {isApproval ? "successful payout" : "denial experience"} with the community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {isApproval ? "Approval Details" : "Denial Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="traderName" className="text-slate-300">Trader Name</Label>
                    <Input
                      id="traderName"
                      name="traderName"
                      value={formData.traderName}
                      onChange={handleInputChange}
                      placeholder="Enter your name or handle"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="propFirm" className="text-slate-300">Prop Firm</Label>
                    <Select value={formData.propFirm} onValueChange={handleSelectChange}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select a prop firm" />
                      </SelectTrigger>
                      <SelectContent>
                        {propFirms.map((firm) => (
                          <SelectItem key={firm} value={firm}>
                            {firm}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-300">Amount ($)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter payout amount"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-300">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Screenshot</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                      {previewUrl ? (
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-slate-400" />
                          <p className="mb-2 text-sm text-slate-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comments" className="text-slate-300">
                    {isApproval ? "Comments (Optional)" : "Reason for Denial"}
                  </Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder={
                      isApproval 
                        ? "Share details about your experience..." 
                        : "Explain why your payout was denied..."
                    }
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                    required={!isApproval}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={
                      isApproval
                        ? "bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90"
                        : "bg-gradient-to-r from-red-600 to-purple-600 hover:opacity-90"
                    }
                  >
                    {isSubmitting ? "Submitting..." : 
                     isApproval ? "Submit Approval" : "Submit Denial"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
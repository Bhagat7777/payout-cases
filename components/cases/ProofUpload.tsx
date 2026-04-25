"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ProofUploadProps {
  onProofsChange: (urls: string[]) => void;
  maxProofs?: number;
}

interface ProofFile {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
  isUploading: boolean;
  error?: string;
}

export function ProofUpload({ onProofsChange, maxProofs = 5 }: ProofUploadProps) {
  const [proofs, setProofs] = useState<ProofFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") && proofs.length < maxProofs
    );

    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = async (files: File[]) => {
    const newProofs: ProofFile[] = [];

    for (const file of files) {
      if (proofs.length + newProofs.length >= maxProofs) break;

      if (!file.type.startsWith("image/")) {
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const proof: ProofFile = {
          id: Math.random().toString(36),
          file,
          preview: e.target?.result as string,
          uploadProgress: 0,
          isUploading: true,
        };

        setProofs((prev) => [...prev, proof]);

        // Simulate upload
        setTimeout(() => {
          setProofs((prev) =>
            prev.map((p) =>
              p.id === proof.id ? { ...p, isUploading: false, uploadProgress: 100 } : p
            )
          );

          // Update parent with proof URLs
          setProofs((prev) => {
            const uploadedProofs = prev.filter((p) => !p.isUploading);
            onProofsChange(uploadedProofs.map((p) => p.preview));
            return prev;
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProof = (id: string) => {
    setProofs((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      onProofsChange(updated.map((p) => p.preview));
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? "#3b82f6" : "#64748b",
          backgroundColor: isDragging ? "rgba(59, 130, 246, 0.05)" : "rgba(0, 0, 0, 0)",
        }}
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center transition-all duration-300"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-3">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-white font-semibold mb-1">
            {isDragging ? "Drop files here" : "Drag screenshots here"}
          </p>
          <p className="text-slate-400 text-sm mb-4">or click to browse</p>
          <Button
            type="button"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => fileInputRef.current?.click()}
            disabled={proofs.length >= maxProofs}
          >
            Select Files
          </Button>
          <p className="text-xs text-slate-500 mt-4">
            {proofs.length} / {maxProofs} proof(s) uploaded
          </p>
        </motion.div>
      </motion.div>

      {/* Proof previews */}
      <AnimatePresence>
        {proofs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {proofs.map((proof) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <Card className="border-slate-700 bg-slate-800/50 overflow-hidden p-0">
                  <div className="relative w-full aspect-square bg-slate-700">
                    <Image
                      src={proof.preview}
                      alt="Proof preview"
                      fill
                      className="object-cover"
                    />

                    {/* Upload overlay */}
                    {proof.isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                          <p className="text-xs text-white font-semibold">
                            {proof.uploadProgress}%
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Success check */}
                    {!proof.isUploading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}

                    {/* Remove button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeProof(proof.id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="bg-red-500 text-white rounded-full p-1 shadow-lg">
                        <X className="w-3 h-3" />
                      </div>
                    </motion.button>
                  </div>

                  {proof.error && (
                    <div className="p-2 bg-red-500/10 border-t border-red-500/20">
                      <p className="text-xs text-red-400">{proof.error}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requirements */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300">
          <strong>Requirements:</strong> Screenshots must clearly show payout confirmation, amount, and date. PayoutCases watermark will be added automatically. All proofs undergo admin verification before publication.
        </p>
      </div>
    </div>
  );
}

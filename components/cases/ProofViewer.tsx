"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProofViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ProofViewer({ isOpen, onClose, imageUrl }: ProofViewerProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-black/95 border-white/10 p-0 overflow-hidden">
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Payout Proof" 
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Watermark */}
          <div className="absolute bottom-8 right-8 pointer-events-none opacity-30 select-none">
            <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
              <span>Verified by PayoutCases</span>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="outline" size="icon" className="bg-white/10 border-white/20" onClick={() => window.open(imageUrl, '_blank')}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/10 border-white/20" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { upsertFirm } from "@/lib/actions/admin"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function FirmFormDialog({ children, firm }: { children: React.ReactNode, firm?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await upsertFirm(formData)
      toast.success(firm ? "Firm updated" : "Firm created")
      setIsOpen(false)
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-[#0B0F17] border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{firm ? "Edit Prop Firm" : "Add New Prop Firm"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {firm && <input type="hidden" name="id" value={firm.id} />}
          
          <div className="space-y-2">
            <Label htmlFor="name">Firm Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={firm?.name} 
              placeholder="e.g. FTMO" 
              className="bg-white/5 border-white/10"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input 
              id="website_url" 
              name="website_url" 
              defaultValue={firm?.website_url} 
              placeholder="https://..." 
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={firm?.description} 
              placeholder="Brief overview of the firm..." 
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-[#7C5CFF] hover:bg-[#6a4ee0] text-white"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {firm ? "Save Changes" : "Create Firm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
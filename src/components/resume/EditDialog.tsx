
import * as React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

type EditDialogProps = {
  title: string;
  content: any;
  onSave: (updatedContent: any) => void;
};

const EditDialog = ({ title, content, onSave }: EditDialogProps) => {
  const [editedContent, setEditedContent] = React.useState(content);
  
  const handleSave = () => {
    onSave(editedContent);
    toast({
      title: "Changes saved",
      description: `Your ${title.toLowerCase()} has been updated.`,
    });
  };

  // Determine the type of editor based on content structure
  const renderEditor = () => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Input
          value={editedContent as string}
          onChange={(e) => setEditedContent(e.target.value)}
          className="h-10"
        />
      );
    } else if (Array.isArray(content) && typeof content[0] === 'string') {
      // For arrays of strings like skills
      return (
        <Textarea
          value={(editedContent as string[]).join(', ')}
          onChange={(e) => setEditedContent(e.target.value.split(', '))}
          className="min-h-[120px]"
          placeholder="Separate items with commas"
        />
      );
    } else {
      // For objects or complex arrays, use JSON representation
      return (
        <Textarea
          value={JSON.stringify(editedContent, null, 2)}
          onChange={(e) => {
            try {
              setEditedContent(JSON.parse(e.target.value));
            } catch (error) {
              // Allow incomplete JSON while typing
            }
          }}
          className="min-h-[200px] font-mono text-sm"
        />
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit {title}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription>
            Make changes to your {title.toLowerCase()} information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderEditor()}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;

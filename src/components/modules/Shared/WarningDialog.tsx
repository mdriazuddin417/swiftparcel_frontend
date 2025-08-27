import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WarningDialogProps {
  handleCancel?: () => void;
  handleContinue?: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const WarningDialog = ({handleCancel, handleContinue, title, description,children}: WarningDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
       {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
           {title || ''}
          </AlertDialogTitle>
          <AlertDialogDescription>
           {description || 'Are you sure you want to proceed?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel  onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleContinue}
          >
           Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WarningDialog;

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
import {Button, buttonVariants} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {ReactNode, useState} from "react";

type DeleteModalProps = {
    title?: string;
    description?: string;
    onConfirm: () => void;
    triggerLabel?: string | ReactNode;
    icon?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    className?: string;
    triggerClassName?: string;
};

export function DeleteModal({
                                title = "Delete Account?",
                                description = "Deleting your account is irreversible and will erase all your data. This action cannot be undone.",
                                onConfirm,
                                triggerLabel = "Delete",
                                icon = <Trash2 className="w-5 h-5 text-red-600 dark:text-red-200"/>,
                                confirmLabel = "Continue",
                                cancelLabel = "Cancel",
                                className,
                                triggerClassName,
                            }: DeleteModalProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <AlertDialogTrigger asChild>
                    <Button type="button" size={'icon'}
                            className={cn('bg-transparent hover:bg-transparent shadow-none text-red-600', triggerClassName)}>
                        {<Trash2 className="w-4 h-4"/>}
                    </Button>
                </AlertDialogTrigger>

            </AlertDialogTrigger>
            <AlertDialogContent className={cn("max-w-md", className)}>
                <AlertDialogHeader className="mb-4 flex items-center gap-4">
                    <div aria-hidden="true" className="shrink-0 rounded-full bg-red-50 p-3 dark:bg-red-900">
                        {icon}
                    </div>
                    <div className="flex flex-col gap-2">
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-end gap-2">
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={cn(buttonVariants({variant: "destructive"}))}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

import {
    Dialog,
    DialogTitle,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

interface AddItemDialogProps {
    triggerClassName?: string;
    triggerIcon?: React.ReactNode;
    trigger?: React.ReactNode;
    placeholder: string;
    onSave: (value: string) => void;
    dialogTitle?: string;
    dialogDescription?: string;
}

function AddItemDialog({
    triggerClassName,
    triggerIcon = <Plus className="size-8" />,
    trigger,
    placeholder,
    onSave,
    dialogTitle = "",
    dialogDescription = "",
}: AddItemDialogProps) {
    const [inputValue, setInputValue] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAdd = () => {
        if (inputValue.trim()) {
            onSave(inputValue.trim());
            setInputValue("");
            setIsDialogOpen(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className={triggerClassName} asChild>
                {trigger || (
                    <Button variant="ghost" className={triggerClassName}>
                        {triggerIcon}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
                    {dialogDescription && (
                        <DialogDescription>
                            {dialogDescription}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="input py-2 px-4 rounded-md"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <Button variant="secondary" onClick={handleAdd}>
                    Add
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default AddItemDialog;

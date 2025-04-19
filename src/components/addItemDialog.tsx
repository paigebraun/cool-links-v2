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
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useLinkCollectionStore from "@/stores/useLinkCollectionStore";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import capitalizeFirstLetter from "@/utils/string-utils";

interface AddItemDialogProps {
    triggerClassName?: string;
    triggerIcon?: React.ReactNode;
    trigger?: React.ReactNode;
    placeholder: string;
    onSave: (value: string, collectionId?: string) => void;
    dialogTitle?: string;
    dialogDescription?: string;
    isAddingLink?: boolean;
    activeCollectionId?: string;
}

function AddItemDialog({
    triggerClassName,
    triggerIcon = <Plus className="size-8" />,
    trigger,
    placeholder,
    onSave,
    dialogTitle = "",
    dialogDescription = "",
    isAddingLink = false,
    activeCollectionId = "",
}: AddItemDialogProps) {
    const collections = useLinkCollectionStore((state) => state.collections);
    const [inputValue, setInputValue] = useState("");
    const [selectedCollection, setSelectedCollection] = useState(() => {
        if (activeCollectionId && activeCollectionId !== "recent") {
            return activeCollectionId;
        }
        const firstNonRecentCollection = collections.find(
            (c) => c.id !== "recent"
        );
        return firstNonRecentCollection?.id || collections[0]?.id;
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (activeCollectionId && activeCollectionId !== "recent") {
            setSelectedCollection(activeCollectionId);
        }
    }, [activeCollectionId]);

    const handleAdd = () => {
        if (inputValue.trim()) {
            onSave(inputValue.trim(), selectedCollection);
            setInputValue("");
            setIsDialogOpen(false);
        }
    };

    const handleCollectionChange = (value: string) => {
        const collection = collections.find((c) => c.name === value);
        if (collection) {
            setSelectedCollection(collection.id);
        }
    };

    const activeCollectionName =
        collections.find((collection) => collection.id === selectedCollection)
            ?.name || collections[0]?.name;

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
                {isAddingLink && collections.length > 1 && (
                    <Select
                        value={activeCollectionName}
                        onValueChange={handleCollectionChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Collection</SelectLabel>
                                {collections
                                    .filter(
                                        (collection) =>
                                            collection.id !== "recent"
                                    )
                                    .map((collection) => (
                                        <SelectItem
                                            value={collection.name}
                                            key={collection.id}>
                                            {capitalizeFirstLetter(
                                                collection.name
                                            )}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
                <Button onClick={handleAdd}>Add</Button>
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

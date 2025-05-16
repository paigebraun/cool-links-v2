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
    onCreateCollection?: (name: string) => Promise<void> | void;
    onAddLink?: (url: string, collectionId: string) => Promise<void> | void;
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
    onCreateCollection,
    onAddLink,
    dialogTitle = "",
    dialogDescription = "",
    isAddingLink = false,
    activeCollectionId = "",
}: AddItemDialogProps) {
    const collections = useLinkCollectionStore((state) => state.collections);
    const links = useLinkCollectionStore((state) => state.links);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState<string>("");
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
    const [showCreateCollection, setShowCreateCollection] = useState(false);
    const [realCollections, setRealCollections] = useState(
        collections.filter((c) => c.id !== "recent")
    );

    useEffect(() => {
        setRealCollections(collections.filter((c) => c.id !== "recent"));
    }, [collections]);

    // When dialog opens, check if we need to show collection creation first
    useEffect(() => {
        if (isDialogOpen && isAddingLink && realCollections.length === 0) {
            setShowCreateCollection(true);
            setInputValue("");
            setError("");
        } else if (isDialogOpen && !isAddingLink) {
            setShowCreateCollection(false);
        }
    }, [isDialogOpen, isAddingLink, realCollections.length]);

    // After creating a collection, set it as selected
    useEffect(() => {
        if (
            !showCreateCollection &&
            isAddingLink &&
            realCollections.length === 1
        ) {
            setSelectedCollection(realCollections[0].id);
        }
    }, [showCreateCollection, isAddingLink, realCollections.length]);

    useEffect(() => {
        if (activeCollectionId && activeCollectionId !== "recent") {
            setSelectedCollection(activeCollectionId);
        }
    }, [activeCollectionId]);

    const checkForDuplicateUrl = (url: string): boolean => {
        try {
            const inputUrl = new URL(url);

            return links.some((storedLink) => {
                try {
                    const storedUrl = new URL(storedLink.url);
                    return (
                        storedUrl.hostname === inputUrl.hostname &&
                        storedUrl.pathname === inputUrl.pathname
                    );
                } catch {
                    return false;
                }
            });
        } catch {
            //try adding https:// and check again
            try {
                const withHttps = new URL(`https://${url}`);
                return links.some((storedLink) => {
                    try {
                        const storedUrl = new URL(storedLink.url);
                        return (
                            storedUrl.hostname === withHttps.hostname &&
                            storedUrl.pathname === withHttps.pathname
                        );
                    } catch {
                        return false;
                    }
                });
            } catch {
                return false;
            }
        }
    };

    const checkForDuplicateCollection = (name: string): boolean => {
        const normalizedName = name.toLowerCase().trim();
        return collections.some(
            (collection) => collection.name.toLowerCase() === normalizedName
        );
    };

    const handleAdd = async () => {
        const trimmedValue = inputValue.trim();

        if (showCreateCollection) {
            if (!trimmedValue) {
                setError("Please enter a collection name");
                return;
            }
            if (checkForDuplicateCollection(trimmedValue)) {
                setError("A collection with this name already exists");
                return;
            }
            await onCreateCollection(trimmedValue);
            setInputValue("");
            setError("");
            setShowCreateCollection(false);
            return;
        }

        if (isAddingLink) {
            if (!trimmedValue) {
                setError("Please enter a link");
                return;
            }
            try {
                if (checkForDuplicateUrl(trimmedValue)) {
                    setError("This link has already been added");
                    return;
                }
                await onAddLink(trimmedValue, selectedCollection!);
                setInputValue("");
                setError("");
                setIsDialogOpen(false);
            } catch (error) {
                setError("Please enter a valid website URL");
                return;
            }
        } else {
            if (!trimmedValue) {
                setError("Please enter a collection name");
                return;
            }
            if (checkForDuplicateCollection(trimmedValue)) {
                setError("A collection with this name already exists");
                return;
            }
            await onCreateCollection(trimmedValue);
            setInputValue("");
            setError("");
            setIsDialogOpen(false);
        }
    };

    // Dynamically set dialog content based on state
    const currentDialogTitle = showCreateCollection
        ? "Add New collection"
        : dialogTitle;

    const currentDialogDescription = showCreateCollection
        ? "Please create a collection before adding links."
        : dialogDescription;

    const currentPlaceholder = showCreateCollection
        ? "Enter collection name"
        : placeholder;

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
                    <Button variant="outline" className={triggerClassName}>
                        {triggerIcon}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {currentDialogTitle && (
                        <DialogTitle>{currentDialogTitle}</DialogTitle>
                    )}
                    {currentDialogDescription && (
                        <DialogDescription>
                            {currentDialogDescription}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder={currentPlaceholder}
                        className={`w-full px-4 py-2 border rounded-md outline-none transition-colors
                            ${
                                error
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-input focus:border-ring focus:ring-ring"
                            }`}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setError("");
                        }}
                    />
                    {error && (
                        <span className="text-sm text-red-500">{error}</span>
                    )}
                </div>
                {isAddingLink &&
                    !showCreateCollection &&
                    realCollections.length > 0 && (
                        <Select
                            value={activeCollectionName}
                            onValueChange={handleCollectionChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Collection</SelectLabel>
                                    {realCollections.map((collection) => (
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

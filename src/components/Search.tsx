import React, { useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import useLinkCollectionStore from "../stores/useLinkCollectionStore";

interface SearchProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

function Search({ open, setOpen }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const links = useLinkCollectionStore((state) => state.links);
    const collections = useLinkCollectionStore((state) => state.collections);

    const filteredLinks = links.filter((link) =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCollectionName = (collectionId: string) => {
        const collection = collections.find((c) => c.id === collectionId);
        return collection?.name || "Unknown";
    };

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setOpen]);

    const handleSelect = (url: string) => {
        window.open(url, "_blank");
        setOpen(false);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Search links..."
                value={searchQuery}
                onValueChange={setSearchQuery}
            />
            <CommandList>
                <CommandEmpty>No links found.</CommandEmpty>
                {filteredLinks.length > 0 && (
                    <CommandGroup heading="Links">
                        {filteredLinks.map((link) => (
                            <CommandItem
                                key={link.id}
                                onSelect={() => handleSelect(link.url)}>
                                <div className="flex items-center gap-2">
                                    {link.image && (
                                        <img
                                            src={link.image}
                                            alt=""
                                            className="w-4 h-4 rounded"
                                        />
                                    )}
                                    <span>{link.title}</span>
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        {getCollectionName(link.collectionId)}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}

export default Search;

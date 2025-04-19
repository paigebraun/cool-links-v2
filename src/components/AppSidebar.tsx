import * as React from "react";

import Logo from "@/assets/logo.svg";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import AddItemDialog from "./AddItemDialog";
import useLinkCollectionStore from "@/stores/useLinkCollectionStore";
import capitalizeFirstLetter from "@/utils/string-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis, Trash2 } from "lucide-react";

export function AppSidebar({
    setActiveCollection,
    activeCollectionId,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    setActiveCollection: (id: string) => void;
    activeCollectionId: string;
}) {
    const collections = useLinkCollectionStore((state) => state.collections);

    const handleAddCollection = (collectionName: string) => {
        const createCollection =
            useLinkCollectionStore.getState().createCollection;
        createCollection(collectionName);
    };

    const handleDeleteCollection = (
        e: React.MouseEvent,
        collectionId: string
    ) => {
        e.stopPropagation();
        const deleteCollection =
            useLinkCollectionStore.getState().deleteCollection;
        deleteCollection(collectionId);
        setActiveCollection("recent");
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <img src={Logo} alt="Logo" className="h-16 w-16 pl-2" />
            </SidebarHeader>
            <SidebarContent className="flex justify-between flex-col">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Collections</SidebarGroupLabel>
                        <SidebarMenu>
                            {collections.map((collection) => (
                                <SidebarMenuItem key={collection.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            collection.id === activeCollectionId
                                        }
                                        onClick={() =>
                                            setActiveCollection(collection.id)
                                        }>
                                        <button className="w-full text-left peer">
                                            {capitalizeFirstLetter(
                                                collection.name
                                            )}
                                        </button>
                                    </SidebarMenuButton>
                                    {collection.id !== "recent" && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                className="absolute right-2 top-1 opacity-0 hover:opacity-100 peer-hover:opacity-100 [&[data-state=open]]:opacity-100 transition-opacity duration-200 ease-in-out"
                                                aria-label="Collection options">
                                                <Ellipsis />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem className="p-0">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-between hover:text-destructive font-normal text-sm !px-2"
                                                        onClick={(e) =>
                                                            handleDeleteCollection(
                                                                e,
                                                                collection.id
                                                            )
                                                        }>
                                                        Delete{" "}
                                                        <Trash2 className="hover:text-destructive" />
                                                    </Button>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <AddItemDialog
                    placeholder="Enter collection name..."
                    onSave={handleAddCollection}
                    dialogTitle="Add New Collection"
                    trigger={
                        <Button variant="secondary" className="m-4">
                            New Collection
                        </Button>
                    }
                    dialogDescription="Enter the name of the collection you want to add."
                />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}

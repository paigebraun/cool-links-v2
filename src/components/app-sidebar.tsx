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
import AddItemDialog from "./addItemDialog";
import useLinkCollectionStore from "@/stores/useLinkCollectionStore";
import capitalizeFirstLetter from "@/utils/string-utils";

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
        console.log("New collection added:", collectionName);
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
                                        <button className="w-full text-left">
                                            {capitalizeFirstLetter(
                                                collection.name
                                            )}
                                        </button>
                                    </SidebarMenuButton>
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

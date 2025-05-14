import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import AppLinks from "@/components/AppLinks";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";
import Search from "@/components/Search";
import { Button } from "./components/ui/button";
import useLinkCollectionStore from "@/stores/useLinkCollectionStore";
import AddItemDialog from "./components/AddItemDialog";
import capitalizeFirstLetter from "./utils/string-utils";

function App() {
    const [activeCollectionId, setActiveCollectionId] = useState("recent");
    const [searchOpen, setSearchOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");

    const collections = useLinkCollectionStore((state) => state.collections);

    // Find the active collection's name
    const activeCollectionName =
        collections.find((collection) => collection.id === activeCollectionId)
            ?.name || "Unknown";

    const addLink = useLinkCollectionStore((state) => state.addLink);

    // Add protocol to link if needed
    function getClickableLink(link) {
        return link.startsWith("http://") || link.startsWith("https://")
            ? link
            : `http://${link}`;
    }

    // Use Link Preview API to get link info
    async function handleAddLink(linkValue: string, collectionId: string) {
        let clickLink = getClickableLink(linkValue);
        const data = {
            key: "920fb1aae8a530a3bbe743459af730a7",
            q: clickLink,
        };

        try {
            const res = await fetch("https://api.linkpreview.net", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch link preview");
            }

            const response = await res.json();

            if (!response.title || !response.url) {
                throw new Error("Invalid URL: Could not fetch link details");
            }

            // Use screenshot if there is no image returned by linkPreview API
            let linkImage;
            if (!response.image) {
                linkImage = `https://api.screenshotmachine.com/?key=1b820e&url=${clickLink}&dimension=1024x768&delay=200`;
            } else {
                linkImage = response.image;
            }

            // Add the link to the Zustand store
            addLink(
                response.title,
                clickLink,
                linkImage,
                collectionId || activeCollectionId
            );

            return true;
        } catch (error) {
            console.error("Error fetching link preview:", error);
            throw error;
        }
    }

    return (
        <SidebarProvider>
            <Search open={searchOpen} setOpen={setSearchOpen} />
            <AppSidebar
                activeCollectionId={activeCollectionId}
                setActiveCollection={setActiveCollectionId}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4">
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                        </div>
                        <Badge variant="outline">
                            {capitalizeFirstLetter(activeCollectionName)}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            data-sidebar="trigger"
                            data-slot="sidebar-trigger"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setSearchOpen(true)}>
                            <SearchIcon />
                            <span className="sr-only">Toggle Search</span>
                        </Button>
                        <div className="h-4">
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                        </div>
                        <Tabs defaultValue="grid" onValueChange={setViewMode}>
                            <TabsList>
                                <TabsTrigger value="grid">Grid</TabsTrigger>
                                <TabsTrigger value="list">List</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </header>
                <AppLinks
                    viewMode={viewMode}
                    activeCollectionId={activeCollectionId}
                />
            </SidebarInset>
            <AddItemDialog
                triggerClassName="fixed bottom-4 right-4"
                placeholder="Enter link URL..."
                onSave={handleAddLink}
                dialogTitle="Add New Link"
                dialogDescription="Enter the URL of the link you want to add."
                isAddingLink={true}
                activeCollectionId={activeCollectionId}
            />
        </SidebarProvider>
    );
}

export default App;

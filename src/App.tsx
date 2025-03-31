import { AppSidebar } from "@/components/app-sidebar";
import AppLinks from "@/components/app-links";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Button } from "./components/ui/button";
import AddLinkDialog from "./components/addLinkDialog";

function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
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
                        <Badge variant="outline">Recent</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            data-sidebar="trigger"
                            data-slot="sidebar-trigger"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7">
                            <Search />
                            <span className="sr-only">Toggle Sidebar</span>
                        </Button>
                        <div className="h-4">
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                        </div>
                        <Tabs defaultValue="grid">
                            <TabsList>
                                <TabsTrigger value="grid">Grid</TabsTrigger>
                                <TabsTrigger value="list">List</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </header>
                <AppLinks />
            </SidebarInset>
            <AddLinkDialog />
        </SidebarProvider>
    );
}

export default App;

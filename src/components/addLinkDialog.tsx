import {
    Dialog,
    DialogTitle,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import useLinkCollectionStore from "@/stores/useLinkCollectionStore";

function AddLinkDialog() {
    const [linkValue, setLinkValue] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const addLink = useLinkCollectionStore((state) => state.addLink);

    // Add protocol to link if needed
    function getClickableLink(link) {
        return link.startsWith("http://") || link.startsWith("https://")
            ? link
            : `http://${link}`;
    }

    // Use Link Preview API to get link info
    async function handleAdd() {
        let clickLink = getClickableLink(linkValue);
        if (clickLink) {
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

                const response = await res.json();

                // Use screenshot if there is no image returned by linkPreview API
                let linkImage;
                if (!response.image) {
                    linkImage = `https://api.screenshotmachine.com/?key=1b820e&url=${clickLink}&dimension=1024x768&delay=200`;
                } else {
                    linkImage = response.image;
                }

                // Add the link to the Zustand store
                addLink(response.title, clickLink, linkImage);

                setLinkValue("");
                setIsDialogOpen(false);
            } catch (error) {
                console.error("Error fetching link preview:", error);
            }
        } else {
            console.log(linkValue, "is an invalid link");
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
                className="bottom-6 right-6 size-12 rounded-xl flex items-center justify-center z-99 fixed"
                onClick={() => setIsDialogOpen(true)}>
                <Plus className="size-8" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="hidden" />
                <DialogDescription className="hidden" />
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Enter a link..."
                        className="input py-2 px-4 rounded-md"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                    />
                </div>
                <Button variant="secondary" onClick={handleAdd}>
                    Add Link
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

export default AddLinkDialog;

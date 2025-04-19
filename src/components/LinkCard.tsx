import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useLinkCollectionStore from "@/stores/useLinkCollectionStore";
import capitalizeFirstLetter from "@/utils/string-utils";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

interface LinkCardProps {
    title: string;
    description: string;
    image: string;
    activeCollectionId: string;
    linkId: string;
}

function LinkCard({
    title,
    description,
    image,
    activeCollectionId,
    linkId,
}: LinkCardProps) {
    const collections = useLinkCollectionStore((state) => state.collections);
    const moveLinkToCollection = useLinkCollectionStore(
        (state) => state.moveLinkToCollection
    );
    const deleteLink = useLinkCollectionStore((state) => state.deleteLink);

    const activeCollectionName =
        collections.find((collection) => collection.id === activeCollectionId)
            ?.name || "Unknown";

    const handleCollectionChange = (newCollectionName: string) => {
        const newCollection = collections.find(
            (collection) => collection.name === newCollectionName
        );
        if (newCollection) {
            moveLinkToCollection(linkId, newCollection.id);
        }
    };

    const handleDeleteLink = (e: React.MouseEvent) => {
        deleteLink(linkId);
    };

    return (
        <a href={description} target="_blank" rel="noopener noreferrer">
            <Card className="bg-zinc-50 border-none p-2 gap-4 relative group">
                <CardContent className="p-1">
                    <img
                        src={image}
                        alt=""
                        className="rounded-md hover:scale-105 transition-transform duration-200 ease-in-out w-full"
                    />
                </CardContent>
                {activeCollectionId !== "recent" && (
                    <div className="absolute top-5 right-5 z-10">
                        <Select
                            value={activeCollectionName}
                            onValueChange={handleCollectionChange}>
                            <SelectTrigger className="w-fit relative opacity-0 group-hover:opacity-100 [&[data-state=open]]:opacity-100 transition-opacity duration-200 ease-in-out">
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
                                <SelectGroup>
                                    <Separator className="my-2" />
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between hover:text-destructive font-normal text-sm !px-2"
                                        onClick={handleDeleteLink}>
                                        Delete <Trash2 />
                                    </Button>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <CardHeader className="p-1 overflow-hidden [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_90%,rgba(0,0,0,0))] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_90%,rgba(0,0,0,0))]">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </a>
    );
}

export default LinkCard;

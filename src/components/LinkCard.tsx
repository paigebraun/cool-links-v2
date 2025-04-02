import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface LinkCardProps {
    title: string;
    description: string;
    image: string;
}

function LinkCard({ title, description, image }: LinkCardProps) {
    return (
        <a href={description} target="_blank" rel="noopener noreferrer">
            <Card className="bg-zinc-50 border-none p-2 gap-4">
                <CardContent className="p-1">
                    <img
                        src={image}
                        alt=""
                        className="rounded-md hover:scale-105 transition-transform duration-200 ease-in-out w-full"
                    />
                </CardContent>
                <CardHeader className="p-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </a>
    );
}

export default LinkCard;

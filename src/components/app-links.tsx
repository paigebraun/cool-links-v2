import Masonry from "react-masonry-css";
import LinkCard from "./LinkCard";
import useLinkCollectionStore from "../stores/useLinkCollectionStore";

function AppLinks() {
    const links = useLinkCollectionStore((state) => state.links);

    const breakpointColumnsObj = {
        default: 4,
        1500: 3,
        1100: 2,
        850: 1,
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid px-4"
            columnClassName="my-masonry-grid_column">
            {links.map((link) => (
                <LinkCard
                    key={link.id}
                    title={link.title}
                    description={link.url}
                    image={link.image}
                />
            ))}
        </Masonry>
    );
}

export default AppLinks;

import Masonry from "react-masonry-css";

function AppLinks() {
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
            <div className="h-24 rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
        </Masonry>
    );
}

export default AppLinks;

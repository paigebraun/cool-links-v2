import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Link {
    id: string;
    title: string;
    url: string;
    image: string;
    collectionId: string;
}

interface Collection {
    id: string;
    name: string;
    links: Link[];
}

interface LinkCollectionStore {
    collections: Collection[];
    links: Link[];
    addLink: (
        title: string,
        url: string,
        image: string,
        collection?: string
    ) => void;
    deleteLink: (linkId: string) => void;
    moveLinkToCollection: (linkId: string, newCollectionId: string) => void;
    createCollection: (name: string) => void;
    deleteCollection: (collectionId: string) => void;
    renameCollection: (collectionId: string, newName: string) => void;
}

// Zustand store for links and collections
const useLinkCollectionStore = create<LinkCollectionStore>()(
    persist(
        (set) => ({
            collections: [{ id: "recent", name: "Recent", links: [] }],
            links: [],

            // links
            addLink: (title, url, image, collection) => {
                set((state) => {
                    const newLink = {
                        id: uuidv4(),
                        title,
                        url,
                        image,
                        collectionId: collection || "recent",
                    };
                    return { links: [...state.links, newLink] };
                });
            },
            deleteLink: (linkId) => {
                set((state) => ({
                    links: state.links.filter((link) => link.id !== linkId),
                }));
            },
            moveLinkToCollection: (linkId, newCollectionId) => {
                set((state) => {
                    const updatedLinks = state.links.map((link) =>
                        link.id === linkId
                            ? { ...link, collectionId: newCollectionId }
                            : link
                    );
                    return { links: updatedLinks };
                });
            },

            // collections
            createCollection: (name) => {
                set((state) => {
                    const newCollection = { id: uuidv4(), name, links: [] };
                    return {
                        collections: [...state.collections, newCollection],
                    };
                });
            },
            deleteCollection: (collectionId) => {
                set((state) => ({
                    collections: state.collections.filter(
                        (c) => c.id !== collectionId
                    ),
                    links: state.links.filter(
                        (link) => link.collectionId !== collectionId
                    ),
                }));
            },
            renameCollection: (collectionId, newName) => {
                set((state) => {
                    const updatedCollections = state.collections.map(
                        (collection) =>
                            collection.id === collectionId
                                ? { ...collection, name: newName }
                                : collection
                    );
                    return { collections: updatedCollections };
                });
            },
        }),
        {
            name: "link-collection-store", // Key for local storage
        }
    )
);

export default useLinkCollectionStore;

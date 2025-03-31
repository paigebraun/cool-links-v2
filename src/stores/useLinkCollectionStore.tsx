import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Zustand store for links and collections
const useLinkCollectionStore = create((set) => ({
    collections: [{ id: "recent", name: "Recent", links: [] }],
    links: [],

    // links
    addLink: (title, url, image) => {
        set((state) => {
            const newLink = {
                id: uuidv4(),
                title,
                url,
                image,
                collectionId: "recent",
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
            return { collections: [...state.collections, newCollection] };
        });
    },
    deleteCollection: (collectionId) => {
        set((state) => {
            if (collectionId === "recent") return state; // "recent" is the default, non-deletable collection
            const updatedCollections = state.collections.filter(
                (collection) => collection.id !== collectionId
            );
            const updatedLinks = state.links.map((link) =>
                link.collectionId === collectionId
                    ? { ...link, collectionId: "recent" }
                    : link
            );
            return { collections: updatedCollections, links: updatedLinks };
        });
    },
    renameCollection: (collectionId, newName) => {
        set((state) => {
            const updatedCollections = state.collections.map((collection) =>
                collection.id === collectionId
                    ? { ...collection, name: newName }
                    : collection
            );
            return { collections: updatedCollections };
        });
    },
}));

export default useLinkCollectionStore;

export interface PostInterface {
    _id: string;
    _createdAt: string;
    publishedAt: string;
    title: string;
    author: {
        name: string;
        image: string;
    };
    comments: Comment[];
    description: string;
    mainImage: {
        asset: {
            url: string;
        };
    };
    slug: {
        current: string;
    };
    body: [object];
    categories: string[]
}


export interface Comment {
    approved: boolean;
    name: string;
    comment: string;
    email: string;
    post: {
        _ref: string;
        _type: string;
    };
    _id: string;
    _createdAt: string;
    _rev: string;
    _type: string;
    updatedAt: string;
}

export interface Game {
    _id: string;
    title: string;
    author: string;
    banner: {
        asset: {
            url: string;
        };
    };
    url: string;
}
import { createContext } from "react";
export const UserContext = createContext({ user: null, email: null });
export const MedContext = createContext({ posts: null });
export const shipContext = createContext({ post: null });

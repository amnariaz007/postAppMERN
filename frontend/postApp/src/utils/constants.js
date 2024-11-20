export const  HOST =  import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth"
export const SINGUP_ROUTE = `${AUTH_ROUTES}/register`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const USER_INFO = `${AUTH_ROUTES}/userInfo`
export const LOGOUT = `${AUTH_ROUTES}/logout`

export const POST_ROUTES = "api/post"
export const CREATE_POST = `${POST_ROUTES}/createPost`
export const LIKE_POST = `${POST_ROUTES}/likePost`
export const DELETE_POST = `${POST_ROUTES}/deletePost`
export const GET_USER_POST = `${POST_ROUTES}/getUserPosts`
export const GET_ALL_POST = `${POST_ROUTES}/getAllPosts`

export const COMMENT_ROUTES = "api/comment"
export const ADD_COMMENT_POST = `${COMMENT_ROUTES}/addComment`











































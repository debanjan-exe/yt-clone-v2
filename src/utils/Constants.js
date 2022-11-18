export class endpoints {
    // static BASE_URL = "http://localhost:5000/api";
    static BASE_URL = "https://yt-clone-server.onrender.com/api";
    // static BASE_URL = "https://yt-clone-server-v1.herokuapp.com/api";

    static GET_VIDEOS = `${endpoints.BASE_URL}/videos`;

    static GET_VIDEOS_OF_USER = `${endpoints.BASE_URL}/videos/user`;

    static USER_LIKED_VIDEOS = `${endpoints.BASE_URL}/videos/liked`;

    static USER = `${endpoints.BASE_URL}/users/find`;

    static VIDEO = `${endpoints.BASE_URL}/videos/find`;

    static SIGNIN = `${endpoints.BASE_URL}/auth/signin`;

    static LOGOUT = `${endpoints.BASE_URL}/auth/logout`;

    static SIGNUP = `${endpoints.BASE_URL}/auth/signup`;

    static G_SIGNIN = `${endpoints.BASE_URL}/auth/google`;

    static LIKE_VIDEO = `${endpoints.BASE_URL}/users/like`;

    static DISLIKE_VIDEO = `${endpoints.BASE_URL}/users/dislike`;

    static SUBSCRIBE_CHANNEL = `${endpoints.BASE_URL}/users/sub`;

    static UNSUBSCRIBE_CHANNEL = `${endpoints.BASE_URL}/users/unsub`;

    static GET_COMMENTS = `${endpoints.BASE_URL}/comments`;
}

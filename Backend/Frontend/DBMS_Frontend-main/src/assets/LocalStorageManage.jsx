export const LocalStorageManage = () => {
    const token = localStorage.getItem("University_user_token");
    if (token) {
        return token;
    } else {
        return null;
    }
}
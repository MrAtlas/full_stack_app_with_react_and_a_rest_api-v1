import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { apiHelper } from "../utils/apiHelper";

const UserContext = createContext(null);

export const UserProvider = (props) => {
    const cookie = Cookies.get("autheticatedUser");
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

    const signIn = async (credentials) => {

        const response = await apiHelper("/users", "GET", null, credentials);
        if (response.status === 200) {
            const user = await response.json();
            user.password = credentials.password;
            setAuthUser(user);
            Cookies.set("autheticatedUser", JSON.stringify(user), { expires: 1 });
            return user
        } else if (response.status === 401) {
            return null
        } else {
            throw new Error();
        }
    }

    const signOut = () => {
        setAuthUser(null);
        Cookies.remove("autheticatedUser");
    }

    return (
        <UserContext.Provider value={{
            authUser,
            actions: {
                signIn,
                signOut
            }
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;
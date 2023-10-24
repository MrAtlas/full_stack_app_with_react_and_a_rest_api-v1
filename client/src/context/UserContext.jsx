import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { apiHelper } from "../utils/apiHelper";

// Create a context for managing user authentication
const UserContext = createContext(null);

export const UserProvider = (props) => {
    // Check if an authenticated user exists in the cookies
    const cookie = Cookies.get("authenticatedUser");
    // Initialize the state with the authenticated user or null
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

    // Function to sign in a user with provided credentials
    const signIn = async (credentials) => {
        try {
            // Send a GET request to authenticate the user
            const response = await apiHelper("/users", "GET", null, credentials);

            if (response.status === 200) {
                // If authentication is successful, set the user data in state and cookies
                const user = await response.json();
                user.password = credentials.password;
                setAuthUser(user);
                Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
                return user;
            } else if (response.status === 401) {
                // If authentication fails (Unauthorized), return null
                return null;
            } else {
                // Handle other response statuses as errors
                throw new Error();
            }
        } catch (error) {
            // Handle any exceptions that may occur during the authentication process
            throw error;
        }
    }

    // Function to sign out the user
    const signOut = () => {
        // Clear the authenticated user from state and cookies
        setAuthUser(null);
        Cookies.remove("authenticatedUser");
    }

    return (
        // Provide the authenticated user and authentication functions to the context
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

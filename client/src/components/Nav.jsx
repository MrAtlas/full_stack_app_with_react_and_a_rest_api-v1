import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const Nav = () => {

    const { authUser } = useContext(UserContext);

    return (
        <nav>
            {authUser === null ?
                <>
                    <Link className="signup" to="/signup">Sign up</Link>
                    <Link className="signin" to="/signin">Sign in</Link>
                </>
                :
                <>
                    <li>Welcome, {authUser.firstName} {authUser.lastName}</li>
                    <li><Link className="signout" to="/signout">SignOut</Link></li>
                </>}
        </nav>
    );
}

export default Nav;
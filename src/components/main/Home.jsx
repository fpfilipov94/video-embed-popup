import React from "react";

import { Link } from "react-router-dom";

const Home = () => (
    <div className="Home">
        <Link to="/popup" className="ShowPopup">
            Show Popup
        </Link>
    </div>
);

export default Home;

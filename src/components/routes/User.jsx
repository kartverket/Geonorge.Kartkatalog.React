// Dependencies
import React from "react";
import {getKartkatalogApiUrl} from "@/actions/ApiUrlActions";
import {useEffect, useState} from "react";

const User = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let url = getKartkatalogApiUrl()() + "/user";

        fetch(url)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error(error));
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <p>
            User: {user.Name}
        </p>
    );
};

export default User;
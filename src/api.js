const express = require("express");

function createApiHandler() {
    const router = express.Router();
    //Middleware to check authentication before accessing API
    function ensureAuthenticated(req, res, next) {
        if (!req.session.accessToken) {
            return res.status(401).json({ error: "You are unauthorized" });
        }
        next();
    }

    //Handle API requests
    router.get("/1.5", ensureAuthenticated, async (req, res) => {
        try {
            //Get the url and method from the query string
            const { url: endpoint, method = "GET" } = req.query; 
            
            if (!endpoint) {
            return res.status(400).json({ error: "Missing endpoint" });
            }

            //Dynamically extract the instance from session
            const instance = req.session.instance;
            //Dynamically build dynamic instance to the base URL
            const BASE_API_URL = `https://online.planmill.com/${instance}/api/1.5/`;

            const path = `${BASE_API_URL}${endpoint}`;
            const accessToken = req.session.accessToken;

            const options = {
                method: method,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await fetch(path, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            res.json(data);
        } catch (err) {
            console.error("Error fetching API data:", err);
            res.status(500).json({ error: "Error fetching API data" });
        }
    });
    
    return router;

}

module.exports = createApiHandler;
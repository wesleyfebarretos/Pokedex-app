import { setup } from "./app";

setup().then(app =>
    app.listen("3000", () => {
        console.log("running on port 3000");
    })
);

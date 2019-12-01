# DemoApp
An app to demo NodeJS implementation.

This app has authentication machainesm which permits its users to login and maintain a friends list.

Step By Step Breakdown:
01. 'npm init --yes' -> Setting up an npm project. This generates the package.json file.
02. Decided on the following libraries for the project:
    express - for easy backend coding
    express-session - for hadling user login session
    ejs - for view templates
    mongodb - for BE data storage

    Hence did npm install of all the above.

03. Started with the login page and Home page html.
04. Set up the basic server and routes that provides the above pages.
05. Tried MongoDB database connectivity and integrated the login feature.
06. Started adding the handleers for other uses.

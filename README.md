## Date of submission
10/11/2023
## Instructions to run assignment locally
 - run `docker-compose build` and `docker-compose up` in the root folder
 - Open `http://localhost:5173/` in the browser
## Time Spent
Around 7 hours
## Assumptions made
 - Once a username joins a chatroom the username is taken
 - User can see the chat history of the room whenever they join
 - User is unable to rejoin the chat room as the same username if they exit
## Shortcuts/Compromises made
 - CORS is disabled for easier development, this should not be the case in production as it can introduce security issues
 - Created a monorepo for backend and frontend and using one docker-compose to run both projects, not ideal in real world scenario where multiple people working on the project
## Production checklist
 - Ideally everything should be tested and also to setup a CI pipeline
 - Currently only one instace is running, ideally there should be multiple instances for production using something like PM2
 - A load balancer is also needed to handle high traffic when running multiple servers
 - To ensure application security CORS should definitely be turned on, allowing only the allowed origin to access the server. Sensitive information such as DB credentials should also be secured. Other than that possible security issue could be XSS (Cross site scripting) so text input should be sanitized
## Other information and feedback
Most of the code is generated using chatgpt but still using my own design, I feel like this greatly speeds up the process of creating a project from scratch as chatgpt can give me a pretty solid foundation on what I want to do. As for feedback for this assignment, this assignment has been fun since it has been a while since I used websockets and also the exercise is pretty unique and interesting as apart from coding I also need to think about the design of the system as well.

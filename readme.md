Thi package contains the following fuctionalities : 

Express server running on port 5050
ACL authorization (3 levels : 'guest', 'user', and 'admin'
    - 'guest' can only access the #login page
    - 'user' (viia facebook) can see the feed
    - 'admin' can see the admin feed (not tested);
Passport login with facebook & github
Backbone frontent


#How to run #

```
npm install
cd client
bower install
```

open one terminal: 
```
node server.js
```

open a second terminal:
```
grunt
```
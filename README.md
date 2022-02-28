# React Native Chat Handler using Firebase

This repo contains React native chat helper using firebase.

- This has "Send message" function which saves the message of user in firebase.

- "clearUnread" fuction will clear all the unread count of user

- "setLastSeen" will set the last seen time of user.

- "getEmployerDetails" will get the user details

- "setOnline" will set the online status of user

* "blockEmployer" function helps in block user functionality

* "statusListener" function helps to get the recent status of user

* "listenerOnBlock" called when any user gets blocked/unblocked

* "listenerOnChatroom" provides reference to current chatroom in which two users are currently chatting

* "listenerOnRoom" provides reference to all rooms available to check if there any change in any chatroom

* "listenerOnMyChatrooms" listener on a user's chatroom to listen if there is any new message recieved in all his/her chats.

* "deleteChat" function helps to delete of particular room

* "addUser" function creates new user to the database

* "checkUser" function checks if user exist in the database or not (which helps to create new user)

import database from '@react-native-firebase/database';
import moment from 'moment';

export default ChatHelper = {
    sendMessage: function (chatRoomId, userId, data, user, employerDetails) {
        console.log(JSON.stringify(user))
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}/messages`).push().set(data).then(() => {
            return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}`).update({
                lastMessage: data,
                chatRoomId: chatRoomId,
                employeeDetails: {
                    name: user.name,
                    image: user.image,
                    id: userId
                },
                employerDetails: employerDetails
            }).then(() => {
                return database().ref(`/employeer/${employerDetails.id}/myChatrooms/${chatRoomId}`).update({
                    lastMessage: data,
                    chatRoomId: chatRoomId,
                    employeeDetails: {
                        name: user.name,
                        image: user.image,
                        id: userId
                    },
                    employerDetails: employerDetails
                }).then(() => {
                    return database().ref(`/employeer/${employerDetails.id}/myChatrooms/${chatRoomId}/messages`).push().set(data).then(() => {
                        database().ref(`/employeer/${employerDetails.id}/myChatrooms/${chatRoomId}/unreadCount`).transaction(function (unreadCount) {
                            return unreadCount = unreadCount + 1
                        })
                        return true
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    },
    clearUnread: function (userId, chatRoomId) {
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}/unreadCount`).once('value').then(snapshot => {
            if (snapshot.exists()) {
                return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}/unreadCount`).transaction(function (unreadCount) {
                    return unreadCount = 0
                })
            }
        })
    },
    setLastSeen: function (userId) {
        return database().ref(`/employees/${userId}`).update({ lastSeen: moment().format() }).then(res => {
            console.log(res)
            return true
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    getEmployerDetails: function (userId, employerId) {
        return database().ref(`/employeer/${employerId}`).once('value').then(res => {
            return res.val()
        })
    },
    setOnline: function (userId, employerId, chatRoomId, isOnline) {
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}`).once('value').then(snapshot => {
            if (snapshot.exists()) {
                database().ref(`/employeer/${employerId}/myChatrooms/${chatRoomId}`).once('value').then(snapshotEmployer => {
                    if (snapshotEmployer.exists()) {
                        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}`).update({ isEmployeeOnline: isOnline }).then(res => {
                            console.log(res)
                            return database().ref(`/employeer/${employerId}/myChatrooms/${chatRoomId}`).update({ isEmployeeOnline: isOnline })
                        }).catch(err => {
                            console.log(err)
                            return false
                        })
                    }
                })
            }
        })
    },
    blockEmployer: function (userId, employerId, blockStatus) {
        const chatRoomId = `${userId}-${employerId}`
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}`).update({ isBlocked: blockStatus, blockedBy: 'employee' }).then(res => {
            console.log(res)
            return database().ref(`/employeer/${employerId}/myChatrooms/${chatRoomId}`).update({ isBlocked: blockStatus, blockedBy: 'employee' })
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    statusListener: function (employerId) {
        return database().ref(`/employees/${employerId}`)
    },
    listenerOnBlock: function (userId, chatRoomId) {
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}`)
    },
    listenerOnChatroom: function (userId, chatRoomId) {
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}/messages`)
    },
    listenerOnRoom: function () {
        return database().ref(`/rooms`)
    },
    listenerOnMyChatrooms: function (id) {
        return database().ref(`/employees/${id}/myChatrooms`)
    },
    deleteChat: function (userId, chatRoomId) {
        return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}`).remove().then(value => {
            console.log(value)
            return true
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    addUser: function (data) {
        return database().ref(`/employees/${data.id}`).set({
            id: data.id,
            image: data.image,
            name: data.name,
            email: data.email,
            myChatrooms: []
        }).then((res) => {
            console.log(res)
        }).catch(err => console.log(err))
    },
    checkUser: function (id) {
        return database().ref(`/employees/${id}`).once('value').then(doc => {
            if (doc.exists()) {
                console.log(doc.val())
                return true
            } else {
                return false
            }
        }).catch(err => console.log(err))
    }
}
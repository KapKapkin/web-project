function loadDialogs() {
    const promise = getDialogs();
    promise.then(data => {
        showDialogs(data)
    })
}

function showDialogs(data) {
    var dialogsInf = data['data']['dialogs'];
    var cur_user = data['data']['user_id'];

    dialogsInf.forEach(function (dialog) {
        const outputForm = document.querySelector('#dialogs-output');
        const templateToast = document.querySelector('#dialog-message-box');
        const clone = templateToast.content.cloneNode(true);

        const timeAgoPlace = clone.querySelector('#time-ago-strong');
        const dialogLast = clone.querySelector('#last-message-text');
        const userName = clone.querySelector('#user-name-text');

        var recipient_id;
        if (cur_user == dialog['user_one_id']) {
            var recipient_id = dialog['user_two_id']
        }
        else {
            var recipient_id = dialog['user_one_id']
        };



        const namePromise = getUser(recipient_id);
        namePromise.then(userData => {
            var user = userData['data']['users'];
            var userNameVal = user['name'];
            var userSurnameVal = user['surname'];

            var fullName = document.createTextNode(`${userNameVal} ${userSurnameVal}`);
            userName.appendChild(fullName);
            const lastMessagePromise = getMessages(recipient_id);
            lastMessagePromise.then(messagesData => {
                var messagesList = messagesData['data']['messages'][0];
                if ((messagesList != undefined) && (Object.keys(messagesList).length > 1)) {
                    var messageText = messagesList['content'];
                    var messageTime = messagesList['send_time'];
                    console.log(messageTime)
                    var date = messageTime.split(' ')[0].split('-');
                    var time = messageTime.split(" ")[1].split(':');
                    var dateTime = new Date(`${date[0]}-${date[1]}-${date[2]}T${time[0]}:${time[1]}`)
                    var nowTime = new Date();
                    var timeDelta = nowTime - dateTime;
                    var timeAgo = Math.round(timeDelta / 86400000);
                    var col = 'day(s)'
                    if (timeAgo < 1) {
                        var timeAgo = Math.round(timeDelta / 36000000);
                        var col = 'hour(s)'
                        if (timeAgo < 1) {
                            var timeAgo = Math.round(timeDelta / 60000)
                            var col = 'minute(s)'
                        }
                    }
                    var lastMessageTimeAgo = timeAgo + ` ${col}`

                    var timeAgoNode = document.createTextNode(lastMessageTimeAgo);
                    var lastMessage = document.createTextNode(messageText);
                    dialogLast.appendChild(lastMessage);
                    timeAgoPlace.appendChild(timeAgoNode);

                };
            });
            const div = clone.getElementById('dialogs-div');

            div.onclick = function () {
                document.location.href = `http://127.0.0.1:5000/dialogs/${recipient_id}`
            }
            outputForm.appendChild(clone);


        });



    })
}


function showMessages() {
    const messagesPromise = getMessages(id = 0, count = 0);
    messagesPromise.then(messagesData => {
        var curUser = messagesData['data']['user_id']
        var messagesList = messagesData['data']['messages']
        const outputForm = document.querySelector('#messages-form')
        outputForm.innerHTML = ''
        messagesList.forEach(message => {
            console.log(message)
            var messageText = message['content']
            var sendTime = message['send_time'];

            if (message['recipient_id'] == curUser) {
                var template = document.querySelector('#messages-template');
            }
            else {
                var template = document.querySelector('#own-messages-template');
            };
            const clone = template.content.cloneNode(true);
            const contentPlace = clone.querySelector('#messages-content');
            const timePlace = clone.querySelector('#messages-get-time');

            var text = document.createTextNode(messageText);
            var time = document.createTextNode(sendTime);



            timePlace.appendChild(time);
            contentPlace.appendChild(text);
            outputForm.appendChild(clone);

        })
        outputForm.scrollTop = outputForm.scrollHeight

    })
};

$(document).ready(function () {
    $("#message-send-submit").click(function () {
        var messageData = document.querySelector('#text');
        if (messageData.textContent != null) {
            str = messageData.textContent;
            postMessage(str);
        }
    })
});
function postMessage(messageText) {
    const messagePromise = sendMessage(messageText);
    messagePromise.then(data => { showMessages() });
};

function loadFeedPosts(id = 0) {
    const postPromise = getPosts(id);
    postPromise.then(data => {
        console.log(data)
        const outputForm = document.querySelector('#posts-list');
        outputForm.innerHTML=''
        const template = document.querySelector('#post-template');
        var postsList = data['data']['posts'];

        postsList.forEach(post => {

            const clone = template.content.cloneNode(true);
            const userNamePlace = clone.querySelector("#posts-owner");
            const timePlace = clone.querySelector("#posts-time");
            const contentPlace = clone.querySelector("#posts-content");

            var postContent = post['content'];
            var userId = post['owner'];
            var postTime = post['time'];

            contentNode = document.createTextNode(postContent);
            contentPlace.appendChild(contentNode);

            const userPromise = getUser(userId);
            userPromise.then(data => {
                var p = document.createElement('p')
                p.innerHTML = `<a href="http://127.0.0.1:5000/${data['data']['users']['id']}">${data['data']['users']['name']} ${data['data']['users']['surname']}</a>`
                userNamePlace.appendChild(p)
            });
            timeNode = document.createTextNode(postTime);
            timePlace.appendChild(timeNode);

            outputForm.appendChild(clone);

        });

    })
};


$(document).ready(function () {
    $("#post-send-submit").click(function () {
        var postContentData = document.querySelector('#post-input');
        if (postContentData.value != null) {
            str = postContentData.value;
            postPost(str);
        }
    })
})

function loadUserData(user_id) {
    const userPromise = getUser(user_id);
    userPromise.then(data => { 
        console.log(data)
        const output = document.querySelector('#profile-inf');
        var name = document.createElement('p')
        var email = document.createElement('p')
        var age = document.createElement('p')
        var form = document.createElement('form')
        var button = document.createElement('button')

        name.innerHTML = `<p>${data['data']['users']['name']} ${data['data']['users']['surname']}</p>`
        email.innerHTML = `<p>${data['data']['users']['email']}</p>`
        age.innerHTML = `<p>${data['data']['users']['age']}</p>`
        form.action = `http://127.0.0.1:5000/dialogs/${data['data']['users']['id']}`
        button.innerHTML = '<button type="submit" class="btn btn-outline-secondary" >dialog</button>'
        form.appendChild(button)
        output.appendChild(name)
        output.appendChild(email)
        output.appendChild(age)
        if (data['data']['user_id'] != data['data']['users']['id']){output.appendChild(form)}
        
    })
}


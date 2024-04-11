import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import Chatpanel from './Chatpanel';
import Friendlist from './Friendlist';

import '../styles/cspace.css';

import Searchbar from './Searchbar';
import Auth from './Auth';

function Chatspace() {

    const [uid, setUid] = useState((localStorage.getItem('friends') && JSON.parse(localStorage.getItem('friends')).uid) ? JSON.parse(localStorage.getItem('friends')).uid : '0');
    const [activeFriend, setActFriend] = useState('');
    const [friends, setFriends] = useState((JSON.parse(localStorage.getItem('friends')) && JSON.parse(localStorage.getItem('friends')).friends) ? JSON.parse(localStorage.getItem('friends')).friends : []);
    const updActive = () => {
        let livefriends = JSON.parse(localStorage.getItem('friends')).friends;
        let ffr = livefriends.find((fr) => (fr.id) === (activeFriend.id))
        setActFriend(ffr);
        //Update above code to create reliance on friends not localstorage
        // console.log(ffr.chats);
    };
    const deleteFriend = (uid,wat) => {
        let ex = friends.findIndex((fr)=>fr.id===uid);
        console.log(ex);
        if(ex>=0){
            console.log(friends.filter((friend)=>friend.id!==uid));
            let conf = window.confirm(`Are you sure you want to remove ${uid}`);
            if(conf){
                setFriends(friends.filter((friend)=>friend.id!==uid));
            }
            else{
                updActive();
            }
        }else{
            window.alert("Friend not found");
        }
        //Update above code to create reliance on friends not localstorage
        // console.log(ffr.chats);
    };
    let onSend = (msg) => {
        socket.emit('chatmess', msg).on('sent', (status) => {
            if (status === 'yes') {
                console.log('Message sent success!!!');
                let frl = [...friends];
                console.log(activeFriend);
                let curr = frl.findIndex((ffr) => ((ffr.id) === (activeFriend.id)));
                frl[curr].chats.push({ status: "to", ts: Date.now().toLocaleString(), msg: msg.mess });
                setFriends(frl);
            }
            else { window.alert("Failed to send message"); console.log('Message not sent') }
            updActive();
        });
    };
    async function requid(uname) {
        let resp = await axios.request({
            url: '/register',
            method: 'get',
            withCredentials: false,
            baseURL: `http://${window.location.hostname}:3000`,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            params: {
                id: uname
            },
            data: {
                id: uname
            }
        });
        return resp.data;
    }
    useEffect(() => {
        if (!localStorage.getItem('friends') || !JSON.parse(localStorage.getItem('friends')).friends) {
            //CHange this random generation to API call to backend to genfetchtoken
            // let randuid = parseInt(Math.random() * 10000);
            let user = window.prompt("Enter your username");
            requid(user).then((data) => {
                localStorage.setItem('friends', JSON.stringify({ uid: data.uid, friends: [] }));
                setUid(JSON.parse(localStorage.getItem('friends')).uid);
                setFriends(JSON.parse(localStorage.getItem('friends')).friends);
            }).catch((err) => {
                console.log(err);
                // window.alert(`http://${window.location.hostname}:3000`);
            });
        }
        else {
            setUid(JSON.parse(localStorage.getItem('friends')).uid);
            setFriends(JSON.parse(localStorage.getItem('friends')).friends)
        }
    }, []);
    useEffect(() => {
        function onConnect(sid) {
            // console.log(friends.map((friend)=>friend.id));
            let fids = friends.map((friend) => friend.id);
            let obj = {
                sid: sid,
                fids: fids
            };
            socket.emit('nudge', obj);
        }
        function onDisconnect() {

        }
        function onRecieve() {

        }
        ;
        socket.connect();

        socket.on('connect', () => {
            console.log("Connected");
            socket.emit('you', socket.id);
            onConnect(socket.id);
        });
        socket.on('nigg', (a,flag) => {
            // BIG CHANGE DONE HERE TO REMOVE CHATS FROM STATUS MESSAGE
            let tt = friends.map((frnd)=>{
                let {id,active} = frnd;
                return {id:id,active:active};
            })
            socket.emit('friends', tt, a, socket.id,flag);
        });
        socket.on('status', (data) => {
            let frens = [...friends];
            data.forEach((ffr, i) => {
                frens[i].active = ffr.active;
            });
            setFriends(frens);
            console.log(friends);
        });
        socket.on('servechat', (recchat) => {
            if ((recchat.to) === (uid)) {
                console.log(`Recieved: ${recchat}`);
                let ind = friends.findIndex((fr) => ((recchat.from) === (fr.id)));
                let fr = [...friends];
                let mess = { status: "from", ts: Date.now().toLocaleString(), msg: recchat.mess };
                if (ind > -1) {
                    fr[ind].chats.push(mess);
                }
                else {
                    fr.push({ id: recchat.from, chats: [mess] ,active:false})
                }
                setFriends(fr);
                let actfr = friends.find((fr) => ((recchat.from) === (fr.id)));
                if (activeFriend === actfr) {
                    updActive();
                }
                else {
                    setActFriend(actfr);
                }
            }
        });
        let rem = window.addEventListener("beforeunload", (ev) => {
            socket.emit('ruser', { friends, uid });
            socket.disconnect();
        });
        return ()=>{
            window.removeEventListener('beforeunload',rem);
            socket.removeListener('servechat');
        }
    }, []);
    useEffect(() => {
        if(uid){
            socket.emit('hey', uid, friends.map((fr) => fr.id));
        }
    }, [uid]);
    useEffect(() => {
        let frens = JSON.parse(localStorage.getItem('friends'));
        if (frens) {
            frens.friends = friends;
            localStorage.setItem('friends', JSON.stringify(frens));
        }
    },
        [friends]);
    if (localStorage.getItem('friends')) {
        return (
            <div className='cspace'>
                <h1>{uid}</h1>
                <Friendlist afr={activeFriend} frlist={friends} safr={setActFriend} delfr={deleteFriend} />
                <Chatpanel iid={uid} sfriends={setFriends} afr={activeFriend} sendMsg={onSend} />
                <Searchbar sfriends={setFriends} frs={friends} iid={uid} />
            </div>
        )
    }
    else {
        return (
            // Make this the lander with a modal form
            <Auth />
        )
    }
    // return (
    //     <Auth />
    // )

}
export default Chatspace;
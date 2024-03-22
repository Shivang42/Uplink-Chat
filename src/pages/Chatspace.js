import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import Chatpanel from './Chatpanel';
import Friendlist from './Friendlist';

import '../styles/cspace.css';

import Searchbar from './Searchbar';

function Chatspace() {

    const [uid, setUid] = useState((localStorage.getItem('friends')&&JSON.parse(localStorage.getItem('friends')).uid)?JSON.parse(localStorage.getItem('friends')).uid:'0');
    const [activeFriend, setActFriend] = useState('');
    const [friends, setFriends] = useState((JSON.parse(localStorage.getItem('friends'))&&JSON.parse(localStorage.getItem('friends')).friends)?JSON.parse(localStorage.getItem('friends')).friends:[]);
    const updActive = ()=>{
        let livefriends = JSON.parse(localStorage.getItem('friends')).friends;
        let ffr = livefriends.find((fr)=>parseInt(fr.id)===parseInt(activeFriend.id))
        setActFriend(ffr);
        //Update above code to create reliance on friends not localstorage
        // console.log(ffr.chats);
    };
    let onSend = (msg) => {
        socket.emit('chatmess', msg).timeout(10000).on('sent', (status) => {
            if (status === 'yes') { 
                console.log('Message sent success!!!') ;
                let frl = JSON.parse(localStorage.getItem('friends'));
                let curr = frl.friends.findIndex((ffr)=>(parseInt(ffr.id)===parseInt(activeFriend.id)));
                console.log(curr);
                frl.friends[curr].chats.push({status:"to",ts:Date.now().toLocaleString(),msg:msg.mess});
                localStorage.setItem('friends',JSON.stringify(frl));
            }
            else { window.alert("Failed to send message");console.log('Message not sent') }
            updActive();
        });  
    };
    async function requid() {
        let resp = await axios.request({
            url: '/register',
            method: 'get',
            withCredentials: false,
            baseURL: `http://${window.location.hostname}:3000`,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        });
        return resp.data;
    }
    useEffect(() => {
        if (!localStorage.getItem('friends') || !JSON.parse(localStorage.getItem('friends')).friends) {
            //CHange this random generation to API call to backend to genfetchtoken
            // let randuid = parseInt(Math.random() * 10000);
            requid().then((data) => {
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
        function onConnect() {

        }
        function onDisconnect() {

        }
        function onRecieve() {

        }
        ;
        socket.connect();
    
        socket.on('connect', ()=>{
            console.log("Connected");
        });
        socket.on('servechat', (recchat)=>{
            if(parseInt(recchat.to)===parseInt(uid)){
                console.log(recchat);
                let ind = friends.findIndex((fr)=>(parseInt(recchat.from)===parseInt(fr.id)))
                let fr = friends;
                let mess = {status:"from",ts:Date.now().toLocaleString(),msg:recchat.mess};
                if(ind>-1){
                    fr[ind].chats.push(mess);
                }
                else{
                    fr.push({id:recchat.from,chats:[mess]})
                }
                setFriends(fr);
                let actfr = friends.find((fr)=>(parseInt(recchat.from)===parseInt(fr.id)));
                if(activeFriend===actfr){
                    updActive();
                }
                else{
                    setActFriend(actfr);
                }
            }
        });
        window.addEventListener("beforeunload", (ev) => {
            socket.emit('ruser',uid);
        });
    }, []);
    useEffect(()=>{
            socket.emit('hey', uid);
    },[uid]);
    useEffect(()=>{
        let frens = JSON.parse(localStorage.getItem('friends'));
        if(frens){
            frens.friends = friends;
            localStorage.setItem('friends',JSON.stringify(frens));

        }
    },
    [friends]);

    if(localStorage.getItem('friends')){
        console.log(localStorage.getItem('friends'));
        return (
            <div className='cspace'>
                <h1>{uid}</h1>
                <Friendlist afr = {activeFriend} frlist={friends} safr={setActFriend} />
                <Chatpanel  iid={uid} afr={activeFriend} sendMsg={onSend} />
                <Searchbar sfriends={setFriends} frs={friends} iid={uid} />
            </div>
        )
    }
    else{
        return (
            <div className='errorMSG'>
                Could not find user
            </div>
        )
    }
    
}
export default Chatspace;
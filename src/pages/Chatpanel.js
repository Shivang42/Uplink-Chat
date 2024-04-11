import {useState,useRef,useEffect} from 'react';
import {ReactComponent as Logo} from '../logo.svg';
function messDialog(x,y){
    return (
        <>
            <button className='del'>Delete Message</button><button className='cancel'>Cancel</button>
        </>
    )
}
function Chatpanel(props) {
    const [history,setHistory] = useState([]);
    useEffect(()=>{
        setHistory(props.afr?props.afr.chats:[]);
        console.log(props.afr);
    },[props.afr])
    useEffect(()=>{
        // window.alert(props.afr.id);
        let frs2 = JSON.parse(localStorage.getItem('friends'));
        console.log(frs2.friends);
        if(props.afr){
            let find = frs2.friends.findIndex((fr)=>fr.id===props.afr.id);
            if(find>=0){
                // window.alert(find);
                frs2.friends[find].chats = history;
                props.sfriends(frs2.friends);
            }

        }
    },[history]);
    const currRef = useRef(0);
    function sendMsg() {
        let msgCont = currRef.current.value;
        let msg = {
            to:props.afr.id,
            from:props.iid,
            mess:msgCont
        };
        props.sendMsg(msg);
    }
    function showOpts(e) {
        e.preventDefault();
        let chist = e.target.parentElement;
        let fs  = document.createElement('fieldset');
        fs.innerHTML = `
        <fieldset class='dialog' style='left:${e.target.offsetLeft}px;top:${e.target.offsetTop}px;'>
            <button classN='del'>Delete Message</button><button className='cancel'>Copy</button>
        <fieldset/>`;
        fs.addEventListener('mouseleave',(e)=>{
            e.target.remove();
        });
        let buttons = fs.querySelectorAll("button");
        buttons[0].addEventListener('click',(e)=>{
            let his2 = [...history];
            his2 = his2.filter((chat)=>chat.ts!==this.ts);
            // Later include delete for others options

            setHistory(his2);
        });
        buttons[1].addEventListener('click',(ee)=>{
            let cont = document.querySelector("blockquote").innerText.split("\n").pop();
            navigator.clipboard.writeText(cont);
        });
        chist.appendChild(fs);
    }
    return (<div id="chatsect">
        <div className='chathistory'>
            {props.afr?null:<Logo/>}
            {history?history.map((chat,i)=>(<blockquote  onContextMenu={showOpts.bind(chat)} title={new Date(parseInt(chat.ts.replaceAll(',',''))).toUTCString()} key={i} className={chat.status==='from'?'recieved':'sent'}><p>{new Date(parseInt(chat.ts.replaceAll(',',''))).toLocaleString().split(',')[1]}</p>{chat.msg}</blockquote>)):<Logo/>}
            {/* {(props.afr.chats.length>0)?props.afr.chats.map((ee)=>(<blockquote></blockquote>)):'101'} */}
            {/* {props.afr.chats?props.afr.chats.map((chat)=>(<blockquote>{chat.msg}</blockquote>)):''} */}
        </div>
        <fieldset id="chatbox">
            <input id="chat" ref={currRef} type="textarea" width='15' placeholder="Enter your thoughts ...."></input>
            <button id="send" onClick={sendMsg}>
            </button>
        </fieldset>
    </div>
    );
}
export default Chatpanel;
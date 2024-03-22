import {useState,useRef,useEffect} from 'react';
import {ReactComponent as Logo} from '../logo.svg';
function Chatpanel(props) {
    const [history,setHistory] = useState([]);
    useEffect(()=>{
        setHistory(props.afr.chats);
        console.log(props.afr);
    },[props.afr])
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
    return (<div id="chatsect">
        <div className='chathistory'>
            {history?history.map((chat,i)=>(<blockquote key={i} className={chat.status=='from'?'recieved':'sent'}>{chat.msg}</blockquote>)):<Logo/>}
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
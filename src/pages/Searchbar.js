import { useState ,useEffect,useRef} from 'react';
import axios from 'axios';
import socket from '../socket';
function addMatch(iid){
    let friends = JSON.parse(localStorage.getItem('friends'));
    friends.friends.push({id:iid.target.innerText,chats:[]});
    localStorage.setItem('friends',JSON.stringify(friends));
}
const sleepCont = (
    <svg id="search" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="white"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
        </svg>
);
function activeCont(searchHandler,ssref,nmatches){
    return (<>
    <div className='sheader'>
        <input ref={ssref} type="text" name="searchuser" id="suser" onInput={searchHandler}></input>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="white"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
        </svg>
        
    </div>
    <fieldset id="sresults">
        {
            nmatches.map((match,i)=>
            (<label key={i} onClick={addMatch.bind(match)}>{match}</label>)
            )
        }
    </fieldset>
</>
);
}
function Searchbar(props) {
    const [active, setActive] = useState(false);
    const [matches,setMatches] = useState([]);
    useEffect(()=>{
        props.sfriends(JSON.parse(localStorage.getItem("friends")).friends);
    },[localStorage.getItem('friends')]);
    const sbar = useRef(null);
    const sHandler = ()=>{
        let sterm = sbar.current.value;
            axios.get(
                `http://${window.location.hostname}:3000/finduser`, {
                method: 'get', 
                withCredentials:false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                  },
                params:{'sterm':sterm}
            }).then((res)=>{
                let bod = res.data;
                if(bod.status=='success'){
                    bod.matches = bod.matches.filter((mat)=>mat!=props.iid&&!props.frs.some((m)=>mat==m));
                    setMatches(bod.matches);
                }
            });
        }
    const cont = active ? activeCont(sHandler,sbar,matches) : sleepCont;
    
    return (
        <fieldset id="searchbar" className={active?'gridsearch':'flexsearch'} onMouseLeave={()=>{setActive(false)}} onMouseEnter={()=>{setActive(true)}}>
            {cont}
        </fieldset>
    );
}
export default Searchbar;

// if(!req.query.sterm){
//     res.send(JSON.stringify({status:'failure',matches:[]}));
//     res.end();
// }
// console.log(activeuser);
// let sregex = `^${req.query.sterm}[a-zA-Z0-9]+`;
// sregex = (new RegExp(sregex,'g'));
// let users = activeuser.filter((auser)=>sregex.exec(auser));
// res.send(JSON.stringify({status:'success',matches:users}));
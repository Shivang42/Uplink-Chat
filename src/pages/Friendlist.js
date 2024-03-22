import {useEffect} from 'react';
function Friendlist(props) {
    // const friends = ['Nigga', 'Gigga', 'Higga'];
    useEffect(()=>{
        console.log(101010);
        // console.log(props.frlist);
    },[props.friends,props.afr])
    const setAcFr = (ele)=>{
        let ffr = props.frlist.find((fr)=>parseInt(fr.id)==parseInt(ele.target.innerHTML))
        props.safr(ffr);
    };
    return (
        <fieldset id="frlist">
            {
                props.frlist.map((friend,i) =>
                    (<label className={props.afr.id===friend.id?'active':''} key={i} onClick={setAcFr}>{friend.id}</label>)
                )
            }
        </fieldset>
    );
}
export default Friendlist;
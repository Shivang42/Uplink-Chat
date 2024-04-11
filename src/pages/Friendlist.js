import { useEffect } from 'react';
function Online(cname){
    return (<svg className={cname.cname} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3" /></svg>);
}
function Bin(props){
    return (<a onClick={props.del}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7.615 20q-.666 0-1.14-.475Q6 19.051 6 18.385V6h-.5q-.213 0-.356-.144T5 5.499t.144-.356T5.5 5H9q0-.31.23-.54t.54-.23h4.46q.31 0 .54.23T15 5h3.5q.213 0 .356.144q.144.144.144.357q0 .212-.144.356T18.5 6H18v12.385q0 .666-.475 1.14q-.474.475-1.14.475zm2.693-3q.213 0 .356-.144t.144-.356v-8q0-.213-.144-.356T10.307 8t-.356.144t-.143.356v8q0 .213.144.356t.356.144m3.385 0q.213 0 .356-.144t.143-.356v-8q0-.213-.144-.356T13.692 8t-.356.144t-.144.356v8q0 .213.144.356t.357.144"/></svg></a>);
}
function Friendlist(props) {
    useEffect(() => {
        console.log(101010);
    }, [props.friends, props.afr])
    const setAcFr = (ele) => {
        let ffr = props.frlist.find((fr) => fr.id === ele.target.innerText);
        props.safr(ffr);
    };
    return (
        <fieldset id="frlist">

            {
                props.frlist.map((friend, i) =>
                    (
                    <div className={(props.afr && (props.afr.id === friend.id)) ? 'active' : ''} key={i} onClick={setAcFr}>
                        <label>{friend.id}</label>
                        <span>
                        {<Online cname={friend.active?'act':'inact'} />}
                        {<Bin cname={friend.active?'act':'inact'} del={props.delfr.bind(null,friend.id)} />}
                        </span>
                    </div>)
                )
            }
        </fieldset>
    );
}
export default Friendlist;
function Chatmessage(props) {
    return (

            <p className="chatMessage"><b>{props.username}:</b> {props.message}</p>


    )
}
export default Chatmessage;
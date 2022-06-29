function Color(props) {

    const colorStyle = {
        backgroundColor: props.color
    }

    function changeColor(){
        props.changeColor(props.color)
    }

    return (
        <>
            <li style={colorStyle} className="color" onClick={changeColor}></li>
        </>

    )
}

export default Color;





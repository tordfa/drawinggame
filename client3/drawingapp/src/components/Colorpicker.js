import Color from "./Color";

function Colorpicker(props) {


    return (
        <>
            <div className="fargevelger">
                <ul>
                    {props.children}
                </ul>
            </div>
        </>

    )
}

export default Colorpicker;





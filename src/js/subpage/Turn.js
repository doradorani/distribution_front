import React, { useRef, useEffect } from 'react';
import $ from 'jquery';

const Turn = (props) => {
    let fadeClass = useRef(null);

    useEffect(() => {
        if (fadeClass.current) {
            $(fadeClass.current).turn(Object.assign({}, props.options));
        }
    }, [props.options]);

    return (
        <div className={props.className} style={Object.assign({}, props.style)} ref={fadeClass}>
            {props.children}
        </div>
    );
};

export default Turn;

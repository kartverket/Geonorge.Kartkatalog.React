// Dependencies
import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";

// Stylesheets
import style from "components/partials/Buttons/Modal.module.scss";
import styleBtn from "components/partials/Buttons/Buttons.module.scss";

const Modal = (props) => {
    // Refs
    const wrapperRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                props.handleClose();
            }
        };
        const handleEscapeClick = (event) => {
            if (event.keyCode === 27) {
                props.handleClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside, false);
        document.addEventListener("keydown", handleEscapeClick, false);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside, false);
            document.removeEventListener("keydown", handleEscapeClick, false);
        };
    }, [props.handleClose]);

    const modalClassnames = classNames({
        [style.modal]: true,
        [style.hidden]: !props.show
    });
    const modalButtonClassnames = classNames({
        [styleBtn.btn]: true,
        [style.modalButton]: true
    });
    return (
        <div className={modalClassnames}>
            <section ref={wrapperRef} className={style.modalMain}>
                {props.children}
                <button className={modalButtonClassnames} onClick={props.handleClose}>
                    Lukk
                </button>
            </section>
        </div>
    );
};

export default Modal;

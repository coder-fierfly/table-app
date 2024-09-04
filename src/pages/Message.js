import React from 'react';
import '../App.css';

const Message = ({ isOpen, text, onClose }) => {

    // если закрыто, то не отображается
    if (!isOpen) {
        console.log("if (!isOpen)")
        return null;
    }
    
    return (
        <div className="popup-overlay mes-win">
            <div className="popup min-h-w">
                <div className="popup-content">
                    {text && (
                        <button className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    )}
                    <div>
                        <div className='pop-cont-w'>
                            {!text ? <div className="spinner"></div> : <p>{text}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
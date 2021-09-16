import React from 'react';
import './popup.css';

// Images
import logo128  from "./assets/img/habitx128.png";
import checkmark from "./assets/img/checkbox.svg";


export default class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            habitxIsEnabled : false,
            habitxBlockedSites : [],
            habitxBlockCountdownSeconds : 10,
        }

        window.chrome.storage.sync.get(['habitxIsEnabled','habitxBlockedSites','habitxBlockCountdownSeconds'], (data) => {
            this.setState(data);
        });

        this.syncConfig = () => {
            window.chrome.storage.sync.set(this.state);
        }

    }

    toggleEnable = () => {
        this.setState({habitxIsEnabled : !this.state.habitxIsEnabled}, ()=>this.syncConfig());
    }


    render() {
        return (
            <div className="main-container">
                <div id="header">
                    <div className="icon">
                        <span className="first">Habit</span>
                        <span className="second">X</span>
                    </div>

                    <label className="switch">
                        <input 
                            type="checkbox"
                            checked={this.state.habitxIsEnabled}
                            onChange={()=>this.toggleEnable()}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div id="is-blocked-banner">
                    This site is in the blocklist
                    <img src={checkmark}/>
                </div>


            </div>
        );
    }
}
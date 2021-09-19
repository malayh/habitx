import React from 'react';
import './popup.css';

// Images
import checkmark from "./assets/img/checkbox.svg";
import trash from "./assets/img/trash.svg";


export default class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            habitxIsEnabled : false,
            habitxBlockedSites : [],
            habitxBlockCountdownSeconds : 10,

            isCurrentSiteBlocked : false,
        }
        
        this.currentHostName = null;

        window.chrome.storage.sync.get(['habitxIsEnabled','habitxBlockedSites','habitxBlockCountdownSeconds'], (data) => {
            this.setState(data);
            this.isCurrentSiteBlocked();
        });

    }

    syncConfig = () => {
        window.chrome.storage.sync.set({
            habitxIsEnabled : this.state.habitxIsEnabled,
            habitxBlockedSites : this.state.habitxBlockedSites,
            habitxBlockCountdownSeconds : this.state.habitxBlockCountdownSeconds
        });
    }

    isCurrentSiteBlocked = () => {
        window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            const url = new URL(tab.url);
            const domain = url.hostname;

            this.currentHostName = domain;
        
            for(const site of this.state.habitxBlockedSites) {
                const _rx = new RegExp(site.url);
                if( _rx.test(domain) ){
                    this.setState({isCurrentSiteBlocked: true});
                    return;
                }

                this.setState({isCurrentSiteBlocked: false})
            }
        });
    }

    toggleEnable = () => {
        this.setState({habitxIsEnabled : !this.state.habitxIsEnabled}, ()=>this.syncConfig());
    }

    deleteFromBlockedList = (url) => {
        const _new_list = this.state.habitxBlockedSites.filter((blockedSite)=>{
            return blockedSite.url !== url;
        });

        this.setState({habitxBlockedSites:_new_list,isCurrentSiteBlocked:false},()=>this.syncConfig());
    }

    blockCurrentSite = () =>{
        console.log(this.currentHostName);
        if(!this.currentHostName){
            return;
        }

        const _new_list = this.state.habitxBlockedSites.slice();
        _new_list.push({url: this.currentHostName});
        this.setState({habitxBlockedSites:_new_list,isCurrentSiteBlocked:true}, ()=>this.syncConfig());
    }

    render() {
        console.log(this.state);
        const blockButton = (
            <button id="add-button" onClick={this.blockCurrentSite}>
                Block this site
            </button>
        );

        const blockedBanner = (
            <div id="is-blocked-banner">
                This site is in the blocklist
                <img src={checkmark}/>
            </div>
        );

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

                {this.state.isCurrentSiteBlocked ? blockedBanner : blockButton}

                <h3>Settings</h3>

                <div id="blocked-list-container">
                    <h4>Blocked sites</h4>
                    {

                        this.state.habitxBlockedSites.map((blockedSite, index) => {
                            return (
                                <div className="blocker-list-item" key={index}>
                                    <div className="url">{blockedSite.url}</div>
                                    <div className="delete-button" onClick={()=>this.deleteFromBlockedList(blockedSite.url)}>
                                        <img src={trash}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <div className="settings-item">
                    <h4>Block timeout</h4>
                    <div>{this.state.habitxBlockCountdownSeconds} sec</div>
                    <input
                        value={this.state.habitxBlockCountdownSeconds}
                        type="range" 
                        min="0" max="300" 
                        onChange={(evt)=>this.setState({habitxBlockCountdownSeconds:evt.target.value},()=>this.syncConfig())}
                    />
                </div>
                

            </div>
        );
    }
}
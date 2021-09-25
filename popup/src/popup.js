import React from 'react';
import './popup.css';

// Images
import checkmark from './assets/img/checkbox.svg';
import trash from './assets/img/trash.svg';

const default_config_keys = [
    'habitxIsEnabled',
    'habitxBlockedSites',
    'habitxBlockCountdownSeconds',
    'habitxInteruptAfterMinutes',
    'habitxReenableAfterMinutes',
];

export default class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            habitxIsEnabled: false,
            habitxBlockedSites: [],
            habitxBlockCountdownSeconds: 10,
            habitxInteruptAfterMinutes: 5,
            habitxReenableAfterMinutes: 5,

            isCurrentSiteBlocked: false,
        };

        this.currentHostName = null;

        window.chrome.storage.sync.get(default_config_keys, (data) => {
            this.setState(data);
            this.isCurrentSiteBlocked();
        });
    }

    _setState = (...args) => {
        this.setState(...args, () => this.syncConfig());
    };

    syncConfig = () => {
        let _obj = {};
        for (const key of default_config_keys) {
            _obj[key] = this.state[key];
        }

        window.chrome.storage.sync.set(_obj);
    };

    isCurrentSiteBlocked = () => {
        window.chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs) => {
                const tab = tabs[0];
                const url = new URL(tab.url);
                const domain = url.hostname;

                this.currentHostName = domain;

                for (const site of this.state.habitxBlockedSites) {
                    const _rx = new RegExp(site.url);
                    if (_rx.test(domain)) {
                        this.setState({ isCurrentSiteBlocked: true });
                        return;
                    }

                    this.setState({ isCurrentSiteBlocked: false });
                }
            }
        );
    };

    toggleEnable = () => {
        this.setState({ habitxIsEnabled: !this.state.habitxIsEnabled }, () =>
            this.syncConfig()
        );
    };

    deleteFromBlockedList = (url) => {
        const _new_list = this.state.habitxBlockedSites.filter(
            (blockedSite) => {
                return blockedSite.url !== url;
            }
        );

        this.setState(
            { habitxBlockedSites: _new_list, isCurrentSiteBlocked: false },
            () => this.syncConfig()
        );
    };

    blockCurrentSite = () => {
        if (!this.currentHostName) {
            return;
        }

        const _new_list = this.state.habitxBlockedSites.slice();
        _new_list.push({ url: this.currentHostName });
        this.setState(
            { habitxBlockedSites: _new_list, isCurrentSiteBlocked: true },
            () => this.syncConfig()
        );
    };

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
                <img src={checkmark} />
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
                            onChange={() => this.toggleEnable()}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                {this.state.isCurrentSiteBlocked ? blockedBanner : blockButton}

                <div id="blocked-list-container">
                    <h4>Blocked sites</h4>
                    {this.state.habitxBlockedSites.map((blockedSite, index) => {
                        return (
                            <div className="blocker-list-item" key={index}>
                                <div className="url">{blockedSite.url}</div>
                                <div
                                    className="delete-button"
                                    onClick={() =>
                                        this.deleteFromBlockedList(
                                            blockedSite.url
                                        )
                                    }
                                >
                                    <img src={trash} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="settings-item">
                    <div className="name">Block timeout</div>
                    <div clasName="value">
                        {this.state.habitxBlockCountdownSeconds} sec
                    </div>
                    <input
                        value={this.state.habitxBlockCountdownSeconds}
                        type="range"
                        min="0"
                        max="300"
                        onChange={(evt) =>
                            this._setState({
                                habitxBlockCountdownSeconds: evt.target.value,
                            })
                        }
                    />
                </div>

                <div className="settings-item">
                    <div className="name">Interupt every</div>
                    <div clasName="value">
                        {this.state.habitxInteruptAfterMinutes} minutes
                    </div>
                    <input
                        value={this.state.habitxInteruptAfterMinutes}
                        type="range"
                        min="1"
                        max="120"
                        onChange={(evt) =>
                            this._setState({
                                habitxInteruptAfterMinutes: evt.target.value,
                            })
                        }
                    />
                </div>

                <div className="settings-item">
                    <div className="name">Reenable after</div>
                    <div clasName="value">
                        {this.state.habitxReenableAfterMinutes} minutes
                    </div>
                    <input
                        value={this.state.habitxReenableAfterMinutes}
                        type="range"
                        min="1"
                        max="120"
                        onChange={(evt) =>
                            this._setState({
                                habitxReenableAfterMinutes: evt.target.value,
                            })
                        }
                    />
                </div>
            </div>
        );
    }
}

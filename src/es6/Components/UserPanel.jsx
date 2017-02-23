// UserPanel -> Required by Main
// --------------------------------------
// The login management half of the greeter logic.

import Inferno from 'inferno';
import Component from 'inferno-component';

import UserSwitcher from './UserSwitcher';
import UserPanelForm from './UserPanelForm';

const FADE_IN_DURATION = 200;
const ERROR_SHAKE_DURATION = 600;


export default class LoginPanel extends Component {
  constructor(props) {
    super(props);

    this.store = this.props.store;
    this.storeState = this.store.getState();

    this.unsubscribe = this.store.subscribe(() => {
      this.storeState = this.store.getState();
      this.setState({
        "_toggleUpdate": !this.state._toggleUpdate
      });
    });

    this.state = {
      "dropdownActive": false,
      "fadeIn": false,
      "password": "",
      "passwordFailed": false,
      "switcherActive": false,
      "_toggleUpdate": false
    };
  }

  componentWillMount() {
    // Define functions required in the global scope by LightDM.
    window.show_prompt = (text, type) => {
      if (type === 'text') {
        window.notifications.generate(text);
      } else if (type === 'password') {
        window.lightdm.respond(this.state.password);
      }
    };

    window.show_message = (text, type) => {
      window.notifications.generate(text, type);
    };

    window.authentication_complete = () => {
      if (window.lightdm.is_authenticated) {
        window.lightdm.start_session_sync(this.storeState.session.key);
      } else {
        this.rejectPassword();
      }
    };

    window.autologin_timer_expired = () => {
      window.notifications.generate("Autologin expired.");
    };
  }

  handleDropdownClick(event) {
    this.setState({
      "dropdownActive": true
    });
  }

  handleDropdownLeave(event) {
    this.setState({
      "dropdownActive": false
    });
  }

  handleLoginSubmit(event) {
    event.preventDefault();

    if (window.debug === true) {
      if (this.state.password.toLowerCase() !== 'password') {
        this.rejectPassword();
      } else {
        window.notifications.generate(`You are now logged in as ${this.storeState.user.display_name} to ${this.storeState.session.name}.`, 'success');
        this.setState({
          "password": ""
        });
      }
    }

    else {
      window.lightdm.authenticate(this.storeState.user.username);
    }
  }

  handleSwitcherClick(event) {
    if (window.lightdm.users.length < 2) {
      window.notifications.generate("You are the only user that is able to log in on this system.", 'error');
      return false;
    } else if (window.lightdm.users.length === 2) {
      // No point in showing them the switcher if there is only one other user. Switch immediately.
      let otherUser = window.lightdm.users.filter((user) => {
        return user.username !== this.storeState.user.username;
      })[0];

      this.setActiveUser(otherUser, true);
      window.notifications.generate("User has been automatically switched to the only other user on this system.");
    } else {
      this.setState({
        "switcherActive": true
      });
    }
  }

  handlePasswordInput(event) {
    this.setState({
      "password": event.target.value
    });
  }

  setActiveSession(session) {
    this.store.dispatch({
      'type': 'AUTH_SET_ACTIVE_SESSION',
      'session': session
    });

    this.setState({
      "dropdownActive": false
    });
  }

  setActiveUser(user, isBypass) {
    this.store.dispatch({
      "type": 'AUTH_SET_ACTIVE_USER',
      "user": user
    });

    // Fade in, except when switching between 1 of 2 users.
    if (isBypass === false || isBypass === undefined) {
      this.setState({
        "fadeIn": true,
        "switcherActive": false
      });

      setTimeout(() => {
        this.setState({
          "fadeIn": false
        });
      }, FADE_IN_DURATION);
    } else {
      this.setState({
        "switcherActive": false
      });
    }
  }

  rejectPassword() {
    window.notifications.generate("Password incorrect, please try again.", 'error');

    this.setState({
      "password": "",
      "passwordFailed": true
    });

    setTimeout(() => {
      this.setState({
        "passwordFailed": false
      });
    }, ERROR_SHAKE_DURATION);
  }

  generateSwitchUserButton() {
    let classes = ['left'];

    if (window.lightdm.users.length < 2) {
      classes.push('disabled');
    }

    return (
      <div className={ classes.join(' ') } onClick={ this.handleSwitcherClick.bind(this) }>SWITCH USER</div>
    );
  }

  render() {
    let loginPanelClasses = ['login-panel-main'];

    if (this.state.fadeIn === true) {
      loginPanelClasses.push('fadein');
    }

    if (this.state.switcherActive === true) {
      loginPanelClasses.push('fadeout');
    }

    let switchUserButton = this.generateSwitchUserButton();

    return (
      <div className="login-panel-contents">
        <div className={ loginPanelClasses.join(' ') }>
          <div className="avatar-container">
            <div className="avatar-background">
              <div className="avatar-mask">
                <img className="user-avatar" src={ this.storeState.user.image } />
              </div>
            </div>
          </div>
          <UserPanelForm
            activeSession={ this.storeState.session }
            activeUser={ this.storeState.user }
            dropdownActive={ this.state.dropdownActive }
            password={ this.state.password }
            passwordFailed={ this.state.passwordFailed }
            handleLoginSubmit={ this.handleLoginSubmit.bind(this) }
            handleDropdownClick={ this.handleDropdownClick.bind(this) }
            handleDropdownLeave={ this.handleDropdownLeave.bind(this) }
            handlePasswordInput={ this.handlePasswordInput.bind(this) }
            setActiveSession={ this.setActiveSession.bind(this) }
          />
          <div className="bottom">
            { switchUserButton }
          </div>
        </div>
        <UserSwitcher
          active={ this.state.switcherActive }
          activeUser={ this.storeState.user }
          setActiveUser={ this.setActiveUser.bind(this) }
        />
      </div>
    );
  }
}

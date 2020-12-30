/** @format */

import './App.scss';

import _, { Component } from 'react';
import APIService from './services/api/api';
import StateService from './services/state/state';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Sidebar, { SidebarEntry } from './components/sidebar/Sidebar';
import Login from './routes/login/Login';
import { Permissions, UserModel } from './services/api/models';
import Links from './routes/links/Links';
import LinkEditor from './routes/link-editor/LinkEditor';

export default class App extends Component {
  private stateService = new StateService();

  state = {
    loggedIn: false,
    redirect: (null as any) as string,
  };

  async componentDidMount() {
    APIService.events.on('authentication-error', () => {
      this.stateService.selfUser = (null as any) as UserModel;
      this.redirect('/login');
    });

    this.stateService.events.on('update', () => this.setState({}));

    if (this.stateService.selfUser === null) {
      try {
        const me = await APIService.getUser('me');
        this.stateService.selfUser = me;
        this.setState({ loggedIn: true });
      } catch {}
    }
  }

  render() {
    return (
      <div className="app-container">
        {this.isLoggedIn && (
          <Sidebar
            entries={this.sidebarEntries}
            onActivate={(r) => this.onSidebarActivate(r)}
          />
        )}
        <div className="app-router-outlet">
          <Router>
            <Route
              exact
              path="/login"
              render={() => <Login state={this.stateService} />}
            />
            <Route exact path="/links" render={() => <Links />} />
            <Route
              exact
              path="/links/:id"
              render={({ match }) => <LinkEditor id={match.params.id} />}
            />

            <Route exact path="/" render={() => <Redirect to="/links" />} />

            {this.state.redirect && <Redirect to={this.state.redirect} />}
          </Router>
        </div>
      </div>
    );
  }

  private async onSidebarActivate(r: string) {
    if (r === 'logout') {
      try {
        await APIService.authLogout();
        this.stateService.selfUser = null as any;
        this.setState({ loggedIn: false });
        r = 'login';
      } catch (err) {
        console.error(err);
        return;
      }
    }
    this.redirect('/' + r);
  }

  private redirect(to: string) {
    this.setState({ redirect: to }, () => this.setState({ redirect: null }));
  }

  private get isLoggedIn(): boolean {
    return !!this.stateService.selfUser || this.state.loggedIn;
  }

  private get sidebarEntries(): SidebarEntry[] {
    const entries: SidebarEntry[] = [
      {
        displayname: 'links',
        route: 'links',
      },
    ];

    if (this.stateService.selfUser?.permissions & Permissions.UPDATE_USERS) {
      entries.push({
        displayname: 'users',
        route: 'users',
      });
    }

    return entries;
  }
}

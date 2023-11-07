import _ from 'lodash';

export namespace Oauth {
  export interface IState {
    redirectUrl?: string;
    token?: string;
  }

  export function parseState(queryState: any) {
    try {
      const state = JSON.parse(queryState);

      if (!_.isObject(state) || _.isArray(state)) {
        return null;
      }

      return state as IState;
    } catch {
      return null;
    }
  }
}

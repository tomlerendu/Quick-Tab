export default {

  getTabs: (onlyCurrentWindow = false) => {
    return new Promise(
      resolve => resolve([
        {
          title: 'Google',
          faviconUrl: '/images/blank.png',
        },
        {
          title: 'Facebook',
          faviconUrl: '/images/blank.png',
        },
        {
          title: 'Twitter',
          faviconUrl: '/images/blank.png',
        },
        {
          title: 'Reddit',
          faviconUrl: '/images/blank.png',
        },
      ]),
    );
  },

  switchToTab: tab => {},

  closeTab: tab => {},

  saveOptions: options => {},

  getOptions: options => {},

}
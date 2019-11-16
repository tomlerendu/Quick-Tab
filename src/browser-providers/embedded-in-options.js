export default {

  getTabs: (onlyCurrentWindow = false) => {
    return new Promise(
      resolve => resolve([
        {
          id: 1,
          title: 'Google',
          faviconUrl: '/images/blank.png',
        },
        {
          id: 2,
          title: 'Facebook',
          faviconUrl: '/images/blank.png',
        },
        {
          id: 3,
          title: 'Twitter',
          faviconUrl: '/images/blank.png',
        },
        {
          id: 4,
          title: 'Reddit',
          faviconUrl: '/images/blank.png',
        },
      ]),
    );
  },

  switchToTab: tab => {},

  closeTab: tab => {},

}
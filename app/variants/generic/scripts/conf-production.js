'use strict';
angular.module('yaMaps')

.constant('version', {
  revision: '',
  flavor: 'develop',
  built: 'Tue Jul 12 2016 12:03:05',
  version: '1.0.1',
  license: 'MIT'
})

.constant('globals', {
  baseUrl: 'https://api-generic.frontend',
  apiVersion: '1',
  apiTimeout: 60000,
  pollingDelay: 30000,
  maxStartTime: 120000,
  localStorageKey: 'yaMaps',
  namePolicy: '^[a-zA-Z0-9_\\-]*$',
  namespacePolicy: '^([a-z][a-z_0-9]*\\.)*[a-z]([a-z_0-9]*)$',
  usernamePolicy: '^[a-z][a-z0-9]{2,39}$',
  passwordPolicy: '(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])',
  debug: true,
  keepMessages: 20,
  customer:{
    title: 'YaMaps',
    longtitle: 'YaMaps - A generic Frontend',
    name: 'generic',
    domain: 'yaMaps.com',
  },
  menuNav: {
    main: ['home', 'contact'],
    // Content for subnav
    home: [],
    contact: [],
  },
  redirectOnLogin: '/'
});

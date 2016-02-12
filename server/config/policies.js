'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([
      {
        roles: ['admin'],
        allows: [
          {
            resources: '/adminFeeds',
            permissions: '*'
          }
        ]
    },
    {
      roles: ['user', 'admin'],
      allows: [
        {
          resources: '/userFeeds',
          permissions: '*'
        }
      ]
    },
    {
      roles: ['guest', 'user', 'admin'],
      allows: [
        {
          resources: [
            '/index',
            '/logout',
            '/auth/facebook',
            '/auth/facebook/callback',
            '/auth/github',
            '/auth/github/callback',
          ],
          permissions: '*'
        }
      ]
    }
  ]);

};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {

  var roles = (req.user) ? req.user.roles : ['guest'];

  console.log('policies called');

  console.log(roles,  req.route.path, req.method.toLowerCase());

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      console.log(err);
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        console.log('user is allowed');
        // Access granted! Invoke next middleware
        return next();
      } else {
        console.error('User is not authorized');
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

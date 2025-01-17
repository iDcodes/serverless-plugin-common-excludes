'use strict';

const semver = require('semver');

module.exports = class CommonExcludes {

  constructor(serverless, options) {
    if (!semver.satisfies(serverless.version, '>= 2.32')) {
      throw new Error('serverless-plugin-common-excludes requires serverless 2.32 or higher!');
    }

    this.serverless = serverless;
    this.options = options;
    this.hooks = {
      'after:deploy:function:initialize': this.addExcludes.bind(this),
      'after:package:initialize': this.addExcludes.bind(this)
    };
  }

  addExcludes() {
    const { service } = this.serverless;

    service.package = service.package || {};
    service.package.patterns = service.package.patterns || [];

    const set = new Set(service.package.patterns);

    [
      // common project files
      '!git/**',
      '!.vs/**',
      '!.idea/**',
      '!src/more/**',
      '!plugins/docpad-plugin-gulp/node_modules/**',
      '!plugins/docpad-plugin-gulp/src/**',
      '!plugins/docpad-plugin-gulp/test/**',
      // yes, these are real
      '!node_modules/**/*.gif',
      '!node_modules/**/*.png',
      '!node_modules/**/*.jpg',
      '!node_modules/**/*.jpeg',
      // AWS SDK unused dist files
      '!node_modules/**/aws-sdk/dist/**',
      '!node_modules/**/aws-sdk/dist-tools/**',
    ].forEach(pattern => {
      if (set.has(pattern)) {
        return;
      }
      service.package.patterns.push(pattern);
    });
  }
};

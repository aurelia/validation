System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-binding": "github:aurelia/binding@0.6.1",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.1",
    "aurelia-templating": "github:aurelia/templating@0.11.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87",
    "github:aurelia/binding@0.6.1": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.1",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.4.0",
      "core-js": "npm:core-js@0.9.7"
    },
    "github:aurelia/dependency-injection@0.7.1": {
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "core-js": "npm:core-js@0.9.7"
    },
    "github:aurelia/loader@0.6.0": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-path": "github:aurelia/path@0.6.1",
      "core-js": "npm:core-js@0.9.7",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.1"
    },
    "github:aurelia/metadata@0.5.0": {
      "core-js": "npm:core-js@0.9.7"
    },
    "github:aurelia/templating@0.11.2": {
      "aurelia-binding": "github:aurelia/binding@0.6.1",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.1",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-loader": "github:aurelia/loader@0.6.0",
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-path": "github:aurelia/path@0.6.1",
      "aurelia-task-queue": "github:aurelia/task-queue@0.4.0",
      "core-js": "npm:core-js@0.9.7"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:core-js@0.9.7": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});


/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 1.7.0 from webgme on Wed Aug 23 2017 17:12:08 GMT-0500 (CDT).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'cloudcamp/webgenerateAnsible',
    'cloudcamp/dbgenerateAnsible'
], function (PluginConfig,
             pluginMetadata,
             PluginBase,
             webAnsible,
             dbAnsible) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of LAMPansible.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin LAMPansible.
     * @constructor
     */
    var LAMPansible = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
        this.pathToNode = {};
    };

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructue etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    LAMPansible.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    LAMPansible.prototype = Object.create(PluginBase.prototype);
    LAMPansible.prototype.constructor = LAMPansible;

    var path = require("path");
    var fs = require("fs");

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    LAMPansible.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            nodeObject;

        nodeObject = self.activeNode;
        this.extractModel();
    };

    LAMPansible.prototype.extractModel = function (callback) {
        var self = this;
        //this.pathToNode={};
        var webModel =
            {
                WebApplicationModel: {
                    AppType: "",
                    AppName: "",
                    host_ip: "",
                    srcPath: "",
                    language: "",
                    WebEngine: "",
                    OS: {
                        name: "",
                        version: ""
                    }
                }
            };

        var dbModel =
            {
                DBApplicationModel: {
                    AppType: "",
                    AppName: "",
                    host_ip: "",
                    srcPath: "",
                    password: "",
                    port: "",
                    replication_count: "",
                    user: "",
                    dbEngine: "",
                    dbnames: "",
                    dbLocation: "",
                    OS: {
                        name: "",
                        version: ""
                    }
                }
            };


        //this.logger.info (this.core.getAttribute(this.activeNode, 'name'));

        // In order to avoid multiple iterative asynchronous 'load' calls we pre-load all the nodes in the state-machine
        // and builds up a local hash-map from their paths to the node.
        return this.core.loadSubTree(self.activeNode)
            .then(function (nodes) {
                // All the nodes or objects
                var j,
                    a,
                    childNode,
                    childName,
                    acq_node,
                    algo,
                    childrenPaths;

                for (var i = 0; i < nodes.length; i += 1) {
                    self.pathToNode[self.core.getPath(nodes[i])] = nodes[i];
                }

                var dbdependendency = false;
                var webdependent = false;
                childrenPaths = self.core.getChildrenPaths(self.activeNode);
                // console.log(childrenPaths.length);
                for (i = 0; i < childrenPaths.length; i += 1) {

                    childNode = self.pathToNode[childrenPaths[i]];
                    if (self.isMetaTypeOf(childNode, self.META['ConnectsTo']) === true) {
                        childName = self.core.getAttribute(childNode, 'name');
                        self.logger.info('At childNode', childName);
                        var src_Path = self.core.getPointerPath(childNode, 'src');
                        var dst_Path = self.core.getPointerPath(childNode, 'dst');
                        //var srcNode, dstNode;

                        // self.logger.info(src_Path);
                        // self.logger.info(dst_Path);
                        if (src_Path && dst_Path) {
                            var srcNode = self.pathToNode[src_Path];
                            var dstNode = self.pathToNode[dst_Path];
                            self.logger.info(self.core.getAttribute(childNode, 'name'));
                            self.logger.info('connects');
                            self.logger.info(self.core.getAttribute(srcNode, 'name'));
                            self.logger.info('-->');
                            self.logger.info(self.core.getAttribute(dstNode, 'name'));
                        }
                        if (self.isMetaTypeOf(srcNode, self.META['WebApplication']) === true && self.isMetaTypeOf(dstNode, self.META['DBApplication']) === true){
                            self.logger.error("DB");
                            dbdependendency = true;
                            webdependent = true;

                        }
                    }

                    if (self.isMetaTypeOf(childNode, self.META['HostedOn']) === true) {
                        childName = self.core.getAttribute(childNode, 'name');
                        self.logger.info('At childNode', childName);
                        var src_Path = self.core.getPointerPath(childNode, 'src');
                        var dst_Path = self.core.getPointerPath(childNode, 'dst');
                        //var srcNode, dstNode;

                        // self.logger.info(src_Path);
                        // self.logger.info(dst_Path);
                        if (src_Path && dst_Path) {
                            var srcNode = self.pathToNode[src_Path];
                            var dstNode = self.pathToNode[dst_Path];
                            self.logger.info(self.core.getAttribute(childNode, 'name'));
                            self.logger.info('connects');
                            self.logger.info(self.core.getAttribute(srcNode, 'name'));
                            self.logger.info('-->');
                            self.logger.info(self.core.getAttribute(dstNode, 'name'));
                        }


                        var src_node = self.core.getAttribute(srcNode, 'name');
                        // self.logger.info('At srcNode', src_node);
                        var dst_node = self.core.getAttribute(dstNode, 'name');
                        // self.logger.info('At dstNode', dst_node);
                        if (self.isMetaTypeOf(srcNode, self.META['WebApplication']) === true && self.isMetaTypeOf(dstNode, self.META['Hardware']) === true) {
                            webModel.WebApplicationModel.AppType = 'WebApplication';
                            var language = self.core.getAttribute(srcNode, 'language');
                            webModel.WebApplicationModel.language = language;
                            self.logger.info(language);
                            var appName = self.core.getAttribute(srcNode, 'name');
                            webModel.WebApplicationModel.AppName = appName;
                            self.logger.info(appName);
                            var srcPath = self.core.getAttribute(srcNode, 'src');
                            webModel.WebApplicationModel.srcPath = srcPath;
                            self.logger.info(srcPath);
                            var host_ip = self.core.getAttribute(dstNode, 'host_ip');
                            webModel.WebApplicationModel.host_ip = host_ip;
                            self.logger.info(host_ip);

                            var acq_path = self.core.getChildrenPaths(srcNode);
                            for (j = 0; j < acq_path.length; j += 1) {
                                acq_node = self.pathToNode[acq_path[j]];
                                var webEngine = self.core.getAttribute(acq_node, 'name');
                                webModel.WebApplicationModel.WebEngine = webEngine;
                                self.logger.info(webEngine);

                            }
                            var acq_path = self.core.getChildrenPaths(dstNode);
                            for (j = 0; j < acq_path.length; j += 1) {
                                acq_node = self.pathToNode[acq_path[j]];
                                var os_name = self.core.getAttribute(acq_node, 'name');
                                webModel.WebApplicationModel.OS.name = os_name;
                                self.logger.info(os_name);
                                var os_version = self.core.getAttribute(acq_node, 'version');
                                webModel.WebApplicationModel.OS.version = os_version;
                                self.logger.info(os_version);
                            }


                            if (dbdependendency === false) {
                                self.logger.error(" Run webAnsible..");
                                webAnsible.webgenerateAnsible(JSON.stringify(webModel, null, 4));
                            }
                        }
                        if (self.isMetaTypeOf(srcNode, self.META['DBApplication']) === true && self.isMetaTypeOf(dstNode, self.META['Hardware']) === true) {
                            dbModel.DBApplicationModel.AppType = 'DBApplication';

                            var user = self.core.getAttribute(srcNode, 'user');
                            dbModel.DBApplicationModel.user = user;
                            self.logger.info(user);
                            var password = self.core.getAttribute(srcNode, 'password');
                            dbModel.DBApplicationModel.password = password;
                            self.logger.info(password);
                            var appName = self.core.getAttribute(srcNode, 'name');
                            dbModel.DBApplicationModel.AppName = appName;
                            self.logger.info(appName);
                            var srcPath = self.core.getAttribute(srcNode, 'src');
                            dbModel.DBApplicationModel.srcPath = srcPath;
                            self.logger.info(srcPath);
                            var port = self.core.getAttribute(srcNode, 'port');
                            dbModel.DBApplicationModel.port = port;
                            self.logger.info(port);
                            var host_ip = self.core.getAttribute(dstNode, 'host_ip');
                            dbModel.DBApplicationModel.host_ip = host_ip;
                            self.logger.info(host_ip);
                            var dbnames = self.core.getAttribute(srcNode, 'dbnames');
                            dbModel.DBApplicationModel.dbnames = dbnames;
                            // self.logger.info(dbnames);
                            var dbLocation = self.core.getAttribute(srcNode, 'dbLocation');
                            dbModel.DBApplicationModel.dbLocation = dbLocation;

                            var acq_path = self.core.getChildrenPaths(srcNode);
                            for (j = 0; j < acq_path.length; j += 1) {
                                acq_node = self.pathToNode[acq_path[j]];
                                var dbEngine = self.core.getAttribute(acq_node, 'name');
                                dbModel.DBApplicationModel.dbEngine = dbEngine;
                                self.logger.info(dbEngine);

                            }
                            var acq_path = self.core.getChildrenPaths(dstNode);
                            for (j = 0; j < acq_path.length; j += 1) {
                                acq_node = self.pathToNode[acq_path[j]];
                                var os_name = self.core.getAttribute(acq_node, 'name');
                                dbModel.DBApplicationModel.OS.name = os_name;
                                self.logger.info(os_name);
                                var os_version = self.core.getAttribute(acq_node, 'version');
                                dbModel.DBApplicationModel.OS.version = os_version;
                                self.logger.info(os_version);
                            }

                            dbAnsible.dbgenerateAnsible(JSON.stringify(dbModel, null, 4));
                            if (webdependent === true) {
                                self.logger.error(" Calling webAnsible..");
                                webAnsible.webgenerateAnsible(JSON.stringify(webModel, null, 4));
                            }

                        }

                        // Log the name of the child (it's an attribute so we use getAttribute).
                        // childName = self.core.getAttribute(childNode, 'name');
                        // self.logger.info('At childNode', childName);
                    }
                }

                return webModel;
            })
            .nodeify(callback);
    };
    return LAMPansible;
});

webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

var v1='<form name=entityWizardForm novalidate><wizard hide-indicators=wizard.hide edit-mode=wizard.editMode indicators-position=top on-finish=finishedWizard()><div class=wizard-content><ng-form class=form-horizontal name=stepForm ng-controller=CustomStepDeviceAdminController><wz-step wz-title={{step.custom.title}} canexit=exitValidation wz-disabled={{step.custom.disabled}}><div ng-include src=step.custom.body></div></wz-step></ng-form><ng-form class=form-horizontal name=stepForm ng-controller=StepTwoController><wz-step wz-title={{step.admin.title}} canexit=exitValidation wz-disabled={{step.admin.disabled}}><div ng-include src=step.admin.body></div></wz-step></ng-form></div></wizard></form>';
angular.module('adf.widget.customEntityWizard').run(['$templateCache', function ($templateCache) {$templateCache.put('src/entity/views/entitywizard.client.view.html', v1);}]);
module.exports=v1

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('adf.widget.customEntityWizard', ['adf.provider']);

__webpack_require__(2);
__webpack_require__(3);

__webpack_require__(4);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var v1=' <button ng-if=!isEditMode() type=submit class="btn btn-danger ux-txt-danger reset" ng-click=clearProgressLog() ng-disabled=!!wizard.disable>Clear Log</button> <button ng-if=!isEditMode() type=submit class="btn btn-danger ux-txt-danger reset" ng-click=reset() ng-disabled=!!wizard.disable>Reset Values</button> <button ng-if=!isEditMode() type=submit class="btn btn-primary ux-txt-success execute" ng-click=execute() ng-disabled="stepForm.$invalid || isInvalid() || !!wizard.disable">Create</button> <button ng-if=!isEditMode() type=submit class="btn btn-primary ux-txt-success execute" ng-click=update() ng-disabled="stepForm.$invalid || isInvalid() || !!wizard.disable">Update</button>';
angular.module('adf.widget.customEntityWizard').run(['$templateCache', function ($templateCache) {$templateCache.put('src/wizard.footer.client.view.html', v1);}]);
module.exports=v1

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var v1='<div class=form-group ng-show=progressInfo.show><h6 ng-if="progressInfo.actions.length > 0"><strong>{{progressInfo.title}}</strong></h6><div><ul><li><span class=text-primary>Entire process</span><uib-progressbar class="{{(progressInfo.value === progressInfo.max) ? \'\' : \'progress-striped active\'}}" max=progressInfo.max value=progressInfo.value type="{{ progressInfo.type }}"><i>{{ progressInfo.value }} / {{ progressInfo.max }}</i></uib-progressbar></li><li ng-repeat="partialTmp in partialInfo track by $index"><span class=text-primary>{{ partialTmp.name }}</span><uib-progressbar class="{{(partialTmp.value === partialTmp.max) ? \'\' : \'progress-striped active\'}}" max=partialTmp.max value=partialTmp.value type={{partialTmp.type}}><i>{{ partialTmp.value }} / {{ partialTmp.max }}</i></uib-progressbar></li></ul></div><ul ng-if="progressInfo.actions.length > 0"><li ng-repeat="entry in progressInfo.actions" class=text-{{entry.type}}><strong>{{ entry.msg }}</strong></li></ul></div>';
angular.module('adf.widget.customEntityWizard').run(['$templateCache', function ($templateCache) {$templateCache.put('src/wizard.log.client.view.html', v1);}]);
module.exports=v1

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('adf.widget.customEntityWizard')
    .config(function(dashboardProvider) {
        dashboardProvider
            .widget('customEntityWizard', {
                title: 'Custom Entity wizard',
                description: 'This widget will register a collection of wizards which it will be used by any registered user',
                template: __webpack_require__(0),
                controller: 'CustomEntityCustomWizardController',
                category: 'Wizards',
                edit: {
                    template: __webpack_require__(0),
                    controller: 'CustomEntityWizardEditController'
                },
                show_modal_footer: false,
                show_reload_config: false
            });
    }).run(function($doActions, $q, $api, jsonPath) {
        $doActions.listener('customEntityWizard', function(device) {
            return (new ParserConfig(device)).parse();
        });

        function ParserConfig(_data) {
            var deviceData = _data;
            var config = {
                admin: {},
                organization: {},
                channel: {},
                administrativeState: {},
                operationalStatus: {},
                inventory: {},
                location: {},
                commsModuleType: {},
                security: {},
                certificate: {},
                communicationsInterfaces: []
            }
            this.parse = function() {
                if (typeof deviceData !== 'object')
                    return undefined;
                var promises = [];
                // STEP ADMIN
                config.admin = {
                    id: deviceData.id,
                    defaultFeed: deviceData.provision.defaultFeed
                };
                config.organization = { selected: { name: deviceData.provision.admin.organization } };
                config.channel = { selected: { name: deviceData.provision.admin.channel } };

                if (deviceData.provision.operationalStatus && deviceData.provision.operationalStatus.length > 0) {
                    config.operationalStatus = { selected: deviceData.provision.operationalStatus[0] };
                } else {
                    config.operationalStatus.selected = '';
                }

                if (deviceData.provision.admin.administrativeState) {
                    config.administrativeState = { selected: { id: deviceData.provision.admin.administrativeState } };
                } else {
                    config.administrativeState.selected = '';
                }
                // -------------------------
                // STEP INVENTORY
                if (deviceData.provision.name && deviceData.provision.name.length > 0) {
                    config.inventory.name = deviceData.provision.name[0];
                }

                if (deviceData.provision.description && deviceData.provision.description.length > 0) {
                    config.inventory.description = deviceData.provision.description[0];
                }

                if (deviceData.provision.serialNumber && deviceData.provision.serialNumber.length > 0) {
                    config.inventory.serialNumber = deviceData.provision.serialNumber[0];
                }
                // -------------------------
                // STEP LOCATION
                if (deviceData.provision.location && deviceData.provision.location.length > 0) {
                    if (deviceData.provision.location[0].coordinates) {
                        if (deviceData.provision.location[0].coordinates.latitude) {
                            config.location.latitude = deviceData.provision.location[0].coordinates.latitude;
                        }
                        if (deviceData.provision.location[0].coordinates.longitude) {
                            config.location.longitude = deviceData.provision.location[0].coordinates.longitude;
                        }

                        if (config.location.latitude && config.location.longitude) {
                            config.location.map = {
                                markers: {
                                    marker: {
                                        lat: config.location.latitude,
                                        lng: config.location.longitude,
                                        draggable: true,
                                        focus: true,
                                        message: 'Drag me to move. Click me to remove'
                                    }
                                }
                            };
                        }
                        if (deviceData.provision.location[0].postal) {
                            config.location.postal = deviceData.provision.location[0].postal;
                        }
                    }
                }

                // -------------------------
                // STEP SECURITY
                if (deviceData.provision && deviceData.provision.certificates && deviceData.provision.certificates.length > 0) {
                    promises.push($api().certificatesSearchBuilder().assignable().filter({ and: [{ in: { certificateId: deviceData.provision.certificates } }] })
                        .build().execute().then(function(response) {
                            if (response.statusCode === 200) {
                                config.certificate.selected = response.data.certificates;
                            }
                            return config;
                        }));
                }
                // -------------------------
                // STEP RELATED
                if (deviceData.provision.$related && deviceData.provision.$related.communicationsModules) {
                    promises.push(deviceData.provision.$related.communicationsModules()
                        .then(function(response) {
                            if (response.statusCode === 200) {
                                var commsData = response.data.communicationsModules;
                                angular.forEach(commsData, function(curComm) {
                                    var specificType = jsonPath(curComm, 'provision.specificType[0]');
                                    if (specificType && specificType.length > 0) {
                                        specificType = specificType[0];
                                    } else {
                                        specificType = 'GENERIC';
                                    }

                                    if (curComm.provision.relations && curComm.provision.relations.length > 0) {
                                        angular.forEach(curComm.provision.relations, function(curRelation) {
                                            var finalData = {};

                                            finalData[specificType] = {
                                                'COMMUNICATIONS_MODULE': [{
                                                    parameter: 'entityKey',
                                                    value: curComm.id
                                                }]
                                            };

                                            angular.forEach(curRelation.relation, function(curRelationData) {
                                                if (curRelationData.entityType !== 'DEVICE') {
                                                    finalData[specificType][curRelationData.entityType] = [{
                                                        parameter: 'entityKey',
                                                        value: curRelationData.id
                                                    }];
                                                }
                                            });

                                            config.communicationsInterfaces.push(finalData);
                                        });
                                    } else {
                                        var commData = {};
                                        commData[specificType] = {
                                            'COMMUNICATIONS_MODULE': [{
                                                parameter: 'entityKey',
                                                value: curComm.id
                                            }]
                                        };
                                        config.communicationsInterfaces.push(commData);
                                    }
                                });
                            }
                            return config;
                        }));
                }

                if (promises.length === 0)
                    return { entity: config };

                return $q.all(promises)
                    .then(function(config) {
                        return { entity: config[0] };
                    });
            }
        }
    });

__webpack_require__(5);

__webpack_require__(6);
__webpack_require__(7);

__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wizard = angular.module('adf.widget.customEntityWizard');

_wizard.factory('customEntityService', ['$api', '$rootScope', 'codeErrorsFilter', function($api, $rootScope, codeErrorsFilter) {
    var entity = { type: 'GATEWAY' };
    var _entity = {};
    var entityBuilder = {};
    var relations = [];

    function PromiseManager() {
        if (this.constructor.name !== 'PromiseManager') {
            throw new Error('PromiseManager must be a object. Must be create a new instance like "new PromiseManager()"');
        }
        var error;
        var pending = [];
        var finished = [];
        var stateManager = false;
        var successfulResponses = [];
        var _this = this;
        this.startCreateProcess = function(_then, _catch) {
            if (stateManager) {
                console.warn('PromiseManager is already started.');
                return;
            }
            if (pending.length === 0) {
                throw new Error('Must append at least one promise.');
            }
            this._then = _then;
            this._catch = _catch;
            stateManager = !stateManager;
            _start();
        };
        this.add = function(builder) {
            if (stateManager) {
                console.warn('PromiseManager is already started. Cannot add more promises.');
                return;
            }
            pending.push(builder);
        };

        function _start() {
            if (pending.length === 0) {
                console.log('All created successfully.');
                _this._then(successfulResponses);
                return;
            }
            console.log('Start to execute next promise.');
            var pInProgress = pending.shift();
            pInProgress.create().then(function(response) {
                console.log('Entity created.');
                console.log(response);
                finished.push(pInProgress);
                successfulResponses.push(response[0]);
                _start();
            }).catch(function(err) {
                console.error('Error creating entity.');
                console.error(err);
                console.log('Start to remove entities created.');
                error = err;
                _delete();
            });
        }

        function _delete() {
            if (finished.length === 0) {
                console.log('All removed.');
                _this._catch(error);
                return;
            }
            console.log('Remove next entity.');
            finished.pop().delete().then(function(message) {
                console.log('Entity removed.');
                console.log(message);
                _delete();
            }).catch(function(err) {
                console.error('Error removing entity.');
                console.error(err);
            });
        }
    }

    function RelationFactory(promiseManager) {
        if (this.constructor.name !== 'RelationFactory') {
            throw new Error('RelationFactory must be a object. Must be create a new instance like "new RelationFactory()"');
        }
        if (promiseManager.constructor.name !== 'PromiseManager') {
            throw new Error('Parameter promiseManager must be instance of PromiseManager');
        }
        var builderHelperFactory = {
            'SUBSCRIBER': function(entity) {
                var methods = {
                    'entityKey': function(builder, value) {
                        builder.withEntityKey(value);
                    },
                    'administrativeState': function(builder, value) {
                        builder.withAdministrativeState(value);
                    },
                    'ICC': function(builder, value) {
                        builder.withIcc(value);
                    }
                };
                return this.createBuilder(entity, methods, $api().subscribersBuilder());
            },
            'SUBSCRIPTION': function(entity) {
                var methods = {
                    'entityKey': function(builder, value) {
                        builder.withEntityKey(value);
                    },
                    'administrativeState': function(builder, value) {
                        builder.withAdministrativeState(value);
                    },
                    'IMSI': function(builder, value) {
                        builder.withImsi(value);
                    },
                    'ADDRESS': function(builder, value) {
                        builder.withIpAddress(value);
                    },
                    'HOME_OPERATOR': function(builder, value) {
                        builder.withHomeOperator(value);
                    },
                    'REGISTER_OPERATOR': function(builder, value) {
                        builder.withRegisteredOperator(value);
                    },
                    'MSISDN': function(builder, value) {
                        builder.withMsisdn(value);
                    },
                    'LOCATION': function(builder, value) {
                        throw new Error('subscriptionBuilder setter location, not implemented.'); //builder.withLocation(value); 
                    }
                };
                return this.createBuilder(entity, methods, $api().subscriptionsBuilder());
            },
            'COMMUNICATIONS_MODULE': function(entity) {
                var methods = {
                    'entityKey': function(builder, value) {
                        builder.withEntityKey(value);
                    },
                    'administrativeState': function(builder, value) {
                        builder.withAdministrativeState(value);
                    },
                    'IMEI': function(builder, value) {
                        builder.withImei(value);
                    },
                    'MAC': function(builder, value) {
                        builder.withMac(value);
                    },
                    'HARDWARE': function(builder, value) {
                        builder.withHardware(value.id);
                    },
                    'SOFTWARE': function(builder, value) {
                        builder.withSoftware(value.id);
                    }
                };
                return this.createBuilder(entity, methods, $api().communicationsModulesBuilder());
            },
            createBuilder: function(entity, methods, builder) {
                entity.forEach(function(item) {
                    if (typeof item.value !== 'undefined' && item.value !== null) {
                        methods[item.parameter](builder, item.value);
                    }
                });
                return builder;
            }
        };
        var relationHelper = {
            'SUBSCRIBER': 'withSubscriber',
            'SUBSCRIPTION': 'withSubscription',
            'COMMUNICATIONS_MODULE': 'withCommunicationsModule'
        };

        this.createRelations = function(deviceBuilder, relations) {
            relations.forEach(function(relation) {
                var relationBuilder = $api().relationsBuilder()
                    .withOrganization(deviceBuilder._organization)
                    .withDevice(deviceBuilder._entityKey);
                for (var specificType in relation) {
                    for (var entityType in relation[specificType]) {
                        var entity = relation[specificType][entityType];
                        var builder = builderHelperFactory[entityType](entity);
                        builder.withSpecificType(specificType)
                            .withOrganization(deviceBuilder._organization)
                            .withChannel(deviceBuilder._channel)
                            //.withAdministrativeState('ACTIVE')
                            .withEntityKey(builder._entityKey || (deviceBuilder._entityKey + '_' + Math.trunc(Math.random() * 1e4) + '_' + entityType));
                        relationBuilder[relationHelper[entityType]](builder._entityKey);
                        promiseManager.add(builder);
                    }

                    if (specificType.toUpperCase() === 'sigfox') {
                        relationBuilder.withTemplate('sigfox');
                    }
                }
                promiseManager.add(relationBuilder);
            });
        };

        this.removeRelation = function(deviceBuilder, relation) {
            var relationBuilder = $api().relationsBuilder()
                .withOrganization(deviceBuilder._organization)
                .withDevice(deviceBuilder._entityKey);
            for (var specificType in relation) {
                for (var entityType in relation[specificType]) {
                    for (var entityParam in relation[specificType][entityType]) {
                        if (relation[specificType][entityType][entityParam].parameter === 'entityKey') {
                            relationBuilder[relationHelper[entityType]](relation[specificType][entityType][entityParam].value);
                        }
                    }
                }
            }

            return relationBuilder.delete();
        };
    }

    var resetEntityBuilder = function() {
        entityBuilder = {};
        _entity = {};
        relations = [];
    };

    var newEntityBuilder = function() {
        return (entityBuilder = $api().devicesBuilder().withType(entity.type.toLowerCase())); //.withAdministrativeState('ACTIVE'));
    };

    var getEntityBuilder = function() {
        return entityBuilder;
    };

    var updateEntityBuilder = function(_entity) {
        entityBuilder = _entity;
    };

    var execute = function() {
        var promiseManager = new PromiseManager();
        var relationFactory = new RelationFactory(promiseManager);
        try {
            promiseManager.add(entityBuilder);
            relationFactory.createRelations(entityBuilder, relations);
            promiseManager.startCreateProcess(function(response) {
                var json = JSON.stringify(response[0]);
                //$rootScope.$broadcast('finishCreateEntityWithoutError', json);
                //$rootScope.$broadcast('finishCreateEntity', json);
                $rootScope.$broadcast('entityManagementFinished', { isOk: true, data: json });
                resetEntityBuilder();
            }, function(response) {
                var errors;
                if (typeof response.message === 'string') {
                    errors = response;
                } else {
                    errors = response.errors || response.data.errors;
                }
                var filterErrors = [];
                errors = errors.errors || errors;
                errors = errors.message || errors;
                if (angular.isArray(errors)) {
                    angular.forEach(errors, function(value, key) {
                        filterErrors.push(codeErrorsFilter(value));
                    });
                } else {
                    filterErrors.push(errors);
                }
                $rootScope.$broadcast('entityManagementFinished', { isOk: false, data: JSON.stringify(filterErrors) });
            });
        } catch (err) {
            console.error(err);
            $rootScope.$broadcast('entityManagementFinished', { isOk: false, data: JSON.stringify(err) });
            return false;
        }
    };

    var update = function() {
        try {
            entityBuilder.update().then(function(response) {
                var json = JSON.stringify(response[0]);
                $rootScope.$broadcast('entityManagementFinished', { isOk: true, data: json });
            }, function(response) {
                var errors;
                if (typeof response.message === 'string') {
                    errors = response;
                } else {
                    errors = response.errors || response.data.errors;
                }
                var filterErrors = [];
                errors = errors.errors || errors;
                errors = errors.message || errors;
                if (angular.isArray(errors)) {
                    angular.forEach(errors, function(value, key) {
                        filterErrors.push(codeErrorsFilter(value));
                    });
                } else {
                    filterErrors.push(errors);
                }
                $rootScope.$broadcast('entityManagementFinished', { isOk: false, data: JSON.stringify(filterErrors) });
            });
        } catch (err) {
            console.error(err);
            $rootScope.$broadcast('entityManagementFinished', { isOk: false, data: JSON.stringify(err) });
            return false;
        }
    };

    var updateEntity = function(object) {
        angular.forEach(object, function(value, key) {
            if (value)
                _entity[key] = value;
            else if (_entity[key]) {
                delete _entity[key];
            }
        });
    };

    var addRelations = function(_relations) {
        relations = _relations;
    };

    var addRelation = function(_relation, _then, _catch) {
        relations = [_relation];
        var promiseManager = new PromiseManager();
        var relationFactory = new RelationFactory(promiseManager);
        try {
            //promiseManager.add(entityBuilder);
            relationFactory.createRelations(entityBuilder, relations);
            promiseManager.startCreateProcess(_then, function(response) {
                var errors;
                if (typeof response.message === 'string') {
                    errors = response;
                } else if (response.errors) {
                    errors = response.errors;
                } else if (response.data && response.data.errors) {
                    errors = response.data.errors;
                } else {
                    errors = response.statusCode;
                }
                var filterErrors = [];
                errors = errors.errors || errors;
                errors = errors.message || errors;
                if (angular.isArray(errors)) {
                    angular.forEach(errors, function(value, key) {
                        filterErrors.push(codeErrorsFilter(value));
                    });
                } else {
                    filterErrors.push(errors);
                }

                _catch(JSON.stringify(filterErrors));
            });
        } catch (err) {
            console.error(err);
            _catch(err);
        }
    };

    var removeRelation = function(_relation, _then, _catch) {
        var relationFactory = new RelationFactory(new PromiseManager());
        try {
            //promiseManager.add(entityBuilder);
            relationFactory.removeRelation(entityBuilder, _relation).then(_then)
                .catch(function(response) {
                    var errors;
                    if (typeof response.message === 'string') {
                        errors = response;
                    } else {
                        errors = response.errors || response.data.errors;
                    }
                    var filterErrors = [];
                    errors = errors.errors || errors;
                    errors = errors.message || errors;
                    if (angular.isArray(errors)) {
                        angular.forEach(errors, function(value, key) {
                            filterErrors.push(codeErrorsFilter(value));
                        });
                    } else {
                        filterErrors.push(errors);
                    }

                    _catch(JSON.stringify(filterErrors));
                });
        } catch (err) {
            console.error(err);
            _catch(err);
        }
    };

    var createAndValidateBuilder = function() {
        var builder = newEntityBuilder();
        angular.forEach(_entity, function(value, key) {
            if (value !== undefined) {
                var method = builder['with' + key];
                if (method.length > 1) {
                    builder['with' + key].apply(builder, value);
                } else {
                    builder['with' + key](value);
                }
            }
        });
        updateEntityBuilder(builder);
    };


    var loadCollection = function(builder, obj, collection, id) {
        builder.limit(1000).build().execute().then(
            function(data) {
                if (data.statusCode === 200) {
                    obj.selected = null;
                    var datas = data.data[id];
                    if (angular.isArray(datas)) {
                        angular.forEach(datas, function(data, key) {
                            collection.push(data);
                        });
                    } else {
                        angular.copy(datas, collection);
                    }
                    return;
                }
                obj.selected = { name: 'Loading error' };
            }
        );
    };

    return {
        newEntityBuilder: newEntityBuilder,
        resetEntityBuilder: resetEntityBuilder,
        getEntityBuilder: getEntityBuilder,
        updateEntityBuilder: updateEntityBuilder,
        updateEntity: updateEntity,
        createAndValidateBuilder: createAndValidateBuilder,
        execute: execute,
        update: update,
        loadCollection: loadCollection,
        addRelations: addRelations,
        addRelation: addRelation,
        removeRelation: removeRelation,
        entity: entity
    };
}]);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var v1='<h4 class=modal-title>{{ step.admin.name }} <i class="glyphicon glyphicon-info-sign popover-markdown" uib-popover-template="\'info-admin\'" popover-trigger="\'outsideClick\'" popover-placement=bottom popover-class="popover-markdown large"></i></h4><span class=text-info>{{ step.admin.description }}</span><fieldset><div class=col-xs-12><div class=form-group><label for=identifier>Unique identifier of entity</label><input name=identifier type=text name=identifier class=form-control ng-model=entity.admin.id ng-required=!isEditMode() ng-disabled=show_update> <span class=help-inline ng-show="stepForm.$invalid && stepForm.identifier.$error.required">Identifier is required</span></div></div><div class="col-xs-12 col-md-6"><div class=form-group><label for=organization>Organization</label><ui-select name=organization ng-if=!show_update tagging=tagTransform ng-model=entity.organization.selected theme=bootstrap allow-clear=true title="Choose an organization" ng-required=!isEditMode() on-select=changeChannels($item) on-remove=removeChannels($item)><ui-select-match placeholder="Choose an organization" allow-clear=true>{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="organization in organizations | filter: $select.search"><span ng-bind-html="organization.name | highlight: $select.search"></span></ui-select-choices></ui-select><span class=help-inline ng-show="stepForm.$invalid && stepForm.organization.$error.required">Organization is required</span> <input name=organization type=text class=form-control ng-model=entity.organization.selected.name ng-required=!isEditMode() ng-if=show_update ng-disabled=true></div></div><div class="col-xs-12 col-md-6"><div class=form-group><label for=channel>Channel</label><ui-select name=channel ng-if=!show_update tagging=tagTransform ng-model=entity.channel.selected theme=bootstrap allow-clear=true ng-required=!isEditMode() title="Choose a channel"><ui-select-match placeholder="Choose a channel" allow-clear=true>{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="channel in channels | filter: $select.search"><span ng-bind-html="channel.name | highlight: $select.search"></span></ui-select-choices></ui-select><span class=help-inline ng-show="stepForm.$invalid && stepForm.channel.$error.required">Channel is required</span> <input name=channel type=text class=form-control ng-model=entity.channel.selected.name ng-required=!isEditMode() ng-if=show_update ng-disabled=true></div></div><div class=col-xs-12 ng-class="mapViewEnabled? \'col-md-6\': \'col-md-12\'"><div class=form-group><label for=postal>Postal Code (optional)</label><input name=postal type=text class=form-control ng-model=entity.location.postal></div><div class=form-group ng-click="mapViewEnabled = true"><label for=latitude>Latitude (optional)</label><input name=latitude type=number class=form-control ng-model=entity.location.latitude ng-change=locationChanged() ng-click=locationChanged() ng-keypress=locationChanged() min=-90 max=90 step=0.01 placeholder="Click here to show map" ng-required=!!entity.location.longitude></div><div class=form-group ng-click="mapViewEnabled = true"><label for=longitude>Longitude (optional)</label><input name=longitude type=number class=form-control ng-model=entity.location.longitude ng-change=locationChanged() ng-click=locationChanged() ng-keypress=locationChanged() min=-180 max=180 step=0.01 placeholder="Click here to show map" ng-required=!!entity.location.latitude></div><a class="btn btn-default ux-txt-success pointer" ng-href="" ng-click="mapViewEnabled = !mapViewEnabled"><i class="fa fa-map-marker" aria-hidden="true "></i> Toggle map</a></div><div class="col-xs-12 col-md-6" ng-if="mapViewEnabled "><div class="form-group leaflet-container"><leaflet id="map-marker " lf-center=entity.location.map.center event-broadcast=entity.location.map.events markers=entity.location.map.markers width="100% " height=300px></leaflet></div></div><wizard-log class=col-xs-12 bar=progressLog></wizard-log></fieldset><div ng-include="\'src/wizard.footer.client.view.html\'"></div><script type=text/ng-template id=info-admin><div btf-markdown ng-include="\'doc/wizard/entity/admin-info.md\'"></div></script>';
angular.module('adf.widget.customEntityWizard').run(['$templateCache', function ($templateCache) {$templateCache.put('src/entity/views/custom.step.client.view.html', v1);}]);
module.exports=v1

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var v1='<h4 class=modal-title>{{ step.admin.name }} <i class="glyphicon glyphicon-info-sign popover-markdown" uib-popover-template="\'info-admin\'" popover-trigger="\'outsideClick\'" popover-placement=bottom popover-class="popover-markdown large"></i></h4><span class=text-info>{{ step.admin.description }}</span><fieldset><div class=col-xs-12><div class=form-group><label for=administrativeState>Administrative State</label><ui-select name=administrativeState tagging=tagTransform ng-model=entity.administrativeState.selected theme=bootstrap allow-clear=true title="Choose an administrative state (optional)"><ui-select-match placeholder="Choose an administrative state (optional)" allow-clear=true>{{$select.selected.id}}</ui-select-match><ui-select-choices repeat="administrativeState in administrativeStateCollection | filter: $select.search"><div><span ng-bind-html="administrativeState.id | highlight: $select.search"></span></div><div>-<span ng-bind-html="administrativeState.description | highlight: $select.search"></span></div></ui-select-choices></ui-select></div></div><div class=col-xs-12><div class=form-group ng-if=show_operational_status><label for=operationalStatus>Operational Status</label><ui-select name=operationalStatus tagging=tagTransform ng-model=entity.operationalStatus.selected theme=bootstrap allow-clear=true title="Choose an operational status (optional)"><ui-select-match placeholder="Choose an operational status (optional)" allow-clear=true>{{$select.selected | humanize}}</ui-select-match><ui-select-choices repeat="operationalStatus in optStatusCollection | filter: $select.search">{{operationalStatus | humanize}}</ui-select-choices></ui-select></div></div><wizard-log class=col-xs-12 bar=progressLog></wizard-log></fieldset><div ng-include="\'src/wizard.footer.client.view.html\'"></div><script type=text/ng-template id=info-admin><div btf-markdown ng-include="\'doc/wizard/entity/admin-info.md\'"></div></script>';
angular.module('adf.widget.customEntityWizard').run(['$templateCache', function ($templateCache) {$templateCache.put('src/entity/views/custom.step.admin.client.view.html', v1);}]);
module.exports=v1

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wizard = angular.module('adf.widget.customEntityWizard');

_wizard.controller('CustomEntityCustomWizardController', ['$rootScope', '$scope', 'catalogs', 'WizardHandler', '$controller', 'customEntityService', 'toastr', '$api', '$templateCache',
    function($rootScope, $scope, catalogs, WizardHandler, $controller, customEntityService, toastr, $api, $templateCache) {
        var baseConfig = {
            admin: {},
            organization: {},
            channel: {},
            administrativeState: {},
            operationalStatus: {},
            inventory: {},
            location: {},
            commsModuleType: {},
            security: {},
            certificate: {},
            communicationsInterfaces: []
        };

        $scope.wizard = {
            disable: false,
            close: false,
            hide: false,
            editMode: false
        };

        $scope.entity = {};
        $scope.step = {
            'custom': {
                title: 'custom',
                name: 'Management data',
                description: 'This step contains the essential data for the registration and identification of the device in the platform.',
                body: 'src/entity/views/custom.step.client.view.html'
            },
            'admin': {
                title: 'admin 2',
                name: 'Management data 2',
                description: 'This step contains the essential data for the registration and identification of the device in the platform.',
                body: 'src/entity/views/custom.step.admin.client.view.html'
            }
        };

        $scope.progressLog = {
            title: 'Entity process log...',
            max: 75,
            value: 0,
            type: 'info',
            show: false,
            actions: []
        };

        $scope.clearProgressLog = function() {
            $scope.progressLog.show = false;
            $scope.progressLog.value = 0;
            $scope.progressLog.type = 'info';
            $scope.progressLog.actions.splice(0, $scope.progressLog.actions.length);
        };

        $scope.changeProgressLog = function(_value, _type, _action) {
            $scope.progressLog.show = true;
            $scope.progressLog.value = _value;
            $scope.progressLog.type = _type;
            $scope.progressLog.actions.push(_action);
        };

        $scope.reset = function() {
            angular.copy($scope.config.entity || {
                admin: {},
                organization: {},
                channel: {},
                administrativeState: {},
                operationalStatus: {},
                inventory: {},
                location: {},
                commsModuleType: {},
                security: {},
                certificate: {},
                communicationsInterfaces: []
            }, $scope.entity);
        }

        $scope.executeCreate = function() {
            $scope.clearProgressLog();
            $scope.disableWizard(true);
            $scope.changeProgressLog(25, 'info', { msg: 'Validating...', type: 'info' });
            var error = validateAndBuild();
            if (typeof error === 'undefined') {
                $scope.changeProgressLog(50, 'info', { msg: 'Sending...', type: 'info' });
                try {
                    customEntityService.execute();
                    return true;
                } catch (err) {
                    error = err;
                    console.log('Error validating step ' + $scope.currentStep() + ' - ' + error);
                }
            }
            $scope.changeProgressLog(75, 'warning', { msg: error.message, type: 'warning' });
            toastr.warning(error.message);
            $scope.disableWizard(false);
            return false;
        };

        $scope.executeUpdate = function() {
            $scope.clearProgressLog();
            $scope.disableWizard(true);
            $scope.changeProgressLog(25, 'info', { msg: 'Validating...', type: 'info' });
            var error = validateAndBuild();
            if (typeof error === 'undefined') {
                $scope.changeProgressLog(50, 'info', { msg: 'Sending...', type: 'info' });
                try {
                    customEntityService.update();
                    return true;
                } catch (err) {
                    error = err;
                    console.log('Error validating step ' + $scope.currentStep() + ' - ' + error);
                }
            }
            $scope.changeProgressLog(75, 'warning', { msg: error.message, type: 'warning' });
            toastr.warning(error.message);
            $scope.disableWizard(false);
            return false;
        };


        $scope.$on('entityManagementFinished', function(event, response) {
            if (response.isOk) {
                var deviceData = $scope.$resolve.updateData || {};
                if ($scope.isEditMode() && deviceData.id) {
                    $scope.clearProgressLog();
                    $scope.disableWizard(false);
                    toastr.success('Entity updated successfully!!!');
                } else {
                    $scope.changeProgressLog(75, 'success', { msg: 'Finish!', type: 'success' });
                    $scope.completeWizard();
                }
                $scope.$apply();
            } else {
                $scope.changeProgressLog(75, 'warning', { msg: 'Error on operation: ' + response.data, type: 'warning' });
                $scope.disableWizard(false);
                $scope.$apply();
            }
        });


        //darle valor a estas variables a traves de funciones propias de este controlador

        $scope.finishedWizard = function() {
            WizardHandler.wizard().currentStep().completed = true;
            return $scope.wizard.close;
        };

        $scope.currentStep = function() {
            return WizardHandler.wizard().currentStepTitle();
        };

        $scope.exitValidation = function() {
            return !$scope.wizard.disable;
        };

        $scope.enterValidation = function() {
            return !$scope.wizard.disable;
        };

        $scope.disableWizard = function(_value) {
            $scope.wizard.disable = _value;
        };

        $scope.completeWizard = function() {
            $scope.wizard.disable = false;
            $scope.wizard.hide = $scope.wizard.close = true;
        };

        $scope.isCloseWizard = function() {
            return !!$scope.wizard.close;
        };

        $scope.isDisableWizard = function() {
            return !!$scope.wizard.disable;
        };

        load();

        function validateAndBuild() {
            try {
                customEntityService.createAndValidateBuilder();
            } catch (err) {
                console.log('Error validating step ' + $scope.currentStep() + ' - ' + err);
                return err;
            }
        }

        function reset() {
            angular.copy($scope.config.entity || baseConfig, $scope.entity);
        }

        function load() {
            angular.merge($scope.entity, baseConfig, $scope.config.entity);
        }

    }
]);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wizard = angular.module('adf.widget.customEntityWizard');

_wizard.controller('CustomStepDeviceAdminController', ['$scope', 'WizardHandler', 'customEntityService', '$api', 'Authentication',
    function($scope, WizardHandler, customEntityService, $api, Authentication) {
        var entity = customEntityService.entity.type;
        var error = null;
        var locationEvents = [];

        $scope.mapViewEnabled = false;
        $scope.optStatusCollection = [];
        $scope.administrativeStateCollection = [];
        $scope.organizations = [];
        $scope.channels = [];

        $scope.show_execute = true;
        $scope.show_update = false;
        $scope.show_operational_status = (entity === 'GATEWAY' || entity === 'ASSET');

        if (!$scope.entity.operationalStatus)
            $scope.entity.operationalStatus = { selected: 'Loading...' };
        if (!$scope.entity.administrativeState)
            $scope.entity.administrativeState = { selected: 'Loading...' };
        if (!$scope.entity.organization)
            $scope.entity.organization = { selected: { name: 'Loading...' } };
        if (!$scope.entity.channel)
            $scope.entity.channel = { selected: null };


        if (!$scope.entity.location || Object.keys($scope.entity.location).length === 0) {
            $scope.entity.location = angular.copy({
                latitude: null,
                longitude: null,
                postal: null,
                map: {
                    center: {
                        lat: 40.095,
                        lng: -3.823,
                        zoom: 4
                    },
                    markers: {},
                    events: {
                        markers: {
                            enable: ['dragend', 'click'],
                            logic: 'emit'
                        },
                        map: {
                            enable: ['click'],
                            logic: 'emit'
                        }
                    }
                }
            });
        }

        locationEvents.push($scope.$on('leafletDirectiveMarker.map-marker.click', function(event, args) {
            $scope.entity.location.map.markers = {};
            $scope.entity.location.latitude = undefined;
            $scope.entity.location.longitude = undefined;
        }));

        locationEvents.push($scope.$on('leafletDirectiveMap.map-marker.click', function(event, args) {
            var latlng = args.leafletEvent.latlng;
            $scope.entity.location.map.markers = {
                marker: {
                    lat: latlng.lat,
                    lng: latlng.lng,
                    draggable: true,
                    focus: true,
                    message: 'Drag me to move. Click me to remove'
                }
            };
            $scope.entity.location.latitude = latlng.lat;
            $scope.entity.location.longitude = latlng.lng;
        }));

        locationEvents.push($scope.$on('leafletDirectiveMarker.map-marker.dragend', function(event, args) {
            var point = args.leafletEvent.target._leaflet_events.dragend[0].context._latlng;
            $scope.entity.location.latitude = point.lat;
            $scope.entity.location.longitude = point.lng;
        }));

        $scope.$on('destroy', function() {
            for (var eventToDestroy in locationEvents) {
                eventToDestroy();
            }
        });

        $scope.locationChanged = function() {
            if ($scope.entity.location.map) {
                if ($scope.entity.location.latitude && $scope.entity.location.longitude) {
                    $scope.entity.location.map.markers = {
                        marker: {
                            lat: $scope.entity.location.latitude,
                            lng: $scope.entity.location.longitude,
                            draggable: true,
                            focus: true,
                            message: 'Drag me to move. Click me to remove'
                        }
                    };

                    $scope.entity.location.map.center.lat = $scope.entity.location.latitude;
                    $scope.entity.location.map.center.lng = $scope.entity.location.longitude;
                }
            }
        };

        $scope.changeChannels = function(item) {
            $scope.channels.length = 0;
            $scope.entity.channel.selected = null;
            if (!item) {
                return;
            }
            $api().newChannelFinder().findByDomainAndWorkgroupAndOrganization(Authentication.user.domain, Authentication.user.workgroup, item.name)
                .then(function(response) {
                    $scope.entity.channel.selected = null;
                    var channels = response.data;
                    angular.copy(channels, $scope.channels);
                    $scope.$apply();
                })
                .catch(function(error) {
                    console.error(error);
                    $scope.entity.channel.selected = { name: 'Loading error' };
                    $scope.$apply();
                });
        };

        $scope.removeChannels = function() {
            $scope.entity.channel.selected = null;
            $scope.channels.length = 0;
        };

        $scope.execute = function() {
            build();
            return $scope.executeCreate();
        };

        $scope.update = function() {
            build();
            return $scope.executeUpdate();
        };

        $scope.next = function() {
            if (!$scope.isEditMode()) {
                build();
            }
            return true;
        };

        $scope.exitValidation = function() {
            if (!$scope.isEditMode()) {
                build();
            }
            return true;
        };

        $api().operationalStatusSearchBuilder().withEntityType(entity).build().execute().then(
            function(data) {
                if (data.statusCode === 200) {
                    var optStatus = data.data.operationalStatus;
                    angular.forEach(optStatus, function(_optStatus, key) {
                        $scope.optStatusCollection.push(_optStatus.id);
                    });
                } else {
                    $scope.entity.operationalStatus.selected = 'Loading error';
                }
                $scope.$apply();
            }
        );

        $api().administrativeStateSearchBuilder().withEntityType(entity).build().execute().then(
            function(data) {
                if (data.statusCode === 200) {
                    var admState = data.data.administrativeState;
                    angular.forEach(admState, function(_admState, key) {
                        $scope.administrativeStateCollection.push(_admState);
                    });
                } else {
                    $scope.entity.administrativeState.selected = 'Loading error';
                }
                $scope.$apply();
            }
        );

        $api().newOrganizationFinder().findByDomainAndWorkgroup(Authentication.user.domain, Authentication.user.workgroup)
            .then(function(response) {
                var organizations = response.data;
                $scope.organizations = angular.copy(organizations);
                $scope.$apply();
            })
            .catch(function(error) {
                console.error(error);
                $scope.entity.organization.selected = { name: 'Loading error' };
                $scope.$apply();
            });

        function build() {
            var admin = $scope.entity.admin;
            customEntityService.updateEntity({
                'EntityKey': admin.id,
                'Organization': $scope.entity.organization.selected.name,
                'Channel': $scope.entity.channel.selected.name,
                'AdministrativeState': $scope.entity.administrativeState.selected ? $scope.entity.administrativeState.selected.id : undefined,
                'OperationalStatus': $scope.entity.operationalStatus.selected,
                'DefaultFeed': admin.defaultFeed
            });
            var _date = new Date();
            var time = window.moment(_date).format('HH:mm:ssZ');
            var date = window.moment(_date).format('YYYY-MM-DD');

            customEntityService.updateEntity({
                'Location': ($scope.entity.location.longitude && $scope.entity.location.latitude) ? [parseFloat($scope.entity.location.longitude).toFixed(5) * 1, parseFloat($scope.entity.location.latitude).toFixed(5) * 1, date + 'T' + time] : null,
                'PostalCode': $scope.entity.location.postal
            });
        }
    }
]);




_wizard.controller('StepTwoController', ['$scope', 'WizardHandler', 'entityService', '$api', 'Authentication',
    function($scope, WizardHandler, entityService, $api, Authentication) {
        var entity = entityService.entity.type;
        var error = null;

        $scope.optStatusCollection = [];
        $scope.administrativeStateCollection = [];
        $scope.organizations = [];
        $scope.channels = [];

        $scope.show_execute = true;
        $scope.show_update = false;
        $scope.show_operational_status = (entity === 'GATEWAY' || entity === 'ASSET');

        if (!$scope.entity.operationalStatus)
            $scope.entity.operationalStatus = { selected: 'Loading...' };
        if (!$scope.entity.administrativeState)
            $scope.entity.administrativeState = { selected: 'Loading...' };
        if (!$scope.entity.organization)
            $scope.entity.organization = { selected: { name: 'Loading...' } };
        if (!$scope.entity.channel)
            $scope.entity.channel = { selected: null };


        $scope.changeChannels = function(item) {
            $scope.channels.length = 0;
            $scope.entity.channel.selected = null;
            if (!item) {
                return;
            }
            $api().newChannelFinder().findByDomainAndWorkgroupAndOrganization(Authentication.user.domain, Authentication.user.workgroup, item.name)
                .then(function(response) {
                    $scope.entity.channel.selected = null;
                    var channels = response.data;
                    angular.copy(channels, $scope.channels);
                    $scope.$apply();
                })
                .catch(function(error) {
                    console.error(error);
                    $scope.entity.channel.selected = { name: 'Loading error' };
                    $scope.$apply();
                });
        };

        $scope.removeChannels = function() {
            $scope.entity.channel.selected = null;
            $scope.channels.length = 0;
        };

        $scope.execute = function() {
            build();
            return $scope.executeCreate();
        };

        $scope.update = function() {
            build();
            return $scope.executeUpdate();
        };

        $scope.next = function() {
            if (!$scope.isEditMode()) {
                build();
            }
            return true;
        };

        $scope.exitValidation = function() {
            if (!$scope.isEditMode()) {
                build();
            }
            return true;
        };

        $api().operationalStatusSearchBuilder().withEntityType(entity).build().execute().then(
            function(data) {
                if (data.statusCode === 200) {
                    var optStatus = data.data.operationalStatus;
                    angular.forEach(optStatus, function(_optStatus, key) {
                        $scope.optStatusCollection.push(_optStatus.id);
                    });
                } else {
                    $scope.entity.operationalStatus.selected = 'Loading error';
                }
                $scope.$apply();
            }
        );

        $api().administrativeStateSearchBuilder().withEntityType(entity).build().execute().then(
            function(data) {
                if (data.statusCode === 200) {
                    var admState = data.data.administrativeState;
                    angular.forEach(admState, function(_admState, key) {
                        $scope.administrativeStateCollection.push(_admState);
                    });
                } else {
                    $scope.entity.administrativeState.selected = 'Loading error';
                }
                $scope.$apply();
            }
        );

        $api().newOrganizationFinder().findByDomainAndWorkgroup(Authentication.user.domain, Authentication.user.workgroup)
            .then(function(response) {
                var organizations = response.data;
                $scope.organizations = angular.copy(organizations);
                $scope.$apply();
            })
            .catch(function(error) {
                console.error(error);
                $scope.entity.organization.selected = { name: 'Loading error' };
                $scope.$apply();
            });

        function build() {
            var admin = $scope.entity.admin;
            if ($scope.isEditMode()) {
                entityService.updateEntity({
                    'AdministrativeState': $scope.entity.administrativeState.selected ? $scope.entity.administrativeState.selected.id : undefined,
                    'OperationalStatus': $scope.entity.operationalStatus.selected,
                    'DefaultFeed': admin.defaultFeed
                });
            } else {
                entityService.updateEntity({
                    'EntityKey': admin.id,
                    'Organization': $scope.entity.organization.selected.name,
                    'Channel': $scope.entity.channel.selected.name,
                    'AdministrativeState': $scope.entity.administrativeState.selected ? $scope.entity.administrativeState.selected.id : undefined,
                    'OperationalStatus': $scope.entity.operationalStatus.selected,
                    'DefaultFeed': admin.defaultFeed
                });
            }
        }
    }
]);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wizard = angular.module('adf.widget.customEntityWizard');

_wizard.controller('CustomEntityWizardEditController', ['$rootScope', '$scope', 'catalogs', 'WizardHandler', '$controller', 'customEntityService', 'toastr', '$api',
    function($rootScope, $scope, catalogs, WizardHandler, $controller, customEntityService, toastr, $api) {
        $controller('CustomEntityCustomWizardController', { $rootScope, $scope, catalogs, WizardHandler, $controller, customEntityService, toastr, $api });
        $scope.wizard.editMode = true;
        $scope.$watch('entity', function(newVal, oldVal) {
            $scope.config.entity = newVal;
        }, true);
        $scope.isEditMode = function() { return true; }
    }
]);

/***/ })
],[1]);
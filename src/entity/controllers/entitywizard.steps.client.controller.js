'use strict';

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
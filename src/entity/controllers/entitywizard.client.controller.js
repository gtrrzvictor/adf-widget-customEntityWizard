'use strict';

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
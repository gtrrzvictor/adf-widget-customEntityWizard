'use strict';

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
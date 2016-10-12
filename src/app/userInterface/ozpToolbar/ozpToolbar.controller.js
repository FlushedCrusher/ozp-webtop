'use strict';

/**
 * The ozp toolbar component shown in the Webtop.
 *
 * @module ozpWebtop.ozpToolbar
 * @requires ozp.common.windowSizeWatcher
 * @requires ozpWebtop.models
 */
angular.module('ozpWebtop.ozpToolbar', [
  'ozp.common.windowSizeWatcher',
  'ozpWebtop.models',
  'ozpWebtop.filters',
  'ozpWebtop.services.ozpInterface']);

angular.module( 'ozpWebtop.ozpToolbar')
/**
 * Controller for ozp toolbar located at the top of Webtop
 *
 * Includes:
 * - menu with links to other OZP resources
 * - notifications (TODO)
 * - username button with dropdown to access user preferences, help, and logout
 *
 * ngtype: controller
 *
 * @class OzpToolbarCtrl
 * @constructor
 * @param $scope ng $scope
 * @param $rootScope ng $rootScope
 * @param windowSizeWatcher notify when window size changes
 * @param deviceSizeChangedEvent event name
 * @param fullScreenModeToggleEvent event name
 * @param ozpInterface module for backend communication
 * @namespace ozpToolbar
 *
 */
.controller('OzpToolbarCtrl',
  function($scope, $rootScope, $window, $log, $modal,
           models, windowSizeWatcher, deviceSizeChangedEvent, tooltipDelay,
           fullScreenModeToggleEvent, ozpInterface, notificationReceivedEvent) {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //                            $scope properties
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
     * @property toolTipDelay length of time to delay showing tooltips on hover
     * @type number
     */
    $scope.toolTipDelay = tooltipDelay;
    /**
     * @property usernameLength Max length of username, based on
     * current screen size
     * @type {Number}
     */
    $scope.usernameLength = 0;

    /**
     * @property fullScreenMode Flag indicating if toolbar should be hidden
     * @type {boolean}
     */
    $scope.fullScreenMode = false;

    /**
    * @property messages Messages that have not been dismissed
    * type {array}
    */
    $scope.messages = [];

    /**
    * @property thereAreUnexpiredNotifications Whether or not there are unexpired
    *           notifications, used to change class in template to notify use
    * type {boolean}
    */

    $rootScope.$on(notificationReceivedEvent, function(event, data){
      //check to see if there are any notifications
      data.forEach(function( item ) {
        item.message = JSON.parse(item.message);
        item.message.geoAlert = JSON.parse(item.message.geoAlert);
      });
      scope.messages = data;

      $scope.messageCount = $scope.messages.length;
      $scope.thereAreUnexpiredNotifications = true;
      //update notification tooltip
      if($scope.messages.length === 0){
        // no messages, switch bell icon in template
        $scope.thereAreUnexpiredNotifications = false;
      }else if($scope.messageCount === 1){
        $scope.notificationTooltip = $scope.messageCount + ' new notification.';
      }
      else {
        $scope.notificationTooltip = $scope.messageCount + ' new notifications.';
      }

    });

    $scope.dismissNotification = function(a){
      for(var b in $scope.messages){
        if($scope.messages[b].id === a.id){
          //update the backend so other apps know message has been dismissed
          models.dismissNotification(a);
          //delete local message from scope
          $scope.messages.splice(b, 1);
        }
      }
      if($scope.messageCount > 0){
        $scope.messageCount = $scope.messageCount - 1;
        $scope.notificationTooltip = $scope.messageCount + ' new notifications.';
      }
      if($scope.messages.length === 0){
        // no messages, switch bell icon in template
        $scope.thereAreUnexpiredNotifications = false;
      }

    };
    
    $scope.dismissAllNotifications = function() {
      for(var b in $scope.messages) {
        var message = $scope.messages[b];
        models.dismissNotification(message);
        $scope.messages.splice(b,1);
      }
      $scope.thereAreUnexpiredNotifications = false;
    };
    
    $scope.flyToTrack = function( featureId ) {

      var self = this;
      var overlayId = 'tcri:ufs_zone';

      // publish a msg on the proxy channel so the alert monitor could relay it to the map.
      OWF.Container.Eventing.publish('map.feature.selected.proxy', JSON.stringify({
        'featureId'   : featureId,
        'overlayId'   : overlayId
      }));
      OWF.Container.Eventing.publish('map.view.center.feature.proxy', JSON.stringify({
        'featureId'   : featureId,
        'overlayId'   : overlayId
      }));
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //                           initialization
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // register for notifications when window size changes
    windowSizeWatcher.run();

    $scope.$on(deviceSizeChangedEvent, function(event, value) {
      handleDeviceSizeChange(value);
    });

    $scope.$on(fullScreenModeToggleEvent, function(event, data) {
      $scope.fullScreenMode = data.fullScreenMode;
    });

    $scope.hudUrl = $window.OzoneConfig.HUD_URL;
    $scope.centerUrl = $window.OzoneConfig.CENTER_URL;
    $scope.webtopUrl = $window.OzoneConfig.WEBTOP_URL;
    $scope.metricsUrl = $window.OzoneConfig.METRICS_URL;
    $scope.developerResourcesUrl = $window.OzoneConfig.DEVELOPER_RESOURCES_URL;
    $scope.feedbackAddress = $window.OzoneConfig.FEEDBACK_ADDRESS;
    $scope.helpdeskAddress = $window.OzoneConfig.HELPDESK_ADDRESS;
    $scope.feedbackTarget = '_blank';
    $scope.helpdeskTarget = '_blank';

    if($scope.feedbackAddress.substring(0,7)=== 'mailto:'){
      $scope.feedbackTarget = '_self';
    }

    if($scope.helpdeskAddress.substring(0,7)=== 'mailto:'){
      $scope.helpdeskTarget = '_self';
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    //                          methods
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
     * Handler invoked when window size changes across device size boundaries
     * as defined by Bootstrap
     *
     * @method handleDeviceSizeChange
     * @param value value.deviceSize is one of 'xs', 'sm', 'md', or 'lg'
     */
    function handleDeviceSizeChange(value) {
      if (value.deviceSize === 'sm') {
        $scope.usernameLength = 9;
      } else if (value.deviceSize === 'md') {
          $scope.usernameLength = 12;
      } else if (value.deviceSize === 'lg') {
          $scope.usernameLength = 12;
      }
    }


    /**
      * @method openHelpModal
      * @param board the changed board object
      * @returns {*}
      */
    $scope.openHelpModal = function(board) {
      $scope.board = board;
      var modalInstance = $modal.open({
        templateUrl: 'userInterface/helpModal/helpModal.tpl.html',
        controller: 'helpModalInstanceCtrl',
        windowClass: 'app-modal-window-large',
        scope: $scope,
        resolve: {
          dashboard: function() {
            // return $scope.board;
            return $scope.board;
          }
        }
      });

      modalInstance.result.then(function () {

      });
    };



    /**
      * @method openProfileModal
      * @param board the changed board object
      * @returns {*}
      */
    $scope.openProfileModal = function(board) {
      $scope.board = board;
      var modalInstance = $modal.open({
        templateUrl: 'userInterface/profileModal/profileModal.tpl.html',
        controller: 'profileModalInstanceCtrl',
        windowClass: 'app-modal-window',
        scope: $scope,
        resolve: {
          dashboard: function() {
            // return $scope.board;
            return $scope.board;
          }
        }
      });

      modalInstance.result.then(function () {

      });
    };



    /**
      * @method openContactModal
      * @param board the changed board object
      * @returns {*}
      */
    $scope.openContactModal = function(board) {
      $scope.board = board;
      var modalInstance = $modal.open({
        templateUrl: 'userInterface/contactModal/contactModal.tpl.html',
        controller: 'contactModalInstanceCtrl',
        windowClass: 'app-modal-window',
        scope: $scope,
        resolve: {
          dashboard: function() {
            // return $scope.board;
            return $scope.board;
          }
        }
      });

      modalInstance.result.then(function () {

      });
    };



    /**
      * @property isAdmin indicates if the user is an admin
      * @property isOrgSteward indicates if the user is an org steward
      */
    ozpInterface.getProfile().then(function(d){
       var userRole=d.highestRole;
       if(userRole === 'ADMIN' || userRole === 'APPS_MALL_STEWARD'){
          $scope.isAdmin = true;
       }else{
          $scope.isAdmin = false;
       }
       if(userRole === 'ORG_STEWARD'){
           $scope.isOrgSteward = true;
       }else{
           $scope.isOrgSteward = false;
       }
    });
  }
);

angular.module('app',[
  'ozpWebtop.filters'
]);

angular.module('ozpWebtop.filters', [])

.filter('cmdate', [
  '$filter', function($filter) {
    return function(input, format) {
      return $filter('date')(new Date(input), format) + ' ' + String(String(new Date()).split('(')[1]).split(')')[0];
    };
  }
])

.filter('dcgsnDate', [
  '$filter', function($filter) {
    return function(input, format) {
      var tmp = $filter('date')(new Date(input),'ddHHmm');
      var tmp1 = $filter('date')(new Date(input),'MMM yy');
      return tmp + "Z " + tmp1;
    };
  }
]);
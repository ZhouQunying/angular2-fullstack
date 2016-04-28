/**
 * author : Ryan Liu ryanliu@shunshunliuxue.com
 * date   : 10 Dec 2015
 * desc   : final case list controller
 **/

(function() {
  angular.module("BI").controller("FinalCaseListCtrl", function(Auth, $state, Restangular, FinalCaseDataFields, $window, $timeout, Config, Utils, $sce) {
    var restrictsHasValue, vm;
    vm = this;
    vm.Auth = Auth;
    vm.now = new Date();
    vm.pageConf = {
      maxSize: 5,
      currentPage: $state.params.page || 1,
      itemsPerPage: 10,
      sort: $state.params.sort,
      filter: $state.params.filter,
      keywords: $state.params.keywords
    };
    if (vm.pageConf.filter) {
      try {
        vm.filters = angular.fromJson(vm.pageConf.filter);
      } catch (_error) {
      }
    } else {
      vm.filters = {};
    }
    vm.restricts = Auth.getCurrentUser().permission.filters;
    restrictsHasValue = _.values(vm.restricts).some(function (value) {
      return value || value === 0;
    });
    if (!restrictsHasValue) {
      vm.restricts = null;
    }


    vm.minDate = new Date('1980-01-01');
    vm.maxDate = new Date('2020-12-31');
    vm.today = Math.floor((new Date).setHours(0) / 3600000) * 3600000;
    vm.todayLater = Math.ceil((new Date).setHours(23) / 3600000) * 3600000 - 1;
    vm.disableFilter = function (field) {
      var ref, ref1;
      return ((ref = vm.restricts) != null ? ref[field.name] : void 0) || ((ref1 = vm.restricts) != null ? ref1[field.name] : void 0) === 0;
    };
    if (vm.pageConf.sort) {
      try {
        vm.sorts = angular.fromJson(vm.pageConf.sort);
      } catch (_error) {
      }
    } else {
      vm.sorts = ['-create_at'];
    }
    vm.query = vm.pageConf.keywords;
    vm.resetMultiFilter = function (field) {
      if (vm.filters[field.name] && vm.filters[field.name].length === 0) {
        return delete vm.filters[field.name];
      }
    };
    vm.reload = function (resetIndex) {
      if (resetIndex) {
        vm.pageConf.currentPage = 1;
      }
      _.forEach(vm.filters, function (value, key) {
        if (value === null) {
          return delete vm.filters[key];
        }
      });
      vm.pageConf.filter = angular.toJson(vm.filters);
      vm.pageConf.sort = angular.toJson(vm.sorts);
      return $state.go('finalCase.list', {
        page: vm.pageConf.currentPage,
        sort: vm.pageConf.sort,
        filter: vm.pageConf.filter,
        keywords: vm.pageConf.keywords
      });
    };
    vm.resetQuery = function () {
      vm.pageConf.currentPage = 1;
      delete vm.pageConf.sort;
      delete vm.pageConf.filter;
      delete vm.pageConf.keywords;
      return vm.reload();
    };
    vm.fields = FinalCaseDataFields;

    vm.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1,
      'show-weeks': false
    };
    vm.prevent = function ($event) {
      $event.preventDefault();
      return $event.stopPropagation();
    };
    vm.search = function (status) {
      var base, base1, base2, base3, filterObj;
      filterObj = {};
      try {
        if (vm.pageConf.filter) {
          filterObj = angular.fromJson(vm.pageConf.filter);
        }
      } catch (_error) {
      }
      vm.fields.forEach(function (field) {
        return field.$filter = filterObj[field.name];
      });
      vm.pageConf.sort = angular.toJson(vm.sorts);
      return Restangular.all('finalcase/').getList({
        page: vm.pageConf.currentPage - 1,
        keywords: vm.pageConf.keywords,
        order_by: angular.toJson(vm.sorts),
        filters: angular.toJson(filterObj),
        length: vm.pageConf.itemsPerPage
      }).then(function (result) {
        var isFin = Auth.getCurrentUser().permission.is_financial_officer;
        _.map(result, function(item) {
          if (item['final_status']=='待审核') {
            if (isFin && item['final_type'] == '异常结案'){
              item.canApprove = true;
            } else if (!isFin && item['final_type'] == '正常结案') {
              item.canApprove = true;
            }
          }

          //item.remarkHtml = $sce.trustAsHtml(item.remark);

          return item;
        });
        return vm.entities = result;
      });
    };
    vm.pending = function() {
      var filterObj = {};
      var filter = 'final_status';
      var status = '待审核';
      filterObj[filter] = status;
      vm.filters[filter] = status;
      vm.pageConf.filter = angular.toJson(filterObj);
      vm.pageConf.keywords = vm.query;
      vm.reload(true)
    };
    vm.download = function() {
      var exportUrl;
      vm.holding = true;
      $timeout(function() {
        return vm.holding = false;
      }, 3000);
      exportUrl = Config.host + '/bi/finalcase/finaldata.xlsx';
      return $timeout(function() {
        return $window.open(exportUrl);
      });
    };
    vm.searchKeypress = function ($event) {
      if ($event.keyCode === 13) {
        vm.pageConf.keywords = vm.query;
        return vm.reload(true);
      }
    };
    vm.canFilter = function (field) {
      return field.filterType;
    };
    vm.search();
    return this;
  });
}).call(this);

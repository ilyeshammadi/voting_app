app.controller('ListPollsController', function($scope, $http){
  $scope.polls = [];
  $http.get('/polls/').success(function (res) {
    $scope.polls = res;
  })

  $scope.vote = function (p, index) {
    var params = {
      choice_id : p.choices[index]._id + ''
    }
    var url = '/polls/vote/' + p._id, params;

    $.post(url, params, function (res) {
      console.log(res);
      $scope.$apply(function (){
        p.choices[index].votes++;
        p.can_vote = false;
      })
    });
  }
})

app.controller('PollDetailController', function($scope, $http, $routeParams){
  $scope.poll = {};
  $http.get('/polls/' + $routeParams.id).success(function (res) {
    $scope.poll = res;
  })

  $scope.vote = function (index) {
    var params = {
      choice_id : $scope.poll.choices[index]._id + ''
    }
    var url = '/polls/vote/' + $scope.poll._id, params;

    $.post(url, params, function (res) {
      console.log(res);
      $scope.$apply(function (){
        $scope.poll.choices[index].votes++;
        $scope.poll.can_vote = false;
      })
    });
    console.log('Vote ' + index);
  }


})

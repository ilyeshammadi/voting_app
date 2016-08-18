app.controller('ListPollsController', function($scope, $http){
  $scope.polls = [];
  $http.get('/polls/').success(function (res) {
    $scope.polls = res;
    for(i in $scope.polls){
      if(!$scope.polls[i].can_vote){
        initChart($scope.polls[i], 'pie');
      }
    }
  })

  $scope.vote = function (p, index) {
    var params = {
      choice_id : p.choices[index]._id + ''
    }
    var url = '/polls/vote/' + p._id, params;

    $.post(url, params, function (res) {
      initChart(p, 'pie');
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
    initChart($scope.poll, 'bar');
  });

  $scope.vote = function (index) {
    var params = {
      choice_id : $scope.poll.choices[index]._id + ''
    }
    var url = '/polls/vote/' + $scope.poll._id, params;

    $.post(url, params, function (res) {
      initChart($scope.poll, 'bar');
      $scope.$apply(function (){
        $scope.poll.choices[index].votes++;
        $scope.poll.can_vote = false;
      })
    });
  }

})

function random() {
  return Math.floor(Math.random() * 255);
}

function generateColors(length) {
  var colors = [];
  for (var i = 0; i < length; i++) {
    var r = random();
    var g = random();
    var b = random();
    colors.push('rgba(' + r +', ' + g +', ' + b + ', 1)');
  }
  return colors;
}

function initChart(poll, chartType) {
  $('canvas').ready(function () {
    // Get the labels
    var labels = poll.choices.map(function (val) {
      return val.title;
    })
    var data = poll.choices.map(function (val) {
      return val.votes;
    });
    var colors = generateColors(data.length);

    var ctx = document.getElementById("chart" + poll._id);
    var myChart = new Chart(ctx, {
      type: chartType,
      data: {
          labels: labels,
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: colors
          }]
      },
      options: {
           responsive: false
       }
    });
  })
}

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
        p.has_vote = true;
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

  $scope.remove = function () {
    $.post('/polls/delete/' + $scope.poll._id, function (res){
      console.log(res);
      window.location.replace('/');
    }).fail(function (err) {
      alert(err);
    })
  }

})

app.controller('CreatePollController', function($scope, $http){
  $scope.poll = {};
  $scope.poll.title = '';
  $scope.poll.choices = [];

  $scope.savePoll = function () {
    $('.options input').each(function () {
      var value = $(this).val();
      if(/\S/.test(value)){
        $scope.poll.choices.push({title : value});
      }
    })
    var params = {
      title : $scope.poll.title,
      choices: JSON.stringify($scope.poll.choices)
     }

    // If the data is empty dont save
    if(/\S+/.test($scope.poll.title)){
      $.post('/polls/create/', params, function (res){
        console.log(res._id)
        window.location.replace('#/' + res._id);
      }).fail(function (err) {
        alert(err);
      })
    }
  }
})


app.controller('UpdatePollController', function($scope, $http, $routeParams){
  $scope.poll = {};

  $http.get('/polls/' + $routeParams.id).success(function (data) {
    $scope.poll = data;
  })

  $scope.savePoll = function () {
    $('.options input').each(function () {
      var value = $(this).val();
      if(/\S/.test(value)){
        $scope.poll.choices.push({title : value});
      }
    })
    var params = {
      title : $scope.poll.title,
      choices: JSON.stringify($scope.poll.choices)
     }

    // If the data is empty dont save
    if(/\S+/.test($scope.poll.title)){
      $.post('/polls/create/', params, function (res){
        console.log(res._id)
        window.location.replace('#/' + res._id);
      }).fail(function (err) {
        alert(err);
      })
    }
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

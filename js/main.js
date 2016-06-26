var app = angular.module("mainApp", []);

app.controller("postctrl", function($scope, $http){
  $http.get('https://itunes.apple.com/us/rss/topaudiobooks/limit=10/json').
  success(function(data, status, headers, config) {
//    console.log(data);
//    console.log(data.feed.entry[0]['im:image'][0].label);
    $scope.posts = data.feed.entry;
  }).
  error(function(data,status,header,sconfig){
    //log error
  });
});

app.controller("ituneschartctrl", function($scope, $http){

  
  
  $http.get('https://itunes.apple.com/us/rss/topgrossingapplications/limit=200/json').
  success(function(data, status, headers, config) {
    $scope.posts = data.feed.entry;
    $scope.i = 0;
    
    loadChart(data.feed);
    $scope.done = true;
  }).
  error(function(data,status,header,sconfig){
    //log error
  });


function loadChart(feedData) 
{
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
        $scope.dataAsArray = [
          ['category_label', 'amount']
      ];
      function drawChart() {
            

        angular.forEach(feedData.entry, function(value, key){
          categoryLabel = value.category.attributes.label;
          catPresent = false;
          catLocation = -1;
          
          
          var keepgoing = true;
          angular.forEach($scope.dataAsArray, function(innervalue, innerkey){
            if(keepgoing){
              
            locationResult = innervalue.indexOf(categoryLabel);
            
            if(locationResult != -1)
              {
                catPresent = true;
                catLocation = innerkey;
                keepgoing = false;
              }  
            }
          })
          
          if(catPresent == true)
            {
                amount = $scope.dataAsArray[catLocation][1];
                $scope.dataAsArray[catLocation][1] = amount + 1;
            }
          else
            {
              newCategory = [categoryLabel, 1];
              $scope.dataAsArray.push(newCategory);    
            }
        })
        
              var data = google.visualization.arrayToDataTable($scope.dataAsArray);

              var options = {
                title: feedData.title.label + " Updated on:" +feedData.updated.label
              };
        console.log(feedData);
              var chart = new google.visualization.PieChart(document.getElementById('piechart'));

              chart.draw(data, options);
            }
    }
//  $scope.$apply();
  
//    $scope.cats = $scope.dataAsArray;
});

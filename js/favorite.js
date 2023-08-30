angular.module('favoriteApp', [])
    .controller('FavoritesController', function($scope, $http) {
        BASE_URL = "http://127.0.0.1:8080/";
        $scope.categories = [];
        $scope.realCategories = [];
        $scope.favorites = [];
        $scope.categoryFilter;
        $scope.mode = 'view';

        $scope.favorite = {};

        $scope.setMode = function(text) {
            if (text === 'creation') {
                $scope.realCategories = $scope.categories.filter(function(c) { return c.id !== 0 });
                var idx = $scope.realCategories.map(function(c) { return c.id }).indexOf($scope.categoryFilter);
                if (idx < 0) idx = 0;

                $scope.favorite = {
                    id: $scope.favorite.id?$scope.favorite.id:null,
                    link: $scope.favorite.link?$scope.favorite.link:'',
                    category: $scope.favorite.category?$scope.favorite.category.id:$scope.realCategories[idx].id
                }
            }
            else
                $scope.favorite={};
            $scope.mode = text;
        }
        $scope.cancel = function() {
            $scope.setMode('view');
            
        }

        $scope.validate = function() {
            data={ id: $scope.favorite.id, link: $scope.favorite.link, categoryId:  $scope.favorite.category};
            $http.post(BASE_URL + 'favourite/add', data).then(
                function() {
                    $scope.refresh();
                    $scope.setMode('view');
                }, function(error) {
                    alert(error.data.message);
                }
            )
        }

        $scope.refresh = function(itemFilter = null) {
            $http.get(BASE_URL + 'category/get').then(
                function(response) {
                    sum = 0;
                    $scope.categories = [];
                    response.data.forEach(d => {
                        $scope.categories.push(d);
                        sum+=d.references;
                    });
                    $scope.categories.push({id: 0, name: "Everything", references: sum});
                    link = BASE_URL + 'favourite/get?';
                    if(itemFilter) {
                        link+="categoryId="+itemFilter;
                    }
                    $http.get(link).then(
                        function(res) {
                            $scope.favorites = res.data;
                        }
                    )
                    
                }
            )
        }

        $scope.filterFavorites = function(catFilter) {
            $scope.refresh(catFilter);
        }

        $scope.refresh();

        $scope.delete = function(id) {
            $http.delete(BASE_URL + 'favourite/delete?ids='+id).then(
                function() {
                    $scope.refresh();
                }
            );
        }
    });
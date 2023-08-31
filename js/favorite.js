angular.module('favoriteApp', [])
    .controller('FavoritesController', function($scope, $http) {
        BASE_URL = "http://127.0.0.1:8080/";

        $scope.categories = [];
        $scope.realCategories = [];
        $scope.favorites = [];
        $scope.categoryFilter = 0;
        $scope.mode = 'view';
        $scope.sortType = {"category": "ASC", "updateTime": "ASC"};
        $scope.favorite = {};
        $scope.checked = new Array(100).fill(false);
        $scope.allChecked = false;
        $scope.numChecked = 0;
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
            fetch($scope.favorite.link, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        swal("Error", "The link you entered is not valid", "error");
                    }
                    else {
                        data={ id: $scope.favorite.id, link: $scope.favorite.link, categoryId:  $scope.favorite.category};
                        $http.post(BASE_URL + 'favourite/add', data).then(
                            function() {
                                $scope.refresh();
                                $scope.setMode('view');
                            }, function(error) {
                                alert(error.data.message);
                            }
                        )
                        $scope.categoryFilter = 0;
                        swal("Success", "A favorite was added successfully", "success");
                    }
                })
                .catch(error => {
                    swal("Error", "The link you entered is not valid", "error");
                }); 
        }

        $scope.refresh = function() {
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
                    if($scope.categoryFilter) {
                        link+="categoryId="+$scope.categoryFilter;
                    }
                    $http.get(link).then(
                        function(res) {
                            $scope.favorites = res.data;
                        }
                    )
                    
                }
            )
            $scope.numChecked = 0;
            $scope.allChecked = 0;
            $scope.checked.fill(false);
            $scope.sortType['category'] = "ASC";
            $scope.sortType['updateTime'] = "ASC";
        }

        $scope.filterFavorites = function(catFilter) {
            $scope.categoryFilter = catFilter;
            $scope.refresh();
        }

        $scope.refresh();

        $scope.sort = function(sortBy) {
            link = BASE_URL + 'favourite/get?';
            link+="sortBy="+sortBy+"&sortType="+$scope.sortType[sortBy];
            $scope.sortType[sortBy]=$scope.sortType[sortBy]==="ASC"?"DESC":"ASC";
            if($scope.categoryFilter) {
                link+="&categoryId="+$scope.categoryFilter;
            }
            $http.get(link).then(
                function(res) {
                    $scope.favorites = res.data;
                }
            )
        }
        $scope.toggleAll = function() {
            for(const fav of $scope.favorites) {
                $scope.checked[fav.id] = $scope.allChecked;
            }
            $scope.numChecked = ($scope.allChecked?$scope.favorites.length:0);
        }
        $scope.toggle = function(id) {
            $scope.numChecked += ($scope.checked[id]?1:-1);
            $scope.allChecked = ($scope.numChecked===$scope.favorites.length);
            
        }
        $scope.deleteMultiple = function() {
            toDelete = [];
            for(const favorite of $scope.favorites) {
                if($scope.checked[favorite.id]) {
                    toDelete.push(favorite.id);
                    $scope.checked[favorite.id] = false;
                    $scope.allChecked = false;
                }
            }
            if(confirm("Are you sure you want to delete these ids: " + toDelete + " ?")) {
                if(toDelete.length > 0) {
                    $http.delete(BASE_URL + 'favourite/delete?ids='+toDelete.join(","));
                    $scope.refresh();
                }
            }    
        }
    });
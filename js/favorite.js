angular.module('favoriteApp', [])
    .controller('FavoritesController', function($scope, $http) {

        $scope.categories = [];
        $scope.realCategories = [];
        $scope.favorites = [];

        $scope.categoryFilter = 0;

        $scope.mode = 'view';

        $scope.favorite = {};

        $scope.setMode = function(text) {
            if (text === 'creation') {
                $scope.realCategories = $scope.categories.filter(function(c) { return c.id !== 0 });
                var idx = $scope.realCategories.map(function(c) { return c.id }).indexOf($scope.categoryFilter);
                if (idx < 0) idx = 0;

                $scope.favorite = {
                    link: '',
                    category: $scope.realCategories[idx].id
                }
            }
            $scope.mode = text;
        }

        $scope.cancel = function() {
            $scope.setMode('view');
        }

        $scope.validate = function() {
            $http.post('api/category/' + $scope.favorite.category + '/favorites' , { id: null, link: $scope.favorite.link }).then(
                function() {
                    $scope.refresh();
                    $scope.setMode('view');
                }, function(error) {
                    alert(error.data.message);
                }
            )
        }

        $scope.refresh = function() {
            $http.get('api/categories').then(
                function(response) {
                    $scope.categories = [{id: 0, label: "Everything", references: 0}];
                    response.data.forEach(d => {
                        $scope.categories.push(d);
                    })

                    $http.get('api/favorites').then(
                        function(response) {
                            $scope.favorites = response.data.filter(f => $scope.categoryFilter === 0 || f.category.id === $scope.selectedCategory);
                        }
                    )
                }
            )
        }

        $scope.refresh();
    });
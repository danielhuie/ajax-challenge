"use strict";
/*
 app.js, main Angular application script
 define your module and controllers here
 */

var url = 'https://api.parse.com/1/classes/input';

angular.module('AjaxApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'ML28tcxP2flgHEsLTtMooZTGMPNTVIhrlEASnFWw';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'Bnmfuwahlec09TcGl5r5hnjmHZrqmXNYQHLWwQaG';
    })
    .controller('AjaxController', function($scope, $http) {
        $scope.newComment = {deleted: false, votes: 0, downVotable: true};
        $scope.sortCol = 'rating';
        $scope.sortReverse = false;

        $scope.refreshComments = function () {
            $scope.loading = true;
            $http.get(url)
                .success(function (data) {
                    $scope.comments = data.results;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.addComment = function () {
            $scope.loading = true;
            $http.post(url, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.form.$setPristine();
                    $scope.newComment = {deleted: false, votes: 0, downVotable: true};
                    $scope.loading = false;
                })
        };

        $scope.incrementVotes = function(comment, amount) {
            if (amount == 1) {
                $scope.updateVotes(comment, amount);
            } else if (comment.votes == 0 && amount == -1) {
                comment.downVotable = false;
            } else if (amount == -1 && comment.downVotable) {
                $scope.updateVotes(comment, amount);
            }
        };

        $scope.updateVotes = function(comment, amount) {
            $http.put(url + '/' + comment.objectId, {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function (responseData) {
                    comment.votes = responseData.votes;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                });
        };

        $scope.deleteComment = function (comment) {
            $http.delete(url + '/' + comment.objectId, comment)
                .success(function(respData) {
                    $scope.refreshComments();
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                });
        };

        $scope.isSortedBy = function(colName) {
            return $scope.sortCol === colName;
        };
    });
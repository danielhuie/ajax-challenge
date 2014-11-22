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
        $scope.numDeleted = 0;

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
            $http.post(url, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    console.log("successfully added a new comment to parse");
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.form.$pristine = true;
                })
        };

        $scope.incrementVotes = function(comment, amount) {
            $scope.updating = true;
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
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };

        $scope.deleteComment = function (comment) {
            $http.delete(url + '/' + comment.objectId, comment)
                .success(function (responseData) {
                    comment.deleted = true;
                    $scope.numDeleted++;
                    console.log("successfully removed a new comment from parse");
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log("error");
                });
        };

        $scope.isSortedBy = function(colName) {
            return $scope.sortCol === colName;
        };
    });
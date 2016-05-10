//SEND DATA EXAMPLE

"use strict";

(function(){
  angular
  .module("carGraphingApp")
  .factory("SearchFactory", ["$http", SearchFactoryFunction])
  .factory("DetailsFactory", DetailsFactoryFunction);

  function SearchFactoryFunction($http, $q){
    return {
      sendData: function(data){

        console.log(data);

        var url = "http://svcs.ebay.com/services/search/FindingService/v1";
         url += "?OPERATION-NAME=findItemsByKeywords";
         url += "&SERVICE-VERSION=1.0.0";
         url += "&SECURITY-APPNAME=MaryGrif-WDICarPr-PRD-42f839347-07238b74";
         url += "&GLOBAL-ID=EBAY-US";
         url += "&responseencoding=JSON";
         url += "&callback=JSON_CALLBACK";
         url += "&keywords=" + data.carMake + "%20" + data.carModel + "";
         url += "&buyerPostalCode=" + data.zipCode + "";
         url += "&itemFilter(0).name=LocalSearchOnly";
         url += "&itemFilter(0).value=true";
         url += "&itemFilter(1).name=MaxDistance";
         url += "&itemFilter(1).value=" + data.range + "";
         url += "&paginationInput.entriesPerPage=20";
         url += "&CategoryID=6001";

         console.log(url);

         return $http.jsonp(url);

       }
     };
   }

  DetailsFactoryFunction.$inject = ["SearchFactory", "$http"];
  function DetailsFactoryFunction(SearchFactory, $http){
    return {
      sendData: function(data){
        SearchFactory.sendData(data)
        .then(function(res){
          console.log("hi111");
          console.log(res);
          var carInfo = res["data"];
          var cars = carInfo.findItemsByKeywordsResponse[0].searchResult[0].item || [];
          var urlList = '&itemID=';
          for(var i = 0; i < cars.length; i++){
            urlList += cars[i].itemId[0] + ',';
          }
          var newUrl = "http://open.api.ebay.com/shopping?";
          newUrl += "callname=GetMultipleItems";
          newUrl += "&version=963";
          newUrl += "&appid=MaryGrif-WDICarPr-PRD-42f839347-07238b74";
          newUrl += "&GLOBAL-ID=EBAY-US";
          newUrl += "&responseencoding=JSON";
          newUrl += "&callbackname=JSON_CALLBACK";
          newUrl += "&IncludeSelector=ItemSpecifics";
          newUrl += "&REST-PAYLOAD";
          newUrl += urlList;

          console.log(newUrl);

          return $http.jsonp(newUrl);

      });
    }
  };}
})();
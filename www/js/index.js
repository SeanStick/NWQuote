/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        $( "#scan-vin-button" ).click(function() {
            clickScanVIN();
        });
        $( "#scan-license-button" ).click(function() {
            clickScanLicense();
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');
//
//        console.log('Received Event: ' + id);
    }
};

app.initialize();

function clickScanVIN() {
        cordova.plugins.barcodeScanner.scan(
          function (result) {
          console.log(result.text)
                scannerVINSuccess(result.text);
//              alert("We got a barcode\n" +
//                    "Result: " + result.text + "\n" +
//                    "Format: " + result.format + "\n" +
//                    "Cancelled: " + result.cancelled);
          },
          function (error) {
              alert("Scanning failed: " + error);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : false, // iOS and Android
              showTorchButton : false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              saveHistory: false, // Android, save scan history (default false)
              prompt : "Place a barcode inside the scan area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              formats : "QR_CODE,CODE_39", // default: all but PDF_417 and RSS_EXPANDED
              orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true, // iOS
              disableSuccessBeep: false // iOS and Android
          }
       );
}

function clickScanLicense() {
//    window.plugins.VINBarcodeScanner.scan(scannerSuccess, scannerFailure);
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : false, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: false, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );

}

function scannerVINSuccess(result) {
    $.ajax({
    	url: "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/",
    	type: "POST",
    	data: { format: "json", data: result + ";"},
    	dataType: "json",
    	success: function(result)
    	{
    		alert(JSON.stringify(result));
    		$("#input-year").html(result.Results[0].ModelYear);
    		$("#input-make").html(result.Results[0].Make);
    		$("#input-model").html(result.Results[0].Model);
    		$("#input-vin").html(result.Results[0].VIN);
    	},
    	error: function(xhr, ajaxOptions, thrownError)
    	{
    		console.log(xhr.status);
    		alert(thrownError);
    	}
    });
}

function scannerLicenseSuccess(result) {
        alert(JSON.stringify(result));
        $("#first-name").html(result.Results[0].ModelYear);
        $("#ilast-name").html(result.Results[0].Make);
        $("#dob").html(result.Results[0].Model);
        $("#gender").html(result.Results[0].VIN);
        $("#street").html(result.Results[0].VIN);
        $("#city").html(result.Results[0].VIN);
        $("#state").html(result.Results[0].VIN);
        $("#zip").html(result.Results[0].VIN);
        $("#license").html(result.Results[0].VIN);
    },
    error: function(xhr, ajaxOptions, thrownError)
    {
        console.log(xhr.status);
        alert(thrownError);
    }
}

function scannerFailure(message) {
    alert("failed =(" + JSON.stringify(message));
}

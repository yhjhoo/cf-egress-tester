
var spinner = null;

function showActivitySpinner() {

  if (spinner == null) {
    var spinnerOpts = {
      lines: 13, // The number of lines to draw
      length: 20, // The length of each line
      width: 10, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };

    spinner = new Spinner(spinnerOpts);
  }

  spinner.spin(document.getElementById('egress-form'));
}

function hideActivitySpinner() {
    spinner.stop();
}

function showEgressStatus(egressAttemptUri, result) {

  console.log("showEgressStatus(", egressAttemptUri, ", ", result, ")");

  var isSuccess = result.toString() == "SUCCESS"
  var statusMessagePrefix = "<strong>" + egressAttemptUri + "/ - </strong>&nbsp;"

  if (isSuccess) {

    $("#status-result").removeClass("alert-danger");
    $("#status-result").addClass("alert-success");

  } else {

      $("#status-result").removeClass("alert-success");
      $("#status-result").addClass("alert-danger");

  }

  $("#status-result").html(statusMessagePrefix + result);
  $("#status-result").show();

}

function checkEgressStatus() {

  var host = $("#inputHost").val();
  var port = $("#inputPort").val();
  var protocol = $('#protocol-udp').is(':checked') ? "udp" : "tcp";
  var egressStatusPath = "/egress-status/" + protocol + "/" + host + "/" + port;
  var egressAttemptUri = protocol + "://" + host + ":" + port;

  showActivitySpinner();

  $.get(egressStatusPath,
      function(response) {
        hideActivitySpinner();
        console.log("response", response);
        showEgressStatus(egressAttemptUri, response);
      }
  );

}

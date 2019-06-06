/**
 * Web application
 */
const apiUrl = 'https://04a8a9b9.eu-gb.apiconnect.appdomain.cloud/guestbook';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/entries`,
      dataType: 'json'
    });
  },
  
  updateVote(name, email, comment,_id,_rev) {
    console.log('Sending',name, email, comment,_id,_rev)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/updateVote`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
	_id,
	_rev
      }),
      dataType: 'json',
    });
  },
  
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/entries`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment
      }),
      dataType: 'json',
    });
  }
};

(function() {

  // retrieve entries and update the UI
  function loadEntries() {
    guestbook.get().done(function(result) {
      if (!result.entries) {
        return;
      }
      countVotes(result.entries);
	    
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }
	
  function refreshPage(){
window.location.href=window.location.href
}
 
  function countVotes(votes) {
    var totalVotes = votes.length;
    var votesWindows = 0;
    var votesIOS = 0;
    var votesAndroid = 0;
 
    for (i = 0; i < totalVotes; i++) {
      if (votes[i].comment == "Windows"){
        votesWindows++;
      } else if (votes[i].comment == "iOS"){
        votesIOS++;
      } else{
        votesAndroid++;
      }
    }
 
new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
      labels: ["Windows", "iOS", "Android"],
      datasets: [{
        label: "Votos",
        backgroundColor: ["blue", "white","green"],
        data: [votesWindows, votesIOS, votesAndroid]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Resultados'
      }
    }
});
 
 
//return resultContador;
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('input[name=option]:checked').val()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    loadEntries();
  });
})();

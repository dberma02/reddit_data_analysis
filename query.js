  // UPDATE TO USE YOUR PROJECT ID AND CLIENT ID
  var project_id = 'summer-topic-186219';
  var clientId = '364884337709-tfnpb2hpdjojtthmer10glfjf1oqmgft.apps.googleusercontent.com';
  var scopes = 'https://www.googleapis.com/auth/bigquery';
  var full_query = "SELECT sub_a, sub_b, percent, sub_ac, sub_bc FROM ( SELECT sub_a, sub_b, percent, COUNT(*) OVER(PARTITION BY sub_a) sub_ac, sub_bc FROM ( SELECT a.subreddit sub_a, b.subreddit sub_b, INTEGER(100*COUNT(*) / FIRST(b.author_count) ) percent, COUNT(*) OVER(PARTITION BY sub_b) sub_bc FROM ( SELECT author, subreddit, author_count FROM FLATTEN(( SELECT UNIQUE(author) author, subreddit, COUNT(DISTINCT author) author_count FROM [fh-bigquery:reddit_comments.all] GROUP EACH BY 2 ),author)) a JOIN EACH ( SELECT author, subreddit, author_count FROM FLATTEN(( SELECT UNIQUE(author) author, subreddit, COUNT(DISTINCT author) author_count FROM [fh-bigquery:reddit_comments.all] WHERE subreddit IN ('fatpeoplehate', 'incels', 'pizzagate', 'niggers', 'Coontown', 'hamplanethatred', 'transfags','neofag','shitniggerssay','The_Donald','TheFappening','beatingwomen','jailbait', 'Physical_Removal', 'MensRights', 'findbostonbombers', 'DarkNetMarkets', 'european') GROUP BY 2 ),author) ) b ON a.author=b.author WHERE a.subreddit!=b.subreddit GROUP EACH BY 1, 2 HAVING percent>10 ) ) #WHERE #  sub_ac<20 #  AND sub_bc<20 ORDER BY 2, 3 DESC LIMIT 10";
  var config = {
    'client_id': clientId,
    'scope': scopes
  };

  function runQuery() {
   var data;
   var request = gapi.client.bigquery.jobs.query({
      'projectId': project_id,
      'timeoutMs': '300000',
      'query': full_query,
    });
    request.execute(function(response) {
        console.log(response);
        data = response.result;
        createForceGraph(response.result);
    });
    return data;
  }

  function authorize(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
  }
  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      loadApi();
    } else {
      console.error('Not authorized.')
    }
  }

  function loadApi(){
    gapi.client.load('bigquery', 'v2').then(
      function() {
        var data = runQuery();
      }
    );
  }

gapi.load('client:auth', authorize);


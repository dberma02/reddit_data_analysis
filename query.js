  // UPDATE TO USE YOUR PROJECT ID AND CLIENT ID
  var project_id = 'summer-topic-186219';
  var clientId = '364884337709-tfnpb2hpdjojtthmer10glfjf1oqmgft.apps.googleusercontent.com';
  var scopes = 'https://www.googleapis.com/auth/bigquery';
  var force_query = `SELECT
  sub_a,
  sub_b,
  percent,
  sub_ac,
  sub_bc,
  _rank
FROM (
  SELECT
    sub_a,
    sub_b,
    percent,
    COUNT(*) OVER(PARTITION BY sub_a) sub_ac,
    sub_bc,
    DENSE_RANK() OVER(PARTITION BY sub_B ORDER BY percent DESC) _rank
  FROM (
    SELECT
      a.subreddit sub_a,
      b.subreddit sub_b,
      INTEGER(100*COUNT(*) / FIRST(b.author_count) ) percent,
      COUNT(*) OVER(PARTITION BY sub_b) sub_bc,
    FROM (
      SELECT
        author,
        subreddit, author_count
      FROM
        FLATTEN((
          SELECT
            UNIQUE(author) author, 
            subreddit, COUNT(DISTINCT author) author_count
          FROM
            [fh-bigquery:reddit_comments.all]
            WHERE author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
                        AND author != "[deleted]"
          GROUP EACH BY
            2 ),author)) a
    JOIN EACH (
      SELECT
        author,
        subreddit, author_count
      FROM
        FLATTEN((
          SELECT
            UNIQUE(author) author,
            subreddit, COUNT(DISTINCT author) author_count
          FROM
            [fh-bigquery:reddit_comments.all]
          WHERE
            subreddit IN ('fatpeoplehate', 'incels', 'pizzagate', 'niggers', 'Coontown', 'hamplanethatred', 'transfags', 'neofag','shitniggerssay', 'The_Donald', 'TheFappening', 'beatingwomen', 'Creepshots', 'jailbait', 'Physical_Removal', 'MensRights', 'findbostonbombers', 'DarkNetMarkets', 'european')
            AND author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
            AND author != "[deleted]"
          GROUP BY
            2 ),author) ) b
    ON
      a.author=b.author
    WHERE
      a.subreddit!=b.subreddit
    GROUP EACH BY
      1,
      2
    HAVING
      percent>10 ) )
HAVING
  _rank <= 20
ORDER BY
  2,
  3 DESC`;

  function runForceQuery() {
   var request = gapi.client.bigquery.jobs.query({
      'projectId': project_id,
      'timeoutMs': '300000',
      'query': force_query,
    });
    request.execute(function(response) {
        createForceGraph(response.rows);
    });
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
        var request = runForceQuery();
      }
    );
  }

gapi.load('client:auth', authorize);


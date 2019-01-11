  // UPDATE TO USE YOUR PROJECT ID AND CLIENT ID
  var project_id = 'summer-topic-186219';
  var clientId = '364884337709-tfnpb2hpdjojtthmer10glfjf1oqmgft.apps.googleusercontent.com';
  var scopes = 'https://www.googleapis.com/auth/bigquery';
  var force_query1 = `SELECT
  sub_a,
  sub_b,
  percent_of_contro_shared,
  percent_of_noncontro_shared,
  a_author_count,
  b_author_count,
  shared_author_count,
  sub_ac,
  sub_bc,
  _rank
FROM (
  SELECT
    sub_a,
    sub_b,
    percent_of_contro_shared,
    percent_of_noncontro_shared,
    b_author_count,
    a_author_count,
    shared_author_count,
    COUNT(*) OVER(PARTITION BY sub_a) sub_ac,
    sub_bc,
    RANK() OVER(PARTITION BY sub_B ORDER BY percent_of_contro_shared DESC) _rank
  FROM (
    SELECT
      a.subreddit sub_a,
      b.subreddit sub_b,
      INTEGER(100*COUNT(*) / FIRST(b.author_count) ) percent_of_contro_shared,
      INTEGER(100*COUNT(*) / FIRST(a.author_count) ) percent_of_noncontro_shared,
      FIRST(b.author_count) b_author_count,
      FIRST(a.author_count) a_author_count,
      count(*) shared_author_count,
      COUNT(*) OVER(PARTITION BY sub_b) sub_bc
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
            subreddit IN ('fatpeoplehate', 'incels', 'pizzagate', 'niggers', 'Coontown', 'hamplanethatred', 
                          'transfags', 'neofag','shitniggerssay', 'The_Donald', 'TheFappening', 'beatingwomen', 
                          'Creepshots', 'jailbait', 'Physical_Removal', 'MensRights', 'findbostonbombers',
                          'DarkNetMarkets', 'european', 'altright','MetaCanada','UncensoredNews',
                          'Imgoingtohellforthis', 'CringeAnarchy','DankMemes','KotakuInAction', 'TumblrInAction',
                          'PussyPass', 'PussyPassDenied','MGTOW','far_right', 'Nazi',
                          'racoonsareniggers', 'DylannRoofInnocent', 'ReallyWackyTicTacs', 'whitesarecriminals',
                          'Polacks', 'SexWithDogs', 'SexWithHorses', 'bestiality', 'picsofcaninevaginas',
                          'zoogold', 'picsofdeadkids', 'picsofcaninedicks', 'tailbait', 'horsecock', 'horsevagina',
                          'killthejews', 'killthejews', 'selfharmpics','EuropeanNationalism', 'pol')
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
      percent_of_contro_shared>10 ) )
HAVING
  _rank <= 10
ORDER BY
  2,
  3 DESC`;

  var force_query2 = `SELECT
  sub_a,
  sub_b,
  percent_of_contro_shared,
  percent_of_noncontro_shared,
  a_author_count,
  b_author_count,
  sub_ac,
  sub_bc,
  _rank
FROM (
  SELECT
    sub_a,
    sub_b,
    percent_of_contro_shared,
    percent_of_noncontro_shared,
    b_author_count,
    a_author_count,
    COUNT(*) OVER(PARTITION BY sub_a) sub_ac,
    sub_bc,
    RANK() OVER(PARTITION BY sub_B ORDER BY a_author_count DESC) _rank
  FROM (
    SELECT
      a.subreddit sub_a,
      b.subreddit sub_b,
      INTEGER(100*COUNT(*) / FIRST(b.author_count) ) percent_of_contro_shared,
      INTEGER(100*COUNT(*) / FIRST(a.author_count) ) percent_of_noncontro_shared,
      FIRST(b.author_count) b_author_count,
      FIRST(a.author_count) a_author_count,
      count(*) shared_author_count,
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
            subreddit IN ('fatpeoplehate', 'incels', 'pizzagate', 'niggers', 'Coontown', 'hamplanethatred', 
                          'transfags', 'neofag','shitniggerssay', 'The_Donald', 'TheFappening', 'beatingwomen', 
                          'Creepshots', 'jailbait', 'Physical_Removal', 'MensRights', 'findbostonbombers',
                          'DarkNetMarkets', 'european', 'altright','MetaCanada','UncensoredNews',
                          'Imgoingtohellforthis', 'CringeAnarchy','DankMemes','KotakuInAction', 'TumblrInAction',
                          'PussyPass', 'PussyPassDenied','MGTOW','far_right', 'Nazi',
                          'racoonsareniggers', 'DylannRoofInnocent', 'ReallyWackyTicTacs', 'whitesarecriminals',
                          'Polacks', 'SexWithDogs', 'SexWithHorses', 'bestiality', 'picsofcaninevaginas',
                          'zoogold', 'picsofdeadkids', 'picsofcaninedicks', 'tailbait', 'horsecock', 'horsevagina',
                          'killthejews', 'killthejews', 'selfharmpics','EuropeanNationalism', 'pol')
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
      percent_of_noncontro_shared >= 3 ) )
HAVING
  _rank <= 10 AND
  a_author_count > 5000
ORDER BY
  _rank ASC`

//force_query2:
//
//  For each controversial subreddit, select top 10 largest generic subreddits where:
//        - At least 3% of all unique commenters also comment in controversial subreddits
//        - The generic subreddit has at least 5000 unique commenters

var fdgQuery = force_query1;


  var sankey_query = `SELECT author, subreddit, comments_in_subreddit,  total_comments, _rank
FROM(
SELECT author, subreddit, comments_in_subreddit,  total_comments, 
       DENSE_RANK() OVER(ORDER BY total_comments DESC) _rank
FROM(
  (SELECT author, subreddit, comments_in_subreddit, total_comments
   FROM
     (SELECT author, subreddit, COUNT(*) OVER(PARTITION BY subreddit, author) comments_in_subreddit, 
              COUNT(*) OVER(PARTITION BY author) total_comments
           
       FROM [fh-bigquery:reddit_comments.all]
        WHERE author in (
           SELECT author
           FROM(
           SELECT author, subreddit, total_comments total_comments_in_controversial
           FROM(
              (SELECT author, subreddit, COUNT(*) OVER(PARTITION BY author) total_comments
           
                FROM [fh-bigquery:reddit_comments.all]
                WHERE subreddit IN ('fatpeoplehate', 'incels', 'pizzagate', 'niggers', 'Coontown', 'hamplanethatred', 
                                    'transfags', 'neofag','shitniggerssay', 'The_Donald', 'TheFappening', 'beatingwomen', 
                                     'Creepshots', 'jailbait', 'Physical_Removal', 'MensRights', 'findbostonbombers',
                                     'DarkNetMarkets', 'european', 'altright','MetaCanada','UncensoredNews',
                                     'Imgoingtohellforthis', 'CringeAnarchy','DankMemes','KotakuInAction', 'TumblrInAction',
                                     'PussyPass', 'PussyPassDenied','MGTOW','far_right', 'Nazi',
                                     'racoonsareniggers', 'DylannRoofInnocent', 'ReallyWackyTicTacs', 'whitesarecriminals',
                                     'Polacks', 'SexWithDogs', 'SexWithHorses', 'bestiality', 'picsofcaninevaginas',
                                     'zoogold', 'picsofdeadkids', 'picsofcaninedicks', 'tailbait', 'horsecock', 'horsevagina',
                                     'killthejews', 'killthejews', 'selfharmpics','EuropeanNationalism', 'pol')                AND author NOT IN (SELECT author FROM [fh-bigquery:reddit_comments.bots_201505])
                AND author != "[deleted]"
                AND NOT LOWER(author) CONTAINS "bot"))
          WHERE total_comments > 12000)))
  GROUP BY author, subreddit, comments_in_subreddit, total_comments)))
WHERE _rank <= 30
ORDER BY total_comments DESC, comments_in_subreddit DESC`;



  function runForceQuery() {
console.log("fquery");   
//   var request = gapi.client.bigquery.jobs.query({
//      'projectId': project_id,
//      'timeoutMs': '300000',
//      'query': fdgQuery,
//    });
//    request.execute(function(response) {
//        console.log("forceDirected", response.rows);
//        d3.select("#force-graph").selectAll('*').remove();
//        createForceGraph(response.rows);
//    });

    d3.select("#force-graph").selectAll('*').remove();
    if(fdgQuery == force_query2) {
      // create with FORCE_QUERY_2
      $.getJSON("sample_fdg_response2.json", result => graph_simulation = createForceGraph(result.rows));
    } else {
      // create with FORCE_QUERY_1
      $.getJSON("sample_fdg_response1.json", result => graph_simulation = createForceGraph(result.rows));
    }

     
  }

  function runSankeyQuery() {
//   var request = gapi.client.bigquery.jobs.query({
//      'projectId': project_id,
//      'timeoutMs': '300000',
//      'query': sankey_query,
//    });
//    request.execute(function(response) {
//        targetTotalValue = [];
//        sourceTotalValue = [];
//        d3.select("#sankey-diagram").selectAll('*').remove();
//        createSankeyDiagram(response.rows);
//    });

    d3.select("#sankey-diagram").selectAll('*').remove();
    $.getJSON("sample_sankey_response.json", result => {
      console.log(result.rows);
      return createSankeyDiagram(result.rows);
    });
  }

//  function authorize(event) {
//    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
//    return false;
//  }
//  function handleAuthResult(authResult) {
//    if (authResult && !authResult.error) {
//      loadApi();
//    } else {
//      console.error('Not authorized.')
//    }
//  }
//
//  function loadApi(){
//    gapi.client.load('bigquery', 'v2').then(
//      function() {
//        runForceQuery();
//        runSankeyQuery();
//      }
//    );
//  }

//gapi.load('client:auth', authorize);
//runForceQuery();
runSankeyQuery();





$('#fdgQuery2').on("click",function(){ 
  if(fdgQuery == force_query2) {
    console.log("already query2");
  } else {
    fdgQuery = force_query2;
//    gapi.load('client:auth', authorize);
    runForceQuery();
  }
});
$('#fdgQuery1').on("click",function(){ 
  if(fdgQuery == force_query1) {
    console.log("already query1");
    return;
  } else {
    fdgQuery = force_query1;
//    gapi.load('client:auth', authorize);
    runForceQuery();
  }
});


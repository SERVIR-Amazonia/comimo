class StatsPanel extends React.Component{
  state = {
    names:[],
    series:[],
    libloaded:false
  }
  URL = {
    ARSTATS : '/api/getareapredicted/'
  }
  fetchedFor=false;

  getAreaStats(date){
    var url = this.URL.ARSTATS+'?date='+date
    fetch(url).then(res => res.json())
      .then((res)=>{
        var data = [['Municipality','Area']]
        for (var i=0; i<res.names.length;i++){
          if (res.area[i]!=0) data.push([res.names[i],res.area[i]/1e6]);
        }
        var data = google.visualization.arrayToDataTable(data);

        // Optional; add a title and set the width and height of the chart
        var options = {'title':'Predicted Area for '+date+' (in sq km)', 'width':290, 'height':400, 'legend': { position: "none" }};

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.ColumnChart(document.getElementById('stats1'));
        chart.draw(data, options);
      },(err)=>{
        console.log('Error loading stats!', e);
      });
  }

  componentDidUpdate(){
    if (USER_STATE && this.state.libloaded && this.fetchedFor != this.props.selectedDate){
      this.getAreaStats(this.props.selectedDate);
      this.fetchedFor = this.props.selectedDate;
    }
  }

  componentDidMount(){
    google.charts.load('current',{'packages':['corechart']});
    google.charts.setOnLoadCallback(()=>{
      this.setState({
        libloaded:true
      });
    });
  }

  render(){
    if (!USER_STATE){
      var content = <div style={{'textAlign':'center','width':'100%'}}>
        <p> Login to view your subscriptions </p>
        <button type="button" className="btn btn-warning map-upd-btn" onClick={()=>{location.href = 'accounts/login'}}>Login</button>
      </div>
    }
    else{
      var content = <div>
        {"Regions with no mines are not shown. Please subscribe to more regions to view area of mines predicted within."}
        <div id="stats1">
        <b>Loading data...</b>
        </div>
      </div>
    }
    return <div className={['popup-container ',this.props.ishidden?'see-through':''].join(' ')} style={{'top':'250px'}}>
      {content}
    </div>
  }
}